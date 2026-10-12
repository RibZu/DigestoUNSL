import { useState, useEffect } from 'react'
import mockData from './documentos.mock.json'
import FormularioAlta from './components/FormularioAlta.jsx'
import TablaGestion from './components/TablaGestion.jsx'
import EncabezadoPagina from '../../shared/layout/EncabezadoPagina'
import './AltaDocumento.css'

const { documentosIniciales } = mockData

export default function AltaDocumento() {
  const [activeTab, setActiveTab] = useState('gestion') // 'alta' | 'gestion'
  const [documentos, setDocumentos] = useState(() => {
    const local = localStorage.getItem('digesto_documentos')
    if (local) {
      try {
        return JSON.parse(local)
      } catch (e) {
        console.error('Error parseando localStorage:', e)
      }
    }
    return documentosIniciales
  })

  const [editingDoc, setEditingDoc] = useState(null)
  const [toast, setToast] = useState({ show: false, message: '', isError: false })

  // Persistir documentos en localStorage
  useEffect(() => {
    localStorage.setItem('digesto_documentos', JSON.stringify(documentos))
  }, [documentos])

  const triggerToast = (message, isError = false) => {
    setToast({ show: true, message, isError })
    setTimeout(() => {
      setToast({ show: false, message: '', isError: false })
    }, 4000)
  }

  const handleGuardarDocumento = (docData) => {
    if (editingDoc) {
      // Modo Edición
      setDocumentos((prev) =>
        prev.map((doc) => (doc.id === editingDoc.id ? { ...doc, ...docData } : doc))
      )
      triggerToast('¡Documento actualizado correctamente!')
    } else {
      // Modo Nuevo Registro
      setDocumentos((prev) => [docData, ...prev])
      triggerToast('¡Documento registrado y agregado a la gestión correctamente!')
    }
    setEditingDoc(null)
    setActiveTab('gestion')
  }

  const handleEditDocument = (doc) => {
    setEditingDoc(doc)
    setActiveTab('alta')
  }

  const handleDeleteDocument = (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este documento?')) {
      setDocumentos((prev) => prev.filter((doc) => doc.id !== id))
      triggerToast('Documento eliminado correctamente.')
    }
  }

  const handleCancelForm = () => {
    setEditingDoc(null)
    if (editingDoc) {
      setActiveTab('gestion')
    }
  }

  return (
    <>
      <EncabezadoPagina titulo="Gestión y Alta de Documentos">
        <p>Panel de administración de normativas del Digesto UNSL extraídas y guardadas localmente.</p>
      </EncabezadoPagina>

    <div className="alta-page">

      {/* Navegación por Pestañas */}
      <div className="alta-tabs">
        <button
          className={`alta-tab-btn ${activeTab === 'gestion' ? 'active' : ''}`}
          onClick={() => setActiveTab('gestion')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
          Panel de Gestión
        </button>
        <button
          className={`alta-tab-btn ${activeTab === 'alta' ? 'active' : ''}`}
          onClick={() => {
            if (activeTab === 'alta' && editingDoc) {
              setEditingDoc(null)
            } else {
              setActiveTab('alta')
            }
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          {editingDoc ? 'Editar Documento' : 'Cargar Nuevo Documento'}
        </button>
      </div>

      {/* PESTAÑA 1: PANEL DE GESTIÓN */}
      {activeTab === 'gestion' && (
        <TablaGestion
          documentos={documentos}
          onEdit={handleEditDocument}
          onDelete={handleDeleteDocument}
        />
      )}

      {/* PESTAÑA 2: FORMULARIO DE ALTA O EDICIÓN */}
      {activeTab === 'alta' && (
        <FormularioAlta
          documentoEditar={editingDoc}
          onGuardar={handleGuardarDocumento}
          onCancelar={handleCancelForm}
          triggerToast={triggerToast}
        />
      )}

      {toast.show && (
        <div className={`alta-toast ${toast.isError ? 'error' : 'success'}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={toast.isError ? '#ef4444' : '#10b981'} strokeWidth="2">
            {toast.isError ? (
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01"></path>
            ) : (
              <>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </>
            )}
          </svg>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
    </>
  )
}
