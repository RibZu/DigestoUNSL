package planes

import (
	"encoding/json"
	"log"
	"net/http"
	"time"
)

var dependencias = map[string]int{
	"fqbf":  2,
	"fcfmn": 3,
	"fch":   4,
	"ipau":  8,
	"fcs":   10,
	"ftu":   11,
	"fapsi": 12,
	"fica":  14,
	"fcejs": 15,
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
		fac, existe := dependencias[codigo]
		if !existe {
			log.Printf("GET %s -> 404", r.URL.Path)
			responder(w, http.StatusNotFound, map[string]string{
				"error": "La dependencia " + codigo + " no tiene planes",
			})
			return
		}

		carreras, err := f.planes(fac)
		if err != nil {
			log.Printf("GET %s -> 502: %v", r.URL.Path, err)
			responder(w, http.StatusBadGateway, map[string]string{
				"error": "No se pudieron leer los planes de " + codigo,
			})
			return
		}

		log.Printf("GET %s -> 200 (%d carreras)", r.URL.Path, len(carreras))
		responder(w, http.StatusOK, carreras)
	}
}
