//importamos dependencias
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import App from '../App.jsx'
import Home from '../features/home/Home.jsx'
import Busqueda from '../features/busqueda/Busqueda.jsx'
import Login from '../features/auth/login/Login.jsx'
import Estadisticas from '../features/estadisticas/Estadisticas.jsx'
import Novedades from '../features/novedades/Novedades.jsx'
import NormativaDetail from '../features/normativas/NormativaDetail.jsx'
import Ayuda from '../features/ayuda/Ayuda.jsx'
import Concursos from '../features/concursos/Concursos.jsx'
import PlanesDeEstudio from '../features/planes-de-estudio/PlanesDeEstudio.jsx'
import SectionPlaceholder from '../shared/ui/SectionPlaceholder.jsx'
import { navigationSections } from './routes.js'

function labelFor(key) {
  return navigationSections.find((section) => section.key === key).label
}

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
      { path: 'planes-de-estudio', element: <PlanesDeEstudio/>,},
      { path: 'login', element: <Login /> },// implementar loader PENDIENTE
      { path: '*', element: <SectionPlaceholder title="Página no encontrada" /> },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
