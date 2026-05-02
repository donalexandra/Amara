import React from 'react';
import { useAppState } from '../context/AppStateContext';
import { MessageSquare, Image as ImageIcon, Book, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { setActiveView } = useAppState();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      className="view-content"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="dashboard-header">
        <h1>Your safe space.</h1>
        <p>Take a deep breath. You are secure here. Choose how you'd like to document or reflect today.</p>
      </div>

      <div className="dashboard-grid">
        <div className="feature-card card primary" onClick={() => setActiveView('chat')}>
          <div className="icon-wrapper">
            <MessageSquare size={24} />
          </div>
          <h3>Amara AI Chat</h3>
          <p>Start a private, guided conversation. Amara is here to listen, support, and help you organize your thoughts without judgment.</p>
          <div className="card-action">START CONVERSATION →</div>
        </div>

        <div className="feature-card card" onClick={() => setActiveView('journalEntry')}>
          <div className="icon-wrapper">
            <ImageIcon size={24} />
          </div>
          <h3>Journal with Images</h3>
          <p>Securely upload photos and write detailed reflections. Stored entirely private.</p>
          <div className="icon-wrapper" style={{ width: '32px', height: '32px', background: '#E9D8FD', marginTop: '16px', color: '#6B46C1' }}>
            +
          </div>
        </div>

        <div className="feature-card card" onClick={() => setActiveView('journalArchive')}>
          <div className="icon-wrapper">
            <Book size={24} />
          </div>
          <h3>Journal Archive</h3>
          <p>Access your previous secure entries and encrypted files.</p>
        </div>

        <div className="feature-card card" onClick={() => setActiveView('crisisGuide')}>
          <div className="icon-wrapper" style={{ background: '#FEE2E2', color: '#DC2626' }}>
            <ShieldAlert size={24} />
          </div>
          <h3>Crisis Guide</h3>
          <p>Immediate steps and resources if you are in danger or need evidence preservation help right now.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
