import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import App from '../App.jsx'
import Home from '../features/home/Home.jsx'
import Busqueda from '../features/busqueda/Busqueda.jsx'
import Login from '../features/auth/login/Login.jsx'
import Estadisticas from '../features/estadisticas/Estadisticas.jsx'
import Novedades from '../features/novedades/Novedades.jsx'
import NormativaDetail from '../features/normativas/NormativaDetail.jsx'
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
      { path: 'concursos', element: <SectionPlaceholder title={labelFor('concursos')} /> },
      { path: 'ayuda', element: <SectionPlaceholder title={labelFor('ayuda')} /> },
      { path: 'estadisticas', element: <Estadisticas /> },
      {
        path: 'planes-de-estudio',
        element: <SectionPlaceholder title={labelFor('planes-de-estudio')} />,
      },
      {
        path: 'planes-de-estudio/:facultad/:carrera',
        element: <SectionPlaceholder title={labelFor('planes-de-estudio')} />,
      },
      { path: 'login', element: <Login /> },
      { path: '*', element: <SectionPlaceholder title="Página no encontrada" /> },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
