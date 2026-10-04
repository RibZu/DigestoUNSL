import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import App from '../App.jsx'
import Home from '../features/home/Home.jsx'
import Busqueda from '../features/busqueda/Busqueda.jsx'
import Login from '../features/auth/login/Login.jsx'
import Estadisticas from '../features/estadisticas/Estadisticas.jsx'
import EstadisticasPrivadas from '../features/estadisticas-privadas/EstadisticasPrivadas.jsx'
import Panel from '../features/panel/Panel.jsx'
import GestionConcursos from '../features/gestion-concursos/GestionConcursos.jsx'
import Novedades from '../features/novedades/Novedades.jsx'
import NormativaDetail from '../features/normativas/NormativaDetail.jsx'
import Ayuda from '../features/ayuda/Ayuda.jsx'
import Concursos from '../features/concursos/Concursos.jsx'
import PlanesDeEstudio from '../features/planes-de-estudio/PlanesDeEstudio.jsx'
import PlanDeEstudio from '../features/planes-de-estudio/PlanDeEstudio.jsx'
import PaginaNoEncontrada from '../shared/ui/PaginaNoEncontrada.jsx'
import AltaDocumento from '../features/alta/AltaDocumento.jsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'busqueda', element: <Busqueda /> },
      { path: 'novedades', element: <Novedades /> },
      { path: 'normativas/:id', element: <NormativaDetail /> },
      { path: 'concursos', element: <Concursos /> },
      { path: 'ayuda', element: <Ayuda /> },
      { path: 'estadisticas', element: <Estadisticas /> },
      {
        path: 'login',
        children: [
          { index: true, element: <Login /> },
          { path: 'estadisticas', element: <EstadisticasPrivadas /> },
          { path: 'panel', element: <Panel /> },
          { path: 'concursos', element: <GestionConcursos /> },
        ],
      },
      { path: 'planes-de-estudio', element: <PlanesDeEstudio /> },
      { path: 'planes-de-estudio/:carrera/:plan', element: <PlanDeEstudio /> },

      { path: 'alta', element: <AltaDocumento /> },
      { path: 'alta-documentos', element: <AltaDocumento /> },
      { path: '*', element: <PaginaNoEncontrada /> },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
