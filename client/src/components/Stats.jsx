import React, { useState, useEffect } from 'react';

function Counter({ end, duration = 1500 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const progressPercent = Math.min(progress / duration, 1);
      setCount(Math.floor(progressPercent * end));
      
      if (progressPercent < 1) {
        requestAnimationFrame(animateCount);
      }
    };
    requestAnimationFrame(animateCount);
  }, [end, duration]);

  return <span>{count}</span>;
}

export default function Stats() {
  const statsData = [
    { value: 10, label: 'Years of Experience', suffix: '+' },
    { value: 100, label: 'Completed Projects', suffix: '+' },
    { value: 120, label: 'Machinery Equipments', suffix: '' },
    { value: 40, label: 'Professional Experts', suffix: '+' }
  ];

  return (
    <section style={{
      padding: '40px 0',
      background: 'var(--navy-blue)',
      color: '#ffffff',
      borderTop: '2px solid var(--accent-color)',
      borderBottom: '2px solid var(--accent-color)'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '30px',
        textAlign: 'center'
      }}>
        {statsData.map((stat, idx) => (
          <div key={idx} style={{
            padding: '16px',
            borderRight: idx < statsData.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
          }} className="stat-card">
            <h2 style={{
              fontSize: '48px',
              color: 'var(--accent-color)',
              fontWeight: 800,
              fontFamily: 'Outfit, sans-serif',
              marginBottom: '6px'
            }}>
              <Counter end={stat.value} />
              {stat.suffix}
            </h2>
            <p style={{
              fontSize: '14px',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.7)',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 768px) {
          .stat-card {
            border-right: none !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 24px;
          }
          .stat-card:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }
        }
      `}</style>
    </section>
  );
}
