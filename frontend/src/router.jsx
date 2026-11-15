import { createBrowserRouter } from 'react-router'
import LayoutSitio from './shared/layout/LayoutSitio'
import NoEncontradaPage from './shared/pages/NoEncontradaPage'
import Spinner from './shared/components/Spinner'
import { AyudaPage } from './features/ayuda'
import {
  LoginPage,
  RestablecerContrasenaPage,
  leerSesion,
  protegerModulo,
  protegerRuta,
  redirigirSiHaySesion,
} from './features/auth'
import { BusquedaPage } from './features/busqueda'
import { ConcursosPage } from './features/concursos'
import { EstadisticasPage } from './features/estadisticas'
import { EstadisticasPrivadasPage } from './features/estadisticas-privadas'
import { GestionConcursosPage } from './features/gestion-concursos'
import { GestionDocumentosPage } from './features/gestion-documentos'
import { GestionUsuariosPage } from './features/usuarios'
import { HomePage } from './features/home'
import { MiUsuarioPage } from './features/mi-usuario'
import { NormativaPage } from './features/normativas'
import { AccesoDenegadoPage, PanelPage } from './features/panel'
import { PlanDeEstudioPage, PlanesDeEstudioPage } from './features/planes-de-estudio'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutSitio />,
    loader: leerSesion,
    hydrateFallbackElement: <Spinner />,
    errorElement: <NoEncontradaPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'busqueda', element: <BusquedaPage /> },
      { path: 'normativas/:id', element: <NormativaPage /> },
      { path: 'concursos', element: <ConcursosPage /> },
      { path: 'ayuda', element: <AyudaPage /> },
      { path: 'estadisticas', element: <EstadisticasPage /> },
      { path: 'planes-de-estudio', element: <PlanesDeEstudioPage /> },
      { path: 'planes-de-estudio/:carrera/:plan', element: <PlanDeEstudioPage /> },
      {
        path: 'login',
        element: <LoginPage />,
        loader: redirigirSiHaySesion,
        hydrateFallbackElement: <Spinner />,
      },
      {
        path: 'restablecer-contrasena',
        element: <RestablecerContrasenaPage />,
        loader: redirigirSiHaySesion,
        hydrateFallbackElement: <Spinner />,
      },
      { path: '*', element: <NoEncontradaPage /> },
    ],
  },
  {
    path: '/panel',
    element: <LayoutSitio />,
    loader: protegerRuta,
    hydrateFallbackElement: <Spinner />,
    errorElement: <NoEncontradaPage />,
    children: [
      { index: true, element: <PanelPage /> },
      {
        path: 'documentos',
        element: <GestionDocumentosPage />,
        loader: protegerModulo('documentos'),
      },
      {
        path: 'concursos',
        element: <GestionConcursosPage />,
        loader: protegerModulo('concursos'),
      },
      {
        path: 'usuarios',
        element: <GestionUsuariosPage />,
        loader: protegerModulo('usuarios'),
      },
      {
        path: 'estadisticas',
        element: <EstadisticasPrivadasPage />,
        loader: protegerModulo('estadisticas'),
      },
      {
        path: 'mi-usuario',
        element: <MiUsuarioPage />,
        loader: protegerModulo('mi-usuario'),
      },
      { path: 'acceso-denegado', element: <AccesoDenegadoPage /> },
    ],
  },
])
