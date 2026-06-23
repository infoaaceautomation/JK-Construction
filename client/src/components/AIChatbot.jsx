import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Phone, Send, X, Bot, RefreshCw } from 'lucide-react';

export default function AIChatbot({ backendUrl }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! I am the JK Construction AI Assistant. How can I help you with civil works, architecture mapping, or interior design in Jabalpur today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const toggleChat = () => {
    if (!isOpen) {
      // Clear old conversation history on reopen
      setMessages([
        {
          sender: 'bot',
          text: 'Namaste! I am the JK Construction AI Assistant. How can I help you with civil works, architecture mapping, or interior design in Jabalpur today?',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
    setIsOpen(!isOpen);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg = {
      sender: 'user',
      text: inputVal,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setLoading(true);

    try {
      const response = await fetch(`${backendUrl || 'http://localhost:5000'}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          history: messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'model', text: m.text }))
        })
      });

      if (!response.ok) {
        throw new Error('API failed');
      }

      const data = await response.json();
      const botMsg = {
        sender: 'bot',
        text: data.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg = {
        sender: 'bot',
        text: 'Sorry, I am facing a connection issue right now. Please call us at +91-7692931715 or click the WhatsApp icon below to message us directly!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const whatsappNumber = '917692931715';
  const displayPhoneNumber = '7692931715';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hello%20JK%20Construction%2C%20I%20have%20an%20enquiry%20regarding%20construction%2Fdesigning%20services.`;
  const callUrl = `tel:${displayPhoneNumber}`;

  return (
    <>
      {/* FLOATING ACTION BUTTONS CONTAINER */}
      <div className="float-actions-container" style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        zIndex: 999,
        alignItems: 'center'
      }}>
        {/* 1. CALLING AGENT FLOATING BUTTON */}
        <div className="float-action-wrapper" style={{ animation: 'float-bob 3s ease-in-out infinite' }}>
          <span className="float-action-label">Call Us</span>
          <a
            href={callUrl}
            className="float-call-btn"
            title="Call JK Construction"
          >
            <Phone size={20} />
          </a>
        </div>

        {/* 2. WHATSAPP FLOATING BUTTON */}
        <div className="float-action-wrapper" style={{ animation: 'float-bob 3s ease-in-out infinite 0.5s' }}>
          <span className="float-action-label">WhatsApp Chat</span>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="float-wa-btn pulse-green"
            title="Chat on WhatsApp"
          >
            {/* Beautiful Official WhatsApp Vector Icon */}
            <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.705 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </a>
        </div>

        {/* 3. AI CHATBOT TOGGLE BUTTON */}
        <div className="float-action-wrapper" style={{ animation: 'float-bob 3s ease-in-out infinite 1s' }}>
          <span className="float-action-label">Ask AI Assistant</span>
          <button
            onClick={toggleChat}
            className="float-bot-btn pulse-accent"
            title="Ask AI Assistant"
          >
            {isOpen ? <X size={24} /> : <Bot size={28} />}
          </button>
        </div>
      </div>

      {/* CHAT WINDOW BOX */}
      {isOpen && (
        <div className="glass-panel chat-window-box" style={{
          position: 'fixed',
          bottom: '96px',
          right: '24px',
          width: 'calc(100% - 48px)',
          maxWidth: '360px',
          height: '480px',
          zIndex: 998,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 20px 40px var(--shadow-color)',
          border: '2px solid var(--card-border)'
        }}>
          {/* Chat Header */}
          <div style={{
            background: 'var(--navy-blue)',
            color: '#ffffff',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'var(--accent-color)', color: '#0a192f', padding: '6px', borderRadius: '8px', display: 'flex' }}>
                <Bot size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>JK AI Assistant</h4>
                <div style={{ fontSize: '10px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                  Online | Gemini Flash
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.7 }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Feed */}
          <div style={{
            flexGrow: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            background: 'var(--bg-color)'
          }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{
                  background: m.sender === 'user' ? 'var(--navy-blue)' : 'var(--card-bg)',
                  color: m.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                  padding: '10px 14px',
                  borderRadius: m.sender === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                  border: m.sender === 'user' ? 'none' : '1px solid var(--card-border)',
                  fontSize: '13.5px',
                  lineHeight: '1.5',
                  boxShadow: '0 2px 8px var(--shadow-color)'
                }}>
                  {m.text}
                </div>
                <span style={{
                  fontSize: '9px',
                  color: 'var(--text-secondary)',
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start'
                }}>
                  {m.time}
                </span>
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '10px 14px', borderRadius: '12px 12px 12px 0' }}>
                <RefreshCw size={14} className="spin-slow" style={{ color: 'var(--accent-color)' }} />
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>AI is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Footer */}
          <form onSubmit={handleSend} style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--card-border)',
            background: 'var(--navbar-bg)',
            display: 'flex',
            gap: '8px'
          }}>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask anything about JK Construction..."
              style={{
                flexGrow: 1,
                fontSize: '13px',
                padding: '10px 12px'
              }}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              style={{
                background: 'var(--accent-color)',
                color: '#0a192f',
                border: 'none',
                borderRadius: '8px',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'opacity 0.2s',
                opacity: (loading || !inputVal.trim()) ? 0.6 : 1
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* CSS adjustments for premium floating action buttons */}
      <style>{`
        @keyframes float-bob {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }

        .float-action-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .float-action-label {
          position: absolute;
          right: 68px;
          background: rgba(10, 25, 47, 0.95);
          color: #ffffff;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          font-family: 'Outfit', sans-serif;
          white-space: nowrap;
          opacity: 0;
          transform: translateX(12px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          border: 1px solid var(--accent-color);
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }

        .float-action-wrapper:hover .float-action-label {
          opacity: 1;
          transform: translateX(0);
        }

        .float-call-btn {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: var(--navy-blue) !important;
          color: var(--accent-color) !important;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(10, 25, 47, 0.3);
          border: 2px solid var(--accent-color);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          cursor: pointer;
        }

        .float-call-btn:hover {
          transform: scale(1.15) translateY(-2px);
          background: var(--accent-color) !important;
          color: var(--navy-blue) !important;
          box-shadow: 0 8px 25px rgba(234, 179, 8, 0.5) !important;
        }

        .float-wa-btn {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #25D366 !important;
          color: #ffffff !important;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
          border: 2px solid #ffffff;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          cursor: pointer;
        }

        .float-wa-btn:hover {
          transform: scale(1.15) translateY(-2px);
          box-shadow: 0 8px 25px rgba(37, 211, 102, 0.6) !important;
        }

        .float-bot-btn {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: var(--accent-color) !important;
          color: #0a192f !important;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 20px rgba(234, 179, 8, 0.4);
          border: 2px solid var(--navy-blue);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .float-bot-btn:hover {
          transform: scale(1.15) translateY(-2px);
          background: var(--navy-blue) !important;
          color: var(--accent-color) !important;
          border-color: var(--accent-color);
          box-shadow: 0 8px 25px rgba(10, 25, 47, 0.5) !important;
        }

        .pulse-accent {
          animation: pulse-glow-acc 2s infinite;
        }
        @keyframes pulse-glow-acc {
          0% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.6); }
          70% { box-shadow: 0 0 0 12px rgba(234, 179, 8, 0); }
          100% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0); }
        }

        .pulse-green {
          animation: pulse-glow-grn 2.5s infinite;
        }
        @keyframes pulse-glow-grn {
          0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.6); }
          70% { box-shadow: 0 0 0 12px rgba(37, 211, 102, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
        }

        @media (max-width: 480px) {
          .float-actions-container {
            right: 16px !important;
            bottom: 16px !important;
            gap: 12px !important;
          }
          .chat-window-box {
            right: 16px !important;
            bottom: 84px !important;
            width: calc(100% - 32px) !important;
            height: 440px !important;
          }
          .float-action-label {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
