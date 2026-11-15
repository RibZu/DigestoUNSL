package concursos

import (
	"encoding/json"
	"log"
	"net/http"
	"time"
)

var facultades = map[string]bool{
	"fqbf":  true,
	"fcfmn": true,
	"fch":   true,
	"fices": true,
	"fcs":   true,
	"ftu":   true,
	"fapsi": true,
	"fica":  true,
	"fcejs": true,
}

func responder(w http.ResponseWriter, estado int, v any) {
	cuerpo, err := json.Marshal(v)
	if err != nil {
		estado = http.StatusInternalServerError
		cuerpo = []byte(`{"error":"Error del servidor"}`)
	}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(estado)
	w.Write(cuerpo)
}

func Handler(pausa, espera time.Duration, base string) http.HandlerFunc {
	f := nuevaFuente(pausa, espera, base)

	return func(w http.ResponseWriter, r *http.Request) {
		codigo := r.PathValue("codigo")
		if !facultades[codigo] {
			log.Printf("GET %s -> 404", r.URL.Path)
			responder(w, http.StatusNotFound, map[string]string{
				"error": "La dependencia " + codigo + " no tiene feed de concursos",
			})
			return
		}

		concursos, err := f.concursos(codigo)
		if err != nil {
			log.Printf("GET %s -> 502: %v", r.URL.Path, err)
			responder(w, http.StatusBadGateway, map[string]string{
				"error": "No se pudo leer el feed de concursos de " + codigo,
			})
			return
		}

		log.Printf("GET %s -> 200 (%d concursos)", r.URL.Path, len(concursos))
		responder(w, http.StatusOK, concursos)
	}
}
