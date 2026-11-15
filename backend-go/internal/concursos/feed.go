package concursos

import (
	"encoding/xml"
	"fmt"
	"io"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"
)

const urlCanonica = "http://digesto.unsl.edu.ar/"

var (
	reInscripcion = regexp.MustCompile(`Inscripciones:\s*(\d{2})/(\d{2})/(\d{2})\s+al\s+(\d{2})/(\d{2})/(\d{2})\s*-\s*(\S+)`)
	reCodigo      = regexp.MustCompile(`^([A-Za-z]+)-(\d+)-(\d+)/(\d{2})$`)
	reDocs        = regexp.MustCompile(`/docs/((\d{6})/(\d{14})_\d+\.pdf)$`)
)

type fuente struct {
	cliente *http.Client
	base    string
	pausa   time.Duration
	mu      sync.Mutex
	ultimo  time.Time
}

func nuevaFuente(pausa, espera time.Duration, base string) *fuente {
	return &fuente{base: base, pausa: pausa, cliente: &http.Client{
		Timeout: espera,
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			return http.ErrUseLastResponse
		},
	}}
}

func (f *fuente) pedir(direccion string) (*http.Response, error) {
	f.mu.Lock()
	defer f.mu.Unlock()
	if falta := f.pausa - time.Since(f.ultimo); falta > 0 {
		time.Sleep(falta)
	}
	log.Printf("pedido a %s", direccion)
	resp, err := f.cliente.Get(direccion)
	f.ultimo = time.Now()
	return resp, err
}

func latin1(charset string, entrada io.Reader) (io.Reader, error) {
	if !strings.EqualFold(charset, "ISO-8859-1") {
		return nil, fmt.Errorf("codificación %s desconocida", charset)
	}
	bytes, err := io.ReadAll(entrada)
	if err != nil {
		return nil, err
	}
	runas := make([]rune, len(bytes))
	for i, b := range bytes {
		runas[i] = rune(b)
	}
	return strings.NewReader(string(runas)), nil
}

func (f *fuente) leerFeed(codigo string) ([]item, error) {
	resp, err := f.pedir(f.base + "feeds/" + codigo + "-conc.xml")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("el feed respondió %d", resp.StatusCode)
	}

	decodificador := xml.NewDecoder(resp.Body)
	decodificador.CharsetReader = latin1
	var canal rss
	if err := decodificador.Decode(&canal); err != nil {
		return nil, err
	}
	if len(canal.Items) == 0 {
		return nil, fmt.Errorf("el feed no trae ningún item")
	}
	return canal.Items, nil
}

func agrupar(items []item) ([]Concurso, error) {
	concursos := []Concurso{}
	indice := map[string]int{}

	for _, it := range items {
		titulo := strings.TrimSpace(reparar(it.Title))
		if strings.HasPrefix(titulo, "No hay nuevos llamados") {
			continue
		}

		partes := strings.Split(titulo, "|")
		for i := range partes {
			partes[i] = strings.TrimSpace(partes[i])
		}
		if len(partes) < 5 || partes[0] == "" || partes[1] == "" || partes[2] == "" || partes[3] == "" || partes[4] == "" {
			return nil, fmt.Errorf("título con otra forma: %s", titulo)
		}
		llamado := Llamado{
			Departamento: partes[0],
			Area:         partes[1],
			Cargo:        partes[2],
			Caracter:     partes[4],
		}
		if partes[3] != "-" {
			dedicacion := partes[3]
			llamado.Dedicacion = &dedicacion
		}

		inscripcion := reInscripcion.FindStringSubmatch(reparar(it.Description))
		if inscripcion == nil {
			return nil, fmt.Errorf("descripción con otra forma: %s", strings.TrimSpace(reparar(it.Description)))
		}
		llamado.InscripcionDesde = "20" + inscripcion[3] + "-" + inscripcion[2] + "-" + inscripcion[1]
		llamado.InscripcionHasta = "20" + inscripcion[6] + "-" + inscripcion[5] + "-" + inscripcion[4]
		codigo := inscripcion[7]

		if pos, existe := indice[codigo]; existe {
			concursos[pos].Llamados = append(concursos[pos].Llamados, llamado)
			continue
		}

		partesCodigo := reCodigo.FindStringSubmatch(codigo)
		if partesCodigo == nil {
			return nil, fmt.Errorf("código con otra forma: %s", codigo)
		}
		origen, err := strconv.Atoi(partesCodigo[2])
		if err != nil {
			return nil, fmt.Errorf("código con otra forma: %s", codigo)
		}
		anio, err := strconv.Atoi(partesCodigo[4])
		if err != nil {
			return nil, fmt.Errorf("código con otra forma: %s", codigo)
		}

		indice[codigo] = len(concursos)
		concursos = append(concursos, Concurso{
			Codigo:     codigo,
			Prefijo:    partesCodigo[1],
			Origen:     origen,
			Numero:     partesCodigo[3],
			Anio:       2000 + anio,
			URLExterna: strings.TrimSpace(it.Link),
			Llamados:   []Llamado{llamado},
		})
	}
	return concursos, nil
}

func (f *fuente) completarArchivo(c *Concurso) error {
	resp, err := f.pedir(strings.Replace(c.URLExterna, urlCanonica, f.base, 1))
	if err != nil {
		return err
	}
	resp.Body.Close()

	destino := reDocs.FindStringSubmatch(resp.Header.Get("Location"))
	if resp.StatusCode < 300 || resp.StatusCode > 399 || destino == nil {
		return fmt.Errorf("el enlace de %s no redirige a un PDF", c.Codigo)
	}
	registro, err := time.Parse("20060102150405", destino[3])
	if err != nil {
		return fmt.Errorf("el enlace de %s no redirige a un PDF", c.Codigo)
	}
	c.ArchivoRuta = destino[1]
	c.FechaRegistro = registro.Format("2006-01-02T15:04:05")
	return nil
}

func (f *fuente) concursos(codigo string) ([]Concurso, error) {
	items, err := f.leerFeed(codigo)
	if err != nil {
		return nil, err
	}
	concursos, err := agrupar(items)
	if err != nil {
		return nil, err
	}
	for i := range concursos {
		if err := f.completarArchivo(&concursos[i]); err != nil {
			return nil, err
		}
	}
	return concursos, nil
}
