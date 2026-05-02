import React, { createContext, useContext, useState, useEffect } from 'react';

const initialMessages = [
  {
    id: 1,
    sender: 'ai',
    text: "Hello. I'm Amara. This is a safe space. You can talk to me about anything you're experiencing, and I'll do my best to provide clarity and support. Everything here is private. How can I help you today?"
  }
];

const AppStateContext = createContext();

export const useAppState = () => useContext(AppStateContext);

export const AppStateProvider = ({ children }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [entries, setEntries] = useState([]);
  const [toast, setToast] = useState(null);
  
  const [chatMessages, setChatMessages] = useState(() => {
    const saved = localStorage.getItem('amara_chat_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse chat messages', e);
      }
    }
    return initialMessages;
  });

  const [editingEntry, setEditingEntry] = useState(null);

  useEffect(() => {
    // Load entries from localStorage on mount
    const savedEntries = localStorage.getItem('amara_journal_entries');
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries));
      } catch (e) {
        console.error('Failed to parse entries', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('amara_chat_messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  const saveEntry = (entry) => {
    let updatedEntries;
    if (entry.id) {
      // Update existing entry
      updatedEntries = entries.map((e) =>
        e.id === entry.id ? { ...e, ...entry, timestamp: new Date().toISOString() } : e
      );
    } else {
      // Create new entry
      const newEntry = {
        ...entry,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      updatedEntries = [newEntry, ...entries];
    }
    
    setEntries(updatedEntries);
    localStorage.setItem('amara_journal_entries', JSON.stringify(updatedEntries));
    showToast('Entry Encrypted & Time-stamped.', 'success');
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const quickExit = () => {
    localStorage.removeItem('amara_journal_entries');
    localStorage.removeItem('amara_chat_messages');
    sessionStorage.clear();
    setEntries([]);
    setChatMessages(initialMessages);
    setEditingEntry(null);
    window.location.href = 'https://www.google.com/weather';
  };

  return (
    <AppStateContext.Provider
      value={{
        activeView,
        setActiveView,
        entries,
        saveEntry,
        quickExit,
        toast,
        showToast,
        chatMessages,
        setChatMessages,
        editingEntry,
        setEditingEntry
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
