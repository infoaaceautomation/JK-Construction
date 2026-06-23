import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Stats from './components/Stats';
import Services from './components/Services';
import Projects from './components/Projects';
import FounderSection from './components/FounderSection';
import ContactForm from './components/ContactForm';
import AdminDashboard from './components/AdminDashboard';
import ThreeCanvas from './components/ThreeCanvas';
import AIChatbot from './components/AIChatbot';
import Reviews from './components/Reviews';
import { ArrowRight, ChevronRight, HardHat, ShieldCheck, Clock, Award, Facebook, Youtube, Instagram, Linkedin, Twitter } from 'lucide-react';

const BACKEND_URL = import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin;

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('jkc_theme') || 'light');
  const [currentTab, setCurrentTab] = useState('home');
  const [phase, setPhase] = useState('completed');

  useEffect(() => {
    // Apply theme attribute to HTML document root
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('jkc_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleStartEnquiry = () => {
    setCurrentTab('contact');
    const contactSec = document.getElementById('contact-section');
    if (contactSec) {
      contactSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const phases = [
    { id: 'foundation', step: '01', title: 'Foundation', desc: 'Excavating soil, laying concrete footings and vertical steel rebar reinforcement' },
    { id: 'brickwork', step: '02', title: 'Brickwork', desc: 'Stacking red clay bricks to build exterior and interior structural walls' },
    { id: 'slabcasting', step: '03', title: 'Slab Casting', desc: 'Pouring structural concrete slabs for floors and ceiling formwork' },
    { id: 'plaster', step: '04', title: 'Plastering', desc: 'Applying protective smooth cement plaster over brick structures' },
    { id: 'finishing', step: '05', title: 'Finishing & Painting', desc: 'Installing window frames, painter ladders, and base coats of paint' },
    { id: 'completed', step: '06', title: 'Complete Villa', desc: 'Fully realized premium luxury villa with landscaping, paths, and modern lights' }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* NAVBAR */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      {/* RENDER SECTION ACCORDING TO ACTIVE TAB */}
      {currentTab === 'home' && (
        <main style={{ flexGrow: 1 }}>
          {/* HERO SECTION WITH VIDEO BACKGROUND + INTERACTIVE 3D CANVAS */}
          <section style={{
            position: 'relative',
            padding: '60px 0',
            overflow: 'hidden',
            borderBottom: '1px solid var(--card-border)',
            minHeight: '680px'
          }}>
            {/* ── BACKGROUND VIDEO ── */}
            <video
              autoPlay
              muted
              loop
              playsInline
              style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                zIndex: 0,
                pointerEvents: 'none'
              }}
            >
              <source src="/hero-bg.mp4" type="video/mp4" />
            </video>

            {/* ── DARK GRADIENT OVERLAY ── */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, rgba(10,25,47,0.55) 0%, rgba(10,25,47,0.30) 50%, rgba(10,25,47,0.50) 100%)',
              zIndex: 1
            }} />

            {/* ── CONTENT LAYER (above video) ── */}
            <div className="container hero-grid" style={{
              position: 'relative',
              zIndex: 2,
              display: 'grid',
              gridTemplateColumns: '1.1fr 1fr',
              gap: '40px',
              alignItems: 'center'
            }}>
              
              {/* Left Column: Heading and Phase Switcher */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <span style={{
                    background: 'rgba(234, 179, 8, 0.15)',
                    color: 'var(--accent-color)',
                    padding: '6px 14px',
                    borderRadius: '30px',
                    fontSize: '13px',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid rgba(234, 179, 8, 0.35)',
                    backdropFilter: 'blur(8px)'
                  }}>
                    <HardHat size={14} /> Established Since 2010
                  </span>
                  <h1 style={{
                    fontSize: '52px',
                    lineHeight: '1.15',
                    color: '#ffffff',
                    fontFamily: 'Outfit, sans-serif',
                    marginTop: '16px',
                    textShadow: '0 2px 20px rgba(0,0,0,0.5)'
                  }}>
                    Building the Future of <span className="title-accent">Jabalpur</span>
                  </h1>
                </div>

                <p style={{
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: 'rgba(255,255,255,0.82)'
                }}>
                  From premium duplex houses to commercial complexes, Architect Jinesh Kumar Mehra's <b style={{ color: '#fff' }}>JK Construction</b> delivers top-tier civil works, elevation designs, and luxury interiors with structural perfection.
                </p>

                {/* Call to Actions */}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <button onClick={handleStartEnquiry} className="btn-primary">
                    Start Your Project
                    <ArrowRight size={16} />
                  </button>
                  <button onClick={() => setCurrentTab('services')} style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontWeight: 600,
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.3)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '15px',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.3s ease'
                  }}>
                    View Our Services
                  </button>
                </div>

                {/* 3D Model Construction Phase Selector */}
                <div style={{ marginTop: '8px' }}>
                  <h4 style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: 'rgba(255,255,255,0.7)',
                    marginBottom: '12px'
                  }}>
                    Explore Interactive Construction Stages:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {phases.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setPhase(p.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          padding: '11px 18px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          width: '100%',
                          background: phase === p.id ? 'rgba(234,179,8,0.15)' : 'rgba(255,255,255,0.05)',
                          backdropFilter: 'blur(12px)',
                          border: phase === p.id ? '2px solid var(--accent-color)' : '1px solid rgba(255,255,255,0.12)',
                          borderRadius: '12px',
                          transform: phase === p.id ? 'translateX(6px)' : 'translateX(0)',
                          transition: 'all 0.3s ease',
                          boxShadow: phase === p.id ? '0 4px 20px rgba(234,179,8,0.2)' : 'none'
                        }}
                      >
                        <span style={{
                          fontSize: '18px',
                          fontWeight: 800,
                          color: phase === p.id ? 'var(--accent-color)' : 'rgba(255,255,255,0.5)'
                        }}>
                          {p.step}
                        </span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '14px', color: '#ffffff' }}>
                            {p.title}
                          </div>
                          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginTop: '2px' }}>
                            {p.desc}
                          </div>
                        </div>
                        {phase === p.id && (
                          <ChevronRight size={18} style={{ marginLeft: 'auto', color: 'var(--accent-color)' }} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive 3D Canvas Box */}
              <div style={{
                height: '520px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                border: '2px solid rgba(234,179,8,0.3)',
                borderRadius: '16px',
                background: 'rgba(10,25,47,0.3)',
                backdropFilter: 'blur(4px)'
              }} className="canvas-3d-wrapper">
                <ThreeCanvas theme={theme} phase={phase} />
              </div>

            </div>
          </section>

          {/* STATS */}
          <Stats />

          {/* CORE SERVICES BRIEF */}
          <Services />

          {/* LATEST PROJECTS */}
          <Projects backendUrl={BACKEND_URL} />

          {/* WHY CHOOSE US */}
          <section style={{ padding: '80px 0', borderTop: '1px solid var(--card-border)', background: 'rgba(30, 58, 138, 0.01)' }}>
            <div className="container">
              <h2 className="section-title">
                Why Work With <span className="title-accent">JK Construction?</span>
              </h2>
              <p className="section-subtitle">
                We design and build spaces prioritizing ethics, safety, and modern engineering standards.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '24px',
                marginTop: '10px'
              }}>
                <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ color: 'var(--accent-color)' }}><ShieldCheck size={28} /></div>
                  <h4 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>Verified Engineering</h4>
                  <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>We conform to seismic code requirements and soil integrity checks before executing foundations.</p>
                </div>
                <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ color: 'var(--accent-color)' }}><Clock size={28} /></div>
                  <h4 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>On-Time Delivery</h4>
                  <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>Rigorous scheduling metrics and mechanical logistics management ensure timely key handovers.</p>
                </div>
                <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ color: 'var(--accent-color)' }}><Award size={28} /></div>
                  <h4 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>Experienced Architects</h4>
                  <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>Our professional team designs aesthetic elevation maps that maximizes interior light and ventilation.</p>
                </div>
              </div>
            </div>
          </section>

          {/* MEET OUR FOUNDER */}
          <FounderSection />

          {/* GOOGLE REVIEWS SHOWCASE */}
          <Reviews backendUrl={BACKEND_URL} />

          {/* CONTACT SECTION */}
          <ContactForm backendUrl={BACKEND_URL} />
        </main>
      )}

      {currentTab === 'services' && (
        <main style={{ flexGrow: 1 }}>
          <Services />
        </main>
      )}

      {currentTab === 'projects' && (
        <main style={{ flexGrow: 1 }}>
          <Projects backendUrl={BACKEND_URL} />
        </main>
      )}

      {currentTab === 'contact' && (
        <main style={{ flexGrow: 1 }}>
          <ContactForm backendUrl={BACKEND_URL} />
        </main>
      )}

      {currentTab === 'admin' && (
        <main style={{ flexGrow: 1 }}>
          <AdminDashboard backendUrl={BACKEND_URL} />
        </main>
      )}

      {/* FOOTER */}
      <footer style={{
        background: 'var(--navy-blue)',
        color: 'rgba(255,255,255,0.7)',
        padding: '40px 0',
        borderTop: '2px solid var(--accent-color)',
        fontSize: '14px',
        textAlign: 'center'
      }}>
        <div className="container" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          {/* FOOTER LOGO with premium effects */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src="/jk-logo.png"
              alt="JK Construction"
              className="footer-logo-glow"
              style={{
                height: '90px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>

          {/* Social Media Link Icons with Logos */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            marginBottom: '4px'
          }}>
            {[
              { icon: <Facebook size={18} />, url: 'https://www.facebook.com/JKConstruction-117381683425029/', label: 'Facebook' },
              { icon: <Instagram size={18} />, url: 'https://www.instagram.com/jkconstructionjbp?igsh=OGQ5ZDc2ODk2ZA%3D%3D', label: 'Instagram' },
              { icon: <Youtube size={18} />, url: 'https://www.youtube.com/channel/UC_1sTceTp9I77cvAcU3jqxw', label: 'YouTube' },
              { icon: <Linkedin size={18} />, url: 'https://www.linkedin.com/company/jkconstruction/', label: 'LinkedIn' }
            ].map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease'
                }}
                title={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>

          <p style={{ fontWeight: 500 }}>© {new Date().getFullYear()} JK Construction, Jabalpur (M.P.). All Rights Reserved.</p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px', maxWidth: '600px', lineHeight: '1.5' }}>
            Office Address: Plot No-236, Rajul City , Mandala-Jabalpur Road , Phase-1 Bilhari , Jabalpur , MP-482020 | Founder: Architect Jinesh Kumar Mehra | Call: <a href="tel:+917692931715" className="communication-link" style={{ color: 'var(--accent-color)', fontWeight: 600 }}>+91-7692931715</a>
          </p>
        </div>
      </footer>

      {/* CSS layout overrides for hero alignment */}
      <style>{`
        @media (max-width: 992px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
          .canvas-3d-wrapper {
            height: 380px !important;
          }
        }
      `}</style>
      {/* Floating AI Chatbot, WhatsApp & Calling Agent Buttons */}
      <AIChatbot backendUrl={BACKEND_URL} />
    </div>
  );
}
