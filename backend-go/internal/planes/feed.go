package planes

import (
	"fmt"
	"html"
	"io"
	"log"
	"net/http"
	"net/url"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"
)

const urlCanonica = "http://planesestudio.unsl.edu.ar/"

var (
	reEtiquetas = regexp.MustCompile(`<[^>]*>`)
	reFila      = regexp.MustCompile(`(?s)<td class=renglon[12]tablamat>([^<]*)</td>\s*<td class="renglon[12]tablamat"[^>]*>(.*?)</td>`)
	reVigente   = regexp.MustCompile(`<a class="PlanVigente" href="([^"]+)">([^<]+)</a>`)
	reOrdenanza = regexp.MustCompile(`^(.+?)\s*\((.+)\)$`)
	reAnios     = regexp.MustCompile(`(?s)Cantidad de Materias</td>\s*</tr>\s*<tr[^>]*>\s*(?:<td[^>]*>[^<]*</td>\s*){3}<td[^>]*>\s*(\d+)\s*</td>`)
	reAnio      = regexp.MustCompile(`Materias del\s*(\S*)\s*A&ntilde;o`)
	reMateria   = regexp.MustCompile(`(?s)<td class=renglon[12]tablamat\s*>\s*(\d+)\s*\(([^)]+)\)\s*</td>\s*<td[^>]*>(.*?)</td>\s*<td[^>]*>(.*?)</td>`)
)

var ordinales = map[string]int{
	"Primer":  1,
	"Segundo": 2,
	"Tercer":  3,
	"Cuarto":  4,
	"Quinto":  5,
	"Sexto":   6,
	"Séptimo": 7,
}

type fuente struct {
	cliente *http.Client
	base    string
	pausa   time.Duration
	mu      sync.Mutex
	ultimo  time.Time
}

func nuevaFuente(pausa, espera time.Duration, base string) *fuente {
	return &fuente{base: base, pausa: pausa, cliente: &http.Client{Timeout: espera}}
}

func (f *fuente) pedir(direccion string) (string, error) {
	f.mu.Lock()
	defer f.mu.Unlock()
	if falta := f.pausa - time.Since(f.ultimo); falta > 0 {
		time.Sleep(falta)
	}
	log.Printf("pedido a %s", direccion)
	resp, err := f.cliente.Get(direccion)
	f.ultimo = time.Now()
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("planesestudio respondió %d", resp.StatusCode)
	}
	bytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}
	runas := make([]rune, len(bytes))
	for i, b := range bytes {
		runas[i] = rune(b)
	}
	return string(runas), nil
}

func limpiar(s string) string {
	s = reEtiquetas.ReplaceAllString(s, " ")
	s = reparar(s)
	s = html.UnescapeString(s)
	return strings.Join(strings.Fields(s), " ")
}

func leerListado(pagina string) ([]Carrera, error) {
	carreras := []Carrera{}
	indice := map[string]int{}
	leidos := 0

	for _, fila := range reFila.FindAllStringSubmatch(pagina, -1) {
		for _, enlace := range reVigente.FindAllStringSubmatch(fila[2], -1) {
			href := strings.ReplaceAll(enlace[1], "&amp;", "&")
			consulta, err := url.ParseQuery(href[strings.Index(href, "?")+1:])

			if err != nil {
				return nil, fmt.Errorf("enlace con otra forma: %s", href)
			}
			versionID, err := strconv.Atoi(consulta.Get("version_id"))

			if err != nil || consulta.Get("car") == "" || consulta.Get("plan") == "" {
				return nil, fmt.Errorf("enlace con otra forma: %s", href)
			}
			ordenanza := reOrdenanza.FindStringSubmatch(limpiar(enlace[2]))
			if ordenanza == nil {
				return nil, fmt.Errorf("ordenanza con otra forma: %s", limpiar(enlace[2]))
			}

			codigo := consulta.Get("car")
			pos, existe := indice[codigo]
			if !existe {
				pos = len(carreras)
				indice[codigo] = pos
				carreras = append(carreras, Carrera{Codigo: codigo, Nombre: limpiar(fila[1])})
			}
			leidos++
			carreras[pos].Planes = append(carreras[pos].Planes, Plan{
				Plan:       consulta.Get("plan"),
				Ordenanza:  ordenanza[1],
				URLOficial: urlCanonica + href,
				VersionID:  versionID,
			})
		}
	}
	if leidos == 0 {
		return nil, fmt.Errorf("el listado no trae planes vigentes")
	}
	if total := len(reVigente.FindAllString(pagina, -1)); total != leidos {
		return nil, fmt.Errorf("el listado trae %d planes vigentes y se leyeron %d", total, leidos)
	}
	return carreras, nil
}

func leerPlan(pagina string) (int, []Materia, error) {
	coincidencia := reAnios.FindStringSubmatch(pagina)
	if coincidencia == nil {
		return 0, nil, fmt.Errorf("la página del plan no trae los años")
	}
	anios, err := strconv.Atoi(coincidencia[1])
	if err != nil {
		return 0, nil, err
	}

	titulos := reAnio.FindAllStringSubmatchIndex(pagina, -1)
	materias := []Materia{}
	for i, titulo := range titulos {
		ordinal := html.UnescapeString(pagina[titulo[2]:titulo[3]])
		if ordinal == "" {
			continue
		}
		anio, existe := ordinales[ordinal]
		if !existe {
			return 0, nil, fmt.Errorf("año desconocido: %s", ordinal)
		}

		fin := len(pagina)
		if i+1 < len(titulos) {
			fin = titulos[i+1][0]
		}
		for _, fila := range reMateria.FindAllStringSubmatch(pagina[titulo[1]:fin], -1) {
			orden, err := strconv.Atoi(fila[1])
			if err != nil {
				return 0, nil, err
			}
			materia := Materia{
				Anio:   anio,
				Orden:  orden,
				Codigo: strings.TrimSpace(fila[2]),
				Nombre: limpiar(fila[3]),
			}
			if periodo := limpiar(fila[4]); periodo != "" {
				materia.Periodo = &periodo
			}
			materias = append(materias, materia)
		}
	}
	if len(materias) == 0 {
		return 0, nil, fmt.Errorf("el plan no trae materias")
	}
	return anios, materias, nil
}

func (f *fuente) planes(fac int) ([]Carrera, error) {
	pagina, err := f.pedir(f.base + "index.php?action=fac_g3&fac=" + strconv.Itoa(fac))
	if err != nil {
		return nil, err
	}
	carreras, err := leerListado(pagina)
	if err != nil {
		return nil, err
	}

	for i := range carreras {
		for j := range carreras[i].Planes {
			plan := &carreras[i].Planes[j]
			pagina, err := f.pedir(f.base + strings.TrimPrefix(plan.URLOficial, urlCanonica))
			if err != nil {
				return nil, fmt.Errorf("plan %s de %s: %w", plan.Plan, carreras[i].Codigo, err)
			}
			plan.Anios, plan.Materias, err = leerPlan(pagina)
			if err != nil {
				return nil, fmt.Errorf("plan %s de %s: %w", plan.Plan, carreras[i].Codigo, err)
			}
		}
	}
	return carreras, nil
}
