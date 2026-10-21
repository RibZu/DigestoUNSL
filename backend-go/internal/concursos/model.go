package concursos

type Concurso struct {
	Codigo        string    `json:"codigo"`
	Prefijo       string    `json:"prefijo"`
	Origen        int       `json:"origen"`
	Numero        string    `json:"numero"`
	Anio          int       `json:"anio"`
	URLExterna    string    `json:"url_externa"`
	ArchivoRuta   string    `json:"archivo_ruta"`
	FechaRegistro string    `json:"fecha_registro"`
	Llamados      []Llamado `json:"llamados"`
}

type Llamado struct {
	Departamento     string  `json:"departamento"`
	Area             string  `json:"area"`
	Cargo            string  `json:"cargo"`
	Dedicacion       *string `json:"dedicacion"`
	Caracter         string  `json:"caracter"`
	InscripcionDesde string  `json:"inscripcion_desde"`
	InscripcionHasta string  `json:"inscripcion_hasta"`
}

type rss struct {
	Items []item `xml:"channel>item"`
}

type item struct {
	Title       string `xml:"title"`
	Link        string `xml:"link"`
	Description string `xml:"description"`
}
