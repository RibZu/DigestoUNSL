import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import App from '../App.jsx'
import Home from '../features/home/Home.jsx'
import SectionPlaceholder from '../shared/ui/SectionPlaceholder.jsx'
import { navigationSections } from './routes.js'
import Concursos from '../features/concursos/Concursos.jsx'

function labelFor(key) {
  return navigationSections.find((section) => section.key === key).label
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'busqueda', element: <SectionPlaceholder title={labelFor('busqueda')} /> },
      { path: 'novedades', element: <SectionPlaceholder title={labelFor('novedades')} /> },
      { path: 'concursos', element: <Concursos/> },
      { path: 'ayuda', element: <SectionPlaceholder title={labelFor('ayuda')} /> },


      {
        path: 'planes-de-estudio',
        element: <SectionPlaceholder title={labelFor('planes-de-estudio')} />,
      },
      {
        path: 'planes-de-estudio/:facultad/:carrera',
        element: <SectionPlaceholder title={labelFor('planes-de-estudio')} />,
      },
      { path: 'login', element: <SectionPlaceholder title={labelFor('auth/login')} /> },
      { path: '*', element: <SectionPlaceholder title="Página no encontrada" /> },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
