import React, { useState, useRef, useEffect } from 'react';
import { useAppState } from '../context/AppStateContext';
import { Send, Paperclip, Shield, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Chat = () => {
  const { setActiveView, chatMessages, setChatMessages } = useAppState();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: input
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const lowercaseInput = input.toLowerCase();

    let predefinedHit = false;
    let aiResponseText = "";
    let shouldSwitchToCrisis = false;
    let validationNote = null;

    // Case 1
    if ((lowercaseInput.includes('father') || lowercaseInput.includes('dad')) && lowercaseInput.includes('sleep')) {
      aiResponseText = "This is a serious violation of your safety. Any unwanted touching, especially by a family member while you sleep, is not okay. Is there a safe place you can go right now? I can help you document this.";
      predefinedHit = true;
    }
    // Case 2
    else if (lowercaseInput.includes('rape') || lowercaseInput.includes('assault') || lowercaseInput.includes('pain all over')) {
      aiResponseText = "I am so sorry. You are in shock, but we need to protect you. Do not bathe or change your clothes. I am pulling up the nearest SANE-certified hospital for you now.";
      shouldSwitchToCrisis = true;
      predefinedHit = true;
    }
    // Case 3
    else if ((lowercaseInput.includes('boss') || lowercaseInput.includes('manager')) && (lowercaseInput.includes('elbow') || lowercaseInput.includes('touch'))) {
      aiResponseText = "This is a workplace boundary violation. Whether it felt 'accidental' or not, you have the right to feel safe. Let's document the date and time in your Secure Journal.";
      validationNote = {
        title: "IMPORTANT VALIDATION",
        text: "You are not to blame for their actions. This behavior is unacceptable and illegal under workplace protection laws."
      };
      predefinedHit = true;
    }
    // Case 4
    else if (lowercaseInput.includes('naked') || lowercaseInput.includes('clothes')) {
      aiResponseText = "This is a very scary situation. Waking up without clothes is a strong indicator of assault while incapacitated. It is vital to get a medical exam immediately to preserve evidence. I am locating a clinic.";
      shouldSwitchToCrisis = true;
      predefinedHit = true;
    }
    // Case 5
    else if (lowercaseInput.includes('friend') && lowercaseInput.includes('boyfriend')) {
      aiResponseText = "Assault is defined by a lack of consent, regardless of the gender of those involved. Being cornered is a serious incident. You are safe here; we can document the details of everyone involved.";
      predefinedHit = true;
    }

    if (predefinedHit) {
      setTimeout(() => {
        const aiMessage = {
          id: Date.now() + 1,
          sender: 'ai',
          text: aiResponseText,
          validationNote
        };
        setChatMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);

        if (shouldSwitchToCrisis) {
          setTimeout(() => {
            setActiveView('crisisGuide');
          }, 1500);
        }
      }, 1500);
    } else {
      // Use Gemini API for dynamic responses
      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
          throw new Error("API Key missing");
        }

        const history = [...chatMessages, userMessage].map(msg => ({
          role: msg.sender === 'ai' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        }));

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: "You are Amara, an empathetic, supportive, and professional AI crisis journal assistant. You listen and provide gentle, affirming validation and support to survivors of trauma. Do not give medical or legal advice, but guide them to document their feelings and be safe. Keep responses relatively concise and supportive." }]
            },
            contents: history
          })
        });

        const data = await response.json();
        const geminiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I am here to listen and support you. Could you tell me more about what happened or how you are feeling?";

        const aiMessage = { id: Date.now() + 1, sender: 'ai', text: geminiText, validationNote: null };
        setChatMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);

      } catch (error) {
        console.error("Gemini Error:", error);
        const aiMessage = {
          id: Date.now() + 1,
          sender: 'ai',
          text: "I am here to listen and support you. Could you tell me more about what happened or how you are feeling? (Note: Please set VITE_GEMINI_API_KEY in your .env file to enable full AI responses).",
          validationNote: null
        };
        setChatMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <motion.div
      className="view-content"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="chat-container">
        <div className="chat-messages">
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <div className={`avatar ${msg.sender}`}>
                {msg.sender === 'ai' ? <Shield size={20} /> : <User size={20} />}
              </div>
              <div>
                <div className="message-bubble">
                  {msg.text}
                </div>
                {msg.validationNote && (
                  <div className="validation-note">
                    <h4>{msg.validationNote.title}</h4>
                    <p>{msg.validationNote.text}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message ai">
              <div className="avatar ai">
                <Shield size={20} />
              </div>
              <div className="message-bubble typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="quick-replies">
          <button className="quick-reply-btn" onClick={() => setInput("How do I document this safely?")}>How do I document this safely?</button>
          <button className="quick-reply-btn" onClick={() => setInput("I just need to process right now.")}>I just need to process right now.</button>
          <button className="quick-reply-btn" onClick={() => setInput("What are my legal rights?")}>What are my legal rights?</button>
        </div>

        <div className="chat-input-area">
          <button className="icon-btn">
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="send-btn" onClick={handleSend}>
            <Send size={18} />
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: '11px', color: '#6B7280', marginTop: '8px' }}>
          Amara is an AI and not a substitute for emergency services. If you are in immediate danger, please use the Quick Exit and call local emergency numbers.
        </p>
      </div>
    </motion.div>
  );
};

export default Chat;
