import React, { useState, useEffect } from 'react';
import { useAppState } from '../context/AppStateContext';
import { Lock, Image as ImageIcon, X } from 'lucide-react';
import { motion } from 'framer-motion';

const JournalEntry = () => {
  const { saveEntry, setActiveView, editingEntry, setEditingEntry } = useAppState();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (editingEntry) {
      setTitle(editingEntry.title || '');
      setContent(editingEntry.content || '');
      setImage(editingEntry.image || null);
    }
    
    // Clear editing entry on unmount
    return () => setEditingEntry(null);
  }, [editingEntry, setEditingEntry]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;
    
    saveEntry({
      id: editingEntry?.id,
      title: title || 'Untitled Entry',
      content,
      image,
      tags: editingEntry?.tags || ['Encrypted']
    });
    
    setTimeout(() => {
      setActiveView('journalArchive');
    }, 1000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  return (
    <motion.div
      className="view-content"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="journal-entry-container">
        <div className="entry-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>{today}</span>
            {editingEntry && (
              <span style={{ color: '#9F7AEA', fontWeight: '600', fontSize: '12px' }}>
                EDITING MODE
              </span>
            )}
          </div>
          <div className="encrypted-badge">
            <Lock size={12} />
            Encrypted
          </div>
        </div>

        <input
          type="text"
          className="title-input"
          placeholder="Entry Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="content-input"
          placeholder="Document the event. What happened? How do you feel? Record details while they are fresh..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="evidence-section">
          <div className="evidence-header">
            <h3>Image Evidence</h3>
            <span style={{ fontSize: '12px', color: '#6B7280' }}>
              {image ? '1 Item' : '0 Items'}
            </span>
          </div>
          
          <div className="evidence-grid">
            {image && (
              <div className="evidence-item">
                <img src={image} alt="Evidence" />
                <button 
                  onClick={() => setImage(null)}
                  style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: '50%', padding: '4px' }}
                >
                  <X size={12} />
                </button>
              </div>
            )}
            
            <label className="add-evidence">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                style={{ display: 'none' }} 
              />
              <ImageIcon size={24} />
              <span>{image ? 'Change Image' : 'Add Image'}</span>
            </label>
          </div>
        </div>

        <div className="journal-actions" style={{ gap: '12px' }}>
          {editingEntry && (
            <button className="btn-secondary" style={{ background: '#F3F4F6', color: '#1F2937' }} onClick={() => setActiveView('journalArchive')}>
              Cancel
            </button>
          )}
          <button className="btn-primary" onClick={handleSave}>
            {editingEntry ? 'Update Entry' : 'Save Entry'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default JournalEntry;
