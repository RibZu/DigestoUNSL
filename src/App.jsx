import { Outlet } from 'react-router'
import Header from './shared/layout/Header'
import Footer from './shared/layout/Footer'
import './App.css'

function App() {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App
