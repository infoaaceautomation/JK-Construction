import React, { useState } from 'react';
import { Sun, Moon, HardHat, Menu, X } from 'lucide-react';

export default function Navbar({ theme, toggleTheme, currentTab, setCurrentTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'projects', label: 'Projects' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact Us' },
    { id: 'admin', label: 'Admin' }
  ];

  const handleNavClick = (id) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      borderBottom: '1px solid var(--card-border)',
      background: 'var(--navbar-bg)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 4px 20px var(--shadow-color)',
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
      }}>
        {/* LOGO */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer'
        }} onClick={() => handleNavClick('home')}>
          <img
            src="/jk-logo.png"
            alt="JK Construction Logo"
            style={{
              height: '45px',
              width: 'auto',
              objectFit: 'contain',
              display: 'block'
            }}
          />
          <div>
            <span style={{
              fontSize: '20px',
              fontWeight: 800,
              letterSpacing: '0.5px',
              color: 'var(--text-primary)',
              fontFamily: 'Outfit, sans-serif'
            }}>
              JK <span style={{ color: 'var(--accent-color)' }}>CONSTRUCTION</span>
            </span>
            <div style={{
              fontSize: '9px',
              fontWeight: 600,
              letterSpacing: '2px',
              color: 'var(--text-secondary)',
              marginTop: '-3px'
            }}>JABALPUR</div>
          </div>
        </div>

        {/* DESKTOP NAV ITEMS */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px'
        }}>
          <ul style={{
            display: 'flex',
            listStyle: 'none',
            gap: '24px',
            margin: 0,
            padding: 0
          }} className="desktop-nav-menu">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: currentTab === item.id ? 'var(--accent-color)' : 'var(--text-primary)',
                    fontWeight: currentTab === item.id ? 700 : 500,
                    fontSize: '15px',
                    cursor: 'pointer',
                    position: 'relative',
                    padding: '8px 4px',
                    transition: 'color 0.2s ease'
                  }}
                >
                  {item.label}
                  {currentTab === item.id && (
                    <span style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '2px',
                      background: 'var(--accent-color)',
                      borderRadius: '2px'
                    }} />
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* THEME SWITCHER */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: '1px solid var(--card-border)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px var(--shadow-color)'
            }}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* MOBILE TOGGLER */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
            className="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '70px',
          left: 0,
          width: '100%',
          background: 'var(--navbar-bg)',
          borderBottom: '1px solid var(--card-border)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 24px',
          gap: '16px',
          boxShadow: '0 10px 15px var(--shadow-color)',
          zIndex: 99
        }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                background: 'none',
                border: 'none',
                color: currentTab === item.id ? 'var(--accent-color)' : 'var(--text-primary)',
                fontWeight: currentTab === item.id ? 700 : 500,
                fontSize: '16px',
                textAlign: 'left',
                padding: '8px 0',
                cursor: 'pointer',
                borderBottom: '1px solid rgba(0,0,0,0.03)'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Embedded CSS for responsive elements */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav-menu {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
}
