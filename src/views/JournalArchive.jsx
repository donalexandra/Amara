import React from 'react';
import { useAppState } from '../context/AppStateContext';
import { Lock, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const JournalArchive = () => {
  const { entries, setActiveView, setEditingEntry } = useAppState();
  
  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setActiveView('journalEntry');
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } }
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <motion.div
      className="view-content"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#E9D8FD', color: '#6B46C1', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', marginBottom: '16px' }}>
          <Lock size={12} />
          THIS SECTION IS ENCRYPTED
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px' }}>Journal Archive</h1>
        <p style={{ color: '#6B7280', fontSize: '16px' }}>Your digital sanctuary. Previous entries are securely stored and completely private.</p>
      </div>

      {entries.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280', background: '#F8F9FA', borderRadius: '12px' }}>
          No entries found. Your documented memories will appear here.
        </div>
      ) : (
        <div className="archive-grid">
          {entries.map((entry) => (
            <div 
              key={entry.id} 
              className="archive-card"
              onClick={() => handleEdit(entry)}
            >
              <div className="archive-meta">
                <span>{formatDate(entry.timestamp)}</span>
                {entry.image && <ImageIcon size={14} color="#9CA3AF" />}
              </div>
              {entry.image && (
                <img src={entry.image} alt="Entry evidence" className="archive-image" />
              )}
              <h3>{entry.title}</h3>
              <p>{entry.content}</p>
              {entry.tags && entry.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                  {entry.tags.map(tag => (
                    <span key={tag} className="archive-tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default JournalArchive;
