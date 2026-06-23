import React, { useState, useEffect } from 'react';
import { Layers, Calendar, Landmark, MapPin } from 'lucide-react';

export default function Projects({ backendUrl }) {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fallbackProjects = [
    {
      id: 1,
      title: 'Luxury Villa, Dhanvantri Nagar',
      description: 'A modern double-story premium duplex featuring state-of-the-art styling, high ceiling ventilation, and custom premium interiors.',
      category: 'Residential',
      image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
      year: 2024,
      status: 'Completed'
    },
    {
      id: 2,
      title: 'Commercial Hub, Bilhari',
      description: 'A structural masterpiece serving as a premium office and retail space, constructed with heavy grade earthquake-resistant steel.',
      category: 'Commercial',
      image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
      year: 2023,
      status: 'Completed'
    },
    {
      id: 3,
      title: 'Modern Apartment Complex, Vijay Nagar',
      description: 'Premium housing units utilizing sustainable insulation, modular kitchens, solar roof cells, and custom landscaping designs.',
      category: 'Residential',
      image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
      year: 2025,
      status: 'In Progress'
    },
    {
      id: 4,
      title: 'Premium Corporate Offices, Civic Center',
      description: 'Ultra-modern interior detailing, soundproof glass panel designs, open floor layout, and smart electrical integration.',
      category: 'Interior',
      image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
      year: 2024,
      status: 'Completed'
    }
  ];

  useEffect(() => {
    fetch(`${backendUrl || 'http://localhost:5000'}/api/projects`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load projects');
        return res.json();
      })
      .then((data) => {
        setProjects(data);
        setFilteredProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching projects:', err);
        setProjects(fallbackProjects);
        setFilteredProjects(fallbackProjects);
        setLoading(false);
      });
  }, [backendUrl]);

  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter((p) => p.category === activeFilter));
    }
  }, [activeFilter, projects]);

  const categories = ['All', 'Residential', 'Commercial', 'Interior'];

  return (
    <section id="projects-section" className="section">
      <div className="container">
        <h2 className="section-title">
          Featured <span className="title-accent">Projects</span>
        </h2>
        <p className="section-subtitle">
          Explore our portfolio of houses, shopping complexes, and renovations in Jabalpur city.
        </p>

        {/* Filters */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '40px'
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              style={{
                padding: '8px 20px',
                borderRadius: '30px',
                border: activeFilter === cat ? '1px solid var(--accent-color)' : '1px solid var(--card-border)',
                background: activeFilter === cat ? 'var(--accent-color)' : 'var(--card-bg)',
                color: activeFilter === cat ? '#0a192f' : 'var(--text-primary)',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                boxShadow: activeFilter === cat ? '0 4px 10px rgba(234, 179, 8, 0.25)' : 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            Loading projects...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                className="glass-panel project-card"
                style={{
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Image & Status Badge */}
                <div style={{
                  position: 'relative',
                  height: '220px',
                  width: '100%',
                  overflow: 'hidden'
                }}>
                  <img
                    src={p.image_url}
                    alt={p.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                    className="project-image"
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: p.status === 'Completed' ? 'var(--status-resolved)' : 'var(--status-inprogress)',
                    color: '#ffffff',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                  }}>
                    {p.status}
                  </div>
                </div>

                {/* Content */}
                <div style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  flexGrow: 1
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    color: 'var(--accent-color)',
                    fontWeight: 600
                  }}>
                    <Layers size={14} />
                    {p.category}
                  </div>

                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    fontFamily: 'Outfit, sans-serif'
                  }}>
                    {p.title}
                  </h3>

                  <p style={{
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: 'var(--text-secondary)',
                    flexGrow: 1
                  }}>
                    {p.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid var(--card-border)',
                    paddingTop: '16px',
                    marginTop: '8px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} />
                      <span>Built Year: <b>{p.year}</b></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} />
                      <span>Jabalpur, MP</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .project-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 35px var(--shadow-color) !important;
          border-color: var(--accent-color) !important;
        }
        .project-card:hover .project-image {
          transform: scale(1.08);
        }
      `}</style>
    </section>
  );
}
