import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './contexts/AuthContext';
import { VaultProvider } from './contexts/VaultContext';
import { NotificationProvider } from './contexts/NotificationContext';
import './index.css'
import App from './App.jsx'
import './variables.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <VaultProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </VaultProvider>
    </AuthProvider>
  </StrictMode>,
)
