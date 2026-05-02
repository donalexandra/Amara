import React from 'react';
import { useAppState } from './context/AppStateContext';
import { AnimatePresence } from 'framer-motion';
import { Cloud, LogOut, LayoutDashboard, MessageSquare, PlusCircle, Book, ShieldAlert, CheckCircle } from 'lucide-react';

import Dashboard from './views/Dashboard';
import Chat from './views/Chat';
import JournalEntry from './views/JournalEntry';
import JournalArchive from './views/JournalArchive';
import CrisisGuide from './views/CrisisGuide';

function AppContent() {
  const { activeView, setActiveView, quickExit, toast } = useAppState();

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard key="dashboard" />;
      case 'chat': return <Chat key="chat" />;
      case 'journalEntry': return <JournalEntry key="journalEntry" />;
      case 'journalArchive': return <JournalArchive key="journalArchive" />;
      case 'crisisGuide': return <CrisisGuide key="crisisGuide" />;
      default: return <Dashboard key="dashboard" />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'chat', label: 'AI Chat', icon: <MessageSquare size={20} /> },
    { id: 'journalEntry', label: 'New Entry', icon: <PlusCircle size={20} /> },
    { id: 'journalArchive', label: 'Archive', icon: <Book size={20} /> },
    { id: 'crisisGuide', label: 'Crisis Guide', icon: <ShieldAlert size={20} /> }
  ];

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div>
          <div className="sidebar-logo">Amara</div>
          <div className="sidebar-subtitle">Having her back, always.</div>
          
          <nav className="nav-menu">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                onClick={() => setActiveView(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div className="header-title">
            {activeView === 'dashboard' ? 'Amara' : 
             activeView === 'chat' ? 'Amara / Secure Session' : 
             activeView === 'journalEntry' ? 'SECURE ENVIRONMENT' : 
             activeView === 'journalArchive' ? 'Amara' : 'Amara'}
          </div>
          <div className="header-actions">
            <Cloud size={24} color="#6B7280" />
            <button className="btn-danger" onClick={quickExit}>
              <LogOut size={16} />
              Quick Exit
            </button>
          </div>
        </header>

        <div className="view-container">
          <AnimatePresence mode="wait">
            {renderView()}
          </AnimatePresence>
        </div>
      </main>

      {/* Global Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            <CheckCircle size={18} />
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
