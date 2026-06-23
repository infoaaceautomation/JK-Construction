import React from 'react';
import { Building2, Hammer, Paintbrush, Compass, Briefcase } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: <Building2 size={32} />,
      title: 'Civil Construction',
      description: 'Reliable and robust constructions of duplex houses, luxury apartments, and commercial complexes with earthquake-resistant engineering.'
    },
    {
      icon: <Compass size={32} />,
      title: 'Architecture & Map Design',
      description: 'Drafting dream designs. Elevation styling, structural map planning, layouts, and municipal compliance layouts.'
    },
    {
      icon: <Paintbrush size={32} />,
      title: 'Interior Designing',
      description: 'Creating space-optimized, visual masterpieces. Modular kitchens, bespoke glass/wood designs, false ceilings, and smart lighting.'
    },
    {
      icon: <Hammer size={32} />,
      title: 'House Renovation',
      description: 'Breathing new life into older structures. Custom structural upgrades, remodelling, expansion, and facade updates.'
    },
    {
      icon: <Briefcase size={32} />,
      title: 'Property Consultants & Promoters',
      description: 'End-to-end guidance. Identifying real estate opportunities, promoter consultancy, and legal compliance vetting.'
    }
  ];

  return (
    <section id="services-section" className="section">
      <div className="container">
        <h2 className="section-title">
          Our Specialised <span className="title-accent">Services</span>
        </h2>
        <p className="section-subtitle">
          With over 10 years of operations in Jabalpur, we offer premium consulting, designing, and civil work services.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          marginTop: '20px'
        }}>
          {services.map((svc, idx) => (
            <div
              key={idx}
              className="glass-panel service-card"
              style={{
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Card top border line */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '4px',
                width: '0%',
                background: 'var(--accent-color)',
                transition: 'width 0.4s ease'
              }} className="top-border-anim" />

              <div style={{
                color: 'var(--accent-color)',
                background: 'var(--navy-blue)',
                padding: '12px',
                borderRadius: '12px',
                width: 'fit-content',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}>
                {svc.icon}
              </div>

              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                fontFamily: 'Outfit, sans-serif'
              }}>
                {`0${idx + 1}. ${svc.title}`}
              </h3>

              <p style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: 'var(--text-secondary)'
              }}>
                {svc.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .service-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px var(--shadow-color) !important;
          border-color: var(--accent-color) !important;
        }
        .service-card:hover .top-border-anim {
          width: 100% !important;
        }
      `}</style>
    </section>
  );
}
