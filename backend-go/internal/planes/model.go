package planes

type Carrera struct {
	Codigo string `json:"codigo"`
	Nombre string `json:"nombre"`
	Planes []Plan `json:"planes"`
}

type Plan struct {
	Plan       string    `json:"plan"`
	Ordenanza  string    `json:"ordenanza"`
	Anios      int       `json:"anios"`
	URLOficial string    `json:"url_oficial"`
	VersionID  int       `json:"version_id"`
	Materias   []Materia `json:"materias"`
}

type Materia struct {
	Anio    int     `json:"anio"`
	Orden   int     `json:"orden"`
	Codigo  string  `json:"codigo"`
	Nombre  string  `json:"nombre"`
	Periodo *string `json:"periodo"`
}
