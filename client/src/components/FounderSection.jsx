import React, { useState } from 'react';
import { Quote, ShieldCheck, Award, Briefcase } from 'lucide-react';

export default function FounderSection() {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="founder-section" className="section" style={{
      borderTop: '1px solid var(--card-border)',
      background: 'linear-gradient(180deg, rgba(30, 58, 138, 0.01) 0%, rgba(234, 179, 8, 0.02) 100%)'
    }}>
      <div className="container">
        <h2 className="section-title">
          Meet Our <span className="title-accent">Founder</span>
        </h2>
        <p className="section-subtitle">
          The visionary leadership guiding JK Construction's commitment to quality, strength, and trust in Jabalpur.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.4fr',
          gap: '50px',
          alignItems: 'center',
          marginTop: '30px'
        }} className="founder-grid">
          
          {/* Left Column: Founder Photo & Badge */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div className="founder-img-container" style={{
              position: 'relative',
              width: '100%',
              maxWidth: '350px',
              aspectRatio: '4/5',
              borderRadius: '24px',
              padding: '8px',
              background: 'linear-gradient(135deg, var(--accent-color) 0%, #d97706 100%)',
              boxShadow: '0 20px 40px var(--shadow-color)',
              transition: 'transform 0.4s ease'
            }}>
              <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                borderRadius: '18px',
                overflow: 'hidden',
                background: 'var(--navy-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {!imgError ? (
                  <img
                    src="/founder.jpg"
                    alt="Architect Jinesh Kumar Mehra"
                    onError={() => setImgError(true)}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                ) : (
                  /* Premium SVG Fallback if image doesn't exist yet */
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    color: 'rgba(255,255,255,0.8)',
                    padding: '24px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      background: 'rgba(234, 179, 8, 0.1)',
                      border: '2px solid var(--accent-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                      fontWeight: 800,
                      color: 'var(--accent-color)',
                      fontFamily: 'Outfit, sans-serif'
                    }}>
                      JKM
                    </div>
                    <div>
                      <h4 style={{ color: '#fff', fontSize: '18px', marginBottom: '4px' }}>Architect Jinesh Kumar Mehra</h4>
                      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>[ Place founder.png in client/public folder ]</p>
                    </div>
                  </div>
                )}

                {/* Overlay details */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  padding: '24px 20px 20px',
                  background: 'linear-gradient(to top, rgba(10, 25, 47, 0.95) 0%, rgba(10, 25, 47, 0.4) 70%, transparent 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <span style={{
                    background: 'var(--accent-color)',
                    color: '#0a192f',
                    fontSize: '10px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    width: 'fit-content'
                  }}>
                    Founder & MD
                  </span>
                  <h3 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', margin: 0 }}>
                    Architect Jinesh Kumar Mehra
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', margin: 0 }}>
                    JK Construction (Jabalpur)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Founder's Vision, Quote and Highlights */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {/* Quote Box */}
            <div className="glass-panel" style={{
              padding: '32px',
              position: 'relative',
              borderLeft: '5px solid var(--accent-color)'
            }}>
              <div style={{
                position: 'absolute',
                top: '15px',
                right: '20px',
                color: 'rgba(234, 179, 8, 0.08)',
                pointerEvents: 'none'
              }}>
                <Quote size={80} strokeWidth={1} />
              </div>

              <h4 style={{
                fontSize: '15px',
                color: 'var(--accent-color)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '12px',
                fontWeight: 700
              }}>
                Founder's Message
              </h4>

              <p style={{
                fontSize: '16px',
                lineHeight: '1.7',
                color: 'var(--text-primary)',
                fontStyle: 'italic',
                fontWeight: 500,
                position: 'relative',
                zIndex: 1
              }}>
                "At JK Construction, we do not simply pour concrete and align steel. We build structures that hold the dreams, security, and futures of our clients. Since 2010, our steadfast commitment to premium material selection, engineering integrity, and absolute pricing transparency has earned the trust of families and enterprises across Jabalpur. We build legacies, not just properties."
              </p>

              {/* Signature look */}
              <div style={{
                marginTop: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}>
                <span style={{
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  letterSpacing: '0.5px'
                }}>
                  Architect Jinesh Kumar Mehra
                </span>
                <span style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)'
                }}>
                  Founder, JK Construction
                </span>
              </div>
            </div>

            {/* Highlights Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px'
            }} className="founder-highlights">
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{
                  color: 'var(--accent-color)',
                  background: 'rgba(234, 179, 8, 0.08)',
                  padding: '10px',
                  borderRadius: '10px',
                  height: 'fit-content',
                  display: 'flex'
                }}>
                  <Award size={20} />
                </div>
                <div>
                  <h5 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    15+ Years Leadership
                  </h5>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    Guiding JK Construction since its inception in 2010 with strong ethics.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{
                  color: 'var(--accent-color)',
                  background: 'rgba(234, 179, 8, 0.08)',
                  padding: '10px',
                  borderRadius: '10px',
                  height: 'fit-content',
                  display: 'flex'
                }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h5 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Quality Assurance
                  </h5>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    Personally overseeing material standards and earthquake-resistant designs.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <style>{`
        .founder-img-container:hover {
          transform: translateY(-8px) scale(1.02);
        }
        @media (max-width: 992px) {
          .founder-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
        @media (max-width: 576px) {
          .founder-highlights {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}
