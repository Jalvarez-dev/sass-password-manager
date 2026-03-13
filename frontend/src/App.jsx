import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiUrl, setApiUrl] = useState('');
  const [selectedPersona, setSelectedPersona] = useState(null);

  useEffect(() => {
    // Detectar la URL de la API según el entorno
    const url = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    setApiUrl(url);
    console.log('API URL configurada:', url);
  }, []);

  // Cargar personas al montar el componente
  useEffect(() => {
    if (!apiUrl) return;

    const cargarPersonas = async () => {
      try {
        setLoading(true);
        console.log('Cargando personas desde:', `${apiUrl}/api/personas`);
        
        const response = await fetch(`${apiUrl}/api/personas`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`Error HTTP! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Personas cargadas:', data);
        setPersonas(data);
        setError(null);
      } catch (err) {
        console.error('Error cargando personas:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarPersonas();
  }, [apiUrl]);

  // Función para cargar detalles de una persona
  const cargarDetallePersona = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/personas/${id}`);
      const data = await response.json();
      setSelectedPersona(data);
    } catch (err) {
      console.error('Error cargando detalle:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para recargar personas
  const recargarPersonas = async () => {
    setSelectedPersona(null);
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/personas`);
      const data = await response.json();
      setPersonas(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && personas.length === 0 && !selectedPersona) {
    return (
      <div className="App">
        <header className="App-header">
          <div className="loading-container">
            <h2>Cargando datos del backend...</h2>
            <p>Conectando a {apiUrl}</p>
            <div className="spinner"></div>
          </div>
        </header>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <header className="App-header">
          <h2 style={{ color: 'red' }}>Error de conexión</h2>
          <p>{error}</p>
          <p>Intentando conectar a: {apiUrl}</p>
          <button className="reload-button" onClick={recargarPersonas}>
            Reintentar
          </button>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>📋 Lista de Personas</h1>
        <p className="api-info">API: {apiUrl}</p>
        
        <button className="reload-button" onClick={recargarPersonas}>
          🔄 Recargar Personas
        </button>

        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Cargando...</p>
          </div>
        )}

        {selectedPersona ? (
          <div className="detalle-persona">
            <button className="back-button" onClick={() => setSelectedPersona(null)}>
              ← Volver a la lista
            </button>
            
            <h2>Detalle de {selectedPersona.nombre}</h2>
            
            <div className="persona-card detalle">
              <img 
                src={selectedPersona.avatar} 
                alt={selectedPersona.nombre}
                className="avatar-large"
              />
              <div className="persona-info">
                <p><strong>ID:</strong> {selectedPersona.id}</p>
                <p><strong>Nombre:</strong> {selectedPersona.nombre}</p>
                <p><strong>Edad:</strong> {selectedPersona.edad} años</p>
                <p><strong>Email:</strong> {selectedPersona.email}</p>
                <p><strong>Ciudad:</strong> {selectedPersona.ciudad}</p>
                <p><strong>Profesión:</strong> {selectedPersona.profesion}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="personas-grid">
            {personas.map((persona) => (
              <div 
                key={persona.id} 
                className="persona-card"
                onClick={() => cargarDetallePersona(persona.id)}
              >
                <img 
                  src={persona.avatar} 
                  alt={persona.nombre}
                  className="avatar"
                />
                <h3>{persona.nombre}</h3>
                <p>Edad: {persona.edad}</p>
                <p>Ciudad: {persona.ciudad}</p>
                <p className="profesion">{persona.profesion}</p>
                <button className="ver-detalle-btn">
                  Ver detalle →
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="info-footer">
          <p>Total de personas: {personas.length}</p>
        </div>
      </header>
    </div>
  );
}

export default App;