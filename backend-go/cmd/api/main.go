package main

import (
	"bufio"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"backend-go/internal/concursos"
	"backend-go/internal/planes"
)

func cargarEnv(ruta string) {
	archivo, err := os.Open(ruta)
	if err != nil {
		return
	}
	defer archivo.Close()

	lector := bufio.NewScanner(archivo)
	for lector.Scan() {
		linea := strings.TrimSpace(lector.Text())
		clave, valor, hay := strings.Cut(linea, "=")
		if !hay {
			continue
		}
		clave = strings.TrimSpace(clave)
		if _, existe := os.LookupEnv(clave); !existe {
			os.Setenv(clave, strings.TrimSpace(valor))
		}
	}
}

func texto(clave, defecto string) string {
	if valor := os.Getenv(clave); valor != "" {
		return valor
	}
	return defecto
}

func duracion(clave string, defecto time.Duration) time.Duration {
	valor := os.Getenv(clave)
	if valor == "" {
		return defecto
	}
	d, err := time.ParseDuration(valor)
	if err != nil {
		log.Fatalf("%s inválida: %v", clave, err)
	}
	return d
}

func noEncontrada(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusNotFound)
	w.Write([]byte(`{"error":"Ruta no encontrada"}`))
	log.Printf("%s %s -> 404", r.Method, r.URL.Path)
}

func main() {
	cargarEnv(".env")
	puerto := texto("PORT", "8080")
	pausa := duracion("PAUSA", time.Second)
	espera := duracion("ESPERA", 30*time.Second)

	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/v1/dependencias/{codigo}/concursos", concursos.Handler(pausa, espera))
	mux.HandleFunc("GET /api/v1/dependencias/{codigo}/planes", planes.Handler(pausa, espera))
	mux.HandleFunc("/", noEncontrada)

	log.Printf("backend-go escuchando en el puerto %s", puerto)
	log.Fatal(http.ListenAndServe(":"+puerto, mux))
}
