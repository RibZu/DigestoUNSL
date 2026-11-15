import { Outlet, ScrollRestoration, useLoaderData } from 'react-router'
import Header from './Header'
import Footer from './Footer'
import './LayoutSitio.css'

function LayoutSitio() {
  const usuario = useLoaderData()

  return (
    <div className="app-layout">
      <Header usuario={usuario} />
      <main className="app-content">
        <Outlet context={{ usuario }} />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  )
}

export default LayoutSitio
