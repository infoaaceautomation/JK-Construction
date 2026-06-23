import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle, AlertCircle, Facebook, Youtube, Instagram, Linkedin, Twitter, Info } from 'lucide-react';

export default function ContactForm({ backendUrl }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    project_type: 'Civil Construction',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    fetch(`${backendUrl || 'http://localhost:5000'}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to submit enquiry');
        return res.json();
      })
      .then(() => {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          project_type: 'Civil Construction',
          message: ''
        });
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const socialHandles = [
    { name: 'Facebook', icon: <Facebook size={20} />, url: 'https://www.facebook.com/JKConstruction-117381683425029/', color: '#1877f2' },
    { name: 'Instagram', icon: <Instagram size={20} />, url: 'https://www.instagram.com/jkconstructionjbp?igsh=OGQ5ZDc2ODk2ZA%3D%3D', color: '#e1306c' },
    { name: 'YouTube', icon: <Youtube size={20} />, url: 'https://www.youtube.com/channel/UC_1sTceTp9I77cvAcU3jqxw', color: '#ff0000' },
    { name: 'LinkedIn', icon: <Linkedin size={20} />, url: 'https://www.linkedin.com/company/jkconstruction/', color: '#0077b5' }
  ];

  return (
    <section id="contact-section" className="section" style={{
      background: 'rgba(30, 58, 138, 0.01)'
    }}>
      <div className="container">
        <h2 className="section-title">
          Contact <span className="title-accent">Us</span>
        </h2>
        <p className="section-subtitle">
          Have queries about blueprints, interior upgrades, or construction estimations? Get in touch with JK Construction today.
        </p>

        {/* Layout Wrapper: 2 Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '40px',
          alignItems: 'start',
          marginTop: '20px'
        }} className="contact-grid">
          
          {/* Left Column: About, Details, Map, and Socials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* About segment */}
            <div className="glass-panel" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '20px', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Info size={20} style={{ color: 'var(--accent-color)' }} />
                About JK Construction
              </h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                Founded in 2010 by <b>Shri Jinesh Kumar Mehra</b>, JK Construction is Jabalpur's premier engineering design, elevation map, and civil contracting partner. We manage residential bungalows, duplex units, retail malls, and office interiors with a firm commit to timely delivery, quality materials, and transparent transaction policies.
              </p>
            </div>

            {/* Direct details and Social handles */}
            <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '20px', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif', marginBottom: '8px' }}>
                Quick Contacts
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ color: 'var(--accent-color)', background: 'var(--navy-blue)', padding: '8px', borderRadius: '8px', display: 'flex' }}><Phone size={18} /></div>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>+91-7692931715</div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ color: 'var(--accent-color)', background: 'var(--navy-blue)', padding: '8px', borderRadius: '8px', display: 'flex' }}><Mail size={18} /></div>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>jkc@jkconstructionjbp.com</div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ color: 'var(--accent-color)', background: 'var(--navy-blue)', padding: '8px', borderRadius: '8px', display: 'flex' }}><MapPin size={18} /></div>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>Plot No-236, Rajul City , Mandala-Jabalpur Road , Phase-1 Bilhari , Jabalpur , MP-482020</div>
                </div>
              </div>

              {/* Social Media Links */}
              <div style={{ marginTop: '10px' }}>
                <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Connect with us on Social Media
                </h4>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {socialHandles.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-btn"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'var(--navy-blue)',
                        color: 'var(--accent-color)',
                        border: '1px solid var(--card-border)',
                        transition: 'all 0.3s ease',
                      }}
                      title={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="glass-panel" style={{ padding: '16px', overflow: 'hidden', height: '300px' }}>
              <iframe
                title="JK Construction Jabalpur Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117359.8820641154!2d79.88939228499252!3d23.175780518386127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3981ae1a0fb6a97d%3A0x440818f776c41b4a!2sJabalpur%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1718960000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right Column: Enquiry Form */}
          <div className="glass-panel" style={{ padding: '36px' }}>
            <h3 style={{ fontSize: '20px', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif', marginBottom: '24px' }}>
              Submit Enquiry Form
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Status notifications */}
              {success && (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid var(--status-resolved)',
                  color: 'var(--status-resolved)',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <CheckCircle size={18} />
                  <span>Enquiry submitted! Check the Admin Dashboard to see it live.</span>
                </div>
              )}

              {error && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid #ef4444',
                  color: '#ef4444',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Shri Jinesh Kumar"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9171466180"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>Email ID</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@email.com"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>Required Service *</label>
                <select
                  name="project_type"
                  value={formData.project_type}
                  onChange={handleChange}
                  required
                >
                  <option value="Civil Construction">Civil Construction</option>
                  <option value="House Renovation">House Renovation</option>
                  <option value="Interior Designing">Interior Designing</option>
                  <option value="Architecture & Map Design">Architecture & Map Design</option>
                  <option value="Property Consultancy">Property Consultancy</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>Project Description *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Details about plot coordinates, square feet area, design ideas..."
                  rows={4}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
              >
                {loading ? 'Submitting...' : (
                  <>
                    <span>Submit Enquiry</span>
                    <Send size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      <style>{`
        .social-btn:hover {
          transform: translateY(-3px);
          background: var(--accent-color) !important;
          color: #0a192f !important;
          box-shadow: 0 4px 12px rgba(234, 179, 8, 0.3) !important;
        }
        @media (max-width: 992px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
        }
      `}</style>
    </section>
  );
}
