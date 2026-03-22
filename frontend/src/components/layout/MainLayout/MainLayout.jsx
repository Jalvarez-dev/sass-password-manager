/**
 * MainLayout - Layout principal de la aplicación autenticada
 * Combina Header, Sidebar y área de contenido
 */

import { useState } from 'react';
import { Header } from '../Header/Header';
import { Sidebar } from '../Sidebar/Sidebar';
import { MobileNav } from '../MobileNav/MobileNav';
import { ToastContainer } from '../../common/Toast/ToastContainer';
import { useVault } from '../../../contexts/VaultContext';
import './MainLayout.css';

export const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setSearchQuery } = useVault();

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="main-layout">
      <Header 
        onMenuToggle={() => setSidebarOpen(true)}
        onSearch={handleSearch}
      />
      
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <main className="main-layout__content">
        <div className="main-layout__container">
          {children}
        </div>
      </main>

      <MobileNav onAddClick={() => console.log('Add new')} />
      <ToastContainer />
    </div>
  );
};

export default MainLayout;