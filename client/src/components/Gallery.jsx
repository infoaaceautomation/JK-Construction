import React, { useState, useEffect } from 'react';
import { Play, X, Image as ImageIcon, Video as VideoIcon, Maximize2 } from 'lucide-react';

export default function Gallery({ backendUrl }) {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'image', 'video'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null); // Item for Lightbox modal

  useEffect(() => {
    fetch(`${backendUrl || 'http://localhost:5000'}/api/gallery`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load gallery items');
        return res.json();
      })
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Gallery load error:', err);
        setError('Unable to fetch gallery media. Please try again later.');
        setLoading(false);
      });
  }, [backendUrl]);

  // Filter items
  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true;
    return item.media_type === filter;
  });

  return (
    <section style={{ padding: '60px 0', minHeight: 'calc(100vh - 180px)' }}>
      <div className="container">
        {/* Gallery Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
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
            backdropFilter: 'blur(8px)',
            marginBottom: '16px'
          }}>
            Our Showcase
          </span>
          <h2 style={{
            fontSize: '36px',
            color: 'var(--text-primary)',
            fontFamily: 'Outfit, sans-serif',
            marginBottom: '12px'
          }}>
            Media <span className="title-accent">Gallery</span>
          </h2>
          <p style={{
            fontSize: '15px',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Explore photos and video walk-throughs of our construction projects, structural elevations, and modern interiors in Jabalpur.
          </p>
        </div>

        {/* Filter Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '36px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'all', label: 'All Media', icon: null },
            { id: 'image', label: 'Photos', icon: <ImageIcon size={15} /> },
            { id: 'video', label: 'Videos', icon: <VideoIcon size={15} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: filter === tab.id ? 'var(--accent-color)' : 'rgba(255, 255, 255, 0.05)',
                color: filter === tab.id ? '#0a192f' : 'var(--text-primary)',
                border: filter === tab.id ? '1px solid var(--accent-color)' : '1px solid var(--card-border)',
                borderRadius: '30px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(8px)',
                boxShadow: filter === tab.id ? '0 4px 15px rgba(234, 179, 8, 0.25)' : 'none'
              }}
              className="gallery-filter-btn"
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid var(--card-border)',
              borderTopColor: 'var(--accent-color)',
              borderRadius: '50%',
              animation: 'spin-slow 1s linear infinite'
            }} />
          </div>
        )}

        {error && (
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: '#ef4444', maxWidth: '500px', margin: '0 auto' }}>
            {error}
          </div>
        )}

        {/* Grid Display */}
        {!loading && !error && (
          <>
            {filteredItems.length === 0 ? (
              <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No media files found in this category.
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px'
              }} className="gallery-grid">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="glass-panel gallery-item"
                    onClick={() => setSelectedItem(item)}
                    style={{
                      borderRadius: '16px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '240px',
                      border: '1px solid var(--card-border)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow = '0 12px 30px var(--shadow-color)';
                      e.currentTarget.style.borderColor = 'var(--accent-color)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 10px 30px -10px var(--shadow-color)';
                      e.currentTarget.style.borderColor = 'var(--card-border)';
                    }}
                  >
                    {/* Media content */}
                    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                      {item.media_type === 'image' ? (
                        <img
                          src={item.media_url}
                          alt={item.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                          className="gallery-media-thumb"
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                          <video
                            src={item.media_url}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            muted
                            playsInline
                          />
                          {/* Play Button Overlay */}
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            background: 'rgba(234, 179, 8, 0.9)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#0a192f',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                            zIndex: 2
                          }}>
                            <Play size={20} fill="#0a192f" style={{ marginLeft: '2px' }} />
                          </div>
                        </div>
                      )}

                      {/* Glassmorphic Caption Overlay */}
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        background: 'linear-gradient(to top, rgba(10, 25, 47, 0.95) 0%, rgba(10, 25, 47, 0.4) 100%)',
                        padding: '16px',
                        color: '#ffffff',
                        zIndex: 3
                      }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.title}
                        </h4>
                        {item.description && (
                          <p style={{
                            fontSize: '11px',
                            color: 'rgba(255, 255, 255, 0.7)',
                            margin: '4px 0 0 0',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Hover Zoom Indicator */}
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(10, 25, 47, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        padding: '6px',
                        borderRadius: '50%',
                        color: '#fff',
                        opacity: 0,
                        transform: 'scale(0.8)',
                        transition: 'all 0.3s ease',
                        zIndex: 4
                      }} className="gallery-zoom-icon">
                        <Maximize2 size={14} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* LIGHTBOX MODAL */}
      {selectedItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(2, 12, 27, 0.92)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '24px'
        }} onClick={() => setSelectedItem(null)}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '900px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              style={{
                position: 'absolute',
                top: '-45px',
                right: '0',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.8)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <X size={18} />
            </button>

            {/* Media Content Box */}
            <div style={{
              width: '100%',
              background: 'rgba(10, 25, 47, 0.5)',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {selectedItem.media_type === 'image' ? (
                <img
                  src={selectedItem.media_url}
                  alt={selectedItem.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '75vh',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              ) : (
                <video
                  src={selectedItem.media_url}
                  controls
                  autoPlay
                  style={{
                    width: '100%',
                    maxHeight: '75vh',
                    display: 'block',
                    background: '#000'
                  }}
                />
              )}
            </div>

            {/* Bottom Caption Box */}
            <div className="glass-panel" style={{
              width: '100%',
              padding: '20px 24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
              color: '#ffffff'
            }}>
              <h3 style={{ fontSize: '20px', fontFamily: 'Outfit, sans-serif', color: 'var(--accent-color)', margin: '0 0 8px 0' }}>
                {selectedItem.title}
              </h3>
              {selectedItem.description && (
                <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', margin: 0, lineHeight: '1.5' }}>
                  {selectedItem.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hover transitions and custom zoom class styling */}
      <style>{`
        .gallery-item:hover .gallery-zoom-icon {
          opacity: 1 !important;
          transform: scale(1) !important;
        }
        .gallery-item:hover .gallery-media-thumb {
          transform: scale(1.06);
        }
      `}</style>
    </section>
  );
}
