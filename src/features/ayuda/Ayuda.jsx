import { useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { BLOQUES_AYUDA, ENLACES_DE_INTERES } from './ayuda.contenido.js'
import './Ayuda.css'

export default function Ayuda() {
    const { hash } = useLocation()

    useEffect(() => {
        if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
    }, [hash])

    return (
        <section className="ayuda-page">
            <header className="ayuda-page__encabezado">
                <h1>Ayuda</h1>
                <p>Dudas frecuentes sobre el Digesto Administrativo y cómo usar cada sección del sitio</p>
            </header>

            <nav className="ayuda-page__indice" aria-label="Índice de la ayuda">
                <ul>
                    {BLOQUES_AYUDA.map((bloque) => (
                        <li key={bloque.id}>
                            <a href={`#${bloque.id}`} className="btn btn-sm btn-outline-secondary">
                                {bloque.titulo}
                            </a>
                        </li>
                    ))}
                    <li>
                        <a href="#enlaces-de-interes" className="btn btn-sm btn-outline-secondary">
                            Enlaces de interés
                        </a>
                    </li>
                </ul>
            </nav>

            {BLOQUES_AYUDA.map((bloque) => (
                <section key={bloque.id} id={bloque.id} className="ayuda-page__bloque">
                    <h2>{bloque.titulo}</h2>
                    {bloque.preguntas.map((pregunta) => (
                        <article key={pregunta.id} className="ayuda-page__pregunta">
                            <h3>{pregunta.pregunta}</h3>
                            <p>{pregunta.respuesta}</p>
                            {pregunta.puntos && (
                                <ul>
                                    {pregunta.puntos.map((punto) => (
                                        <li key={punto}>{punto}</li>
                                    ))}
                                </ul>
                            )}
                        </article>
                    ))}
                    {bloque.ruta && (
                        <Link to={bloque.ruta} className="ayuda-page__ir">
                            Ir a {bloque.titulo}
                        </Link>
                    )}
                </section>
            ))}

            <section id="enlaces-de-interes" className="ayuda-page__bloque">
                <h2>Enlaces de interés</h2>
                <ul>
                    {ENLACES_DE_INTERES.map((enlace) => (
                        <li key={enlace.id}>
                            <a href={enlace.url} target="_blank" rel="noreferrer">
                                {enlace.texto}
                            </a>
                        </li>
                    ))}
                </ul>
            </section>
        </section>
    )
}
