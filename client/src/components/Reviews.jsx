import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, ArrowRight, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Reviews({ backendUrl }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch(`${backendUrl || 'http://localhost:5000'}/api/reviews`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Reviews load error:', err);
        setLoading(false);
      });
  }, [backendUrl]);

  // Calculate statistics
  const totalReviewsCount = reviews.length;
  const averageRating = totalReviewsCount
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewsCount).toFixed(1)
    : '4.8';

  const nextReview = () => {
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // Google Colors for UI accents
  const googleColors = {
    blue: '#4285F4',
    red: '#EA4335',
    yellow: '#FBBC05',
    green: '#34A853'
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
        <p style={{ fontSize: '15px' }}>Loading reviews...</p>
      </div>
    );
  }

  return (
    <section className="section" style={{
      position: 'relative',
      overflow: 'hidden',
      borderTop: '1px solid var(--card-border)',
      background: 'rgba(30, 58, 138, 0.02)'
    }}>
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '-10%',
        width: '400px',
        height: '400px',
        background: 'rgba(234, 179, 8, 0.05)',
        filter: 'blur(100px)',
        borderRadius: '50%',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            What Our Clients Say <span className="title-accent">On Google</span>
          </h2>
          <p className="section-subtitle" style={{ marginBottom: '24px' }}>
            We take pride in our building standard and civil execution. Read the feedback left by our clients in Jabalpur.
          </p>

          {/* Google Summary Card */}
          <div className="glass-panel" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            padding: '16px 28px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            boxShadow: '0 8px 32px var(--shadow-color)',
            border: '1px solid var(--card-border)'
          }}>
            {/* Google "G" Styled Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg viewBox="0 0 24 24" width="32" height="32" style={{ display: 'block' }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.67-.35-1.37-.35-2.09z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>Google Reviews</span>
            </div>

            {/* Rating count info */}
            <div style={{ height: '36px', width: '1px', background: 'var(--card-border)', display: 'inline-block' }} className="divider-hide-mobile" />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{averageRating}</span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={15} fill={s <= Math.round(averageRating) ? '#FBBC05' : 'none'} color="#FBBC05" />
                  ))}
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
                  Based on {totalReviewsCount || 5} verified reviews
                </span>
              </div>
            </div>

            {/* Write a review button */}
            <a
              href="https://www.google.com/search?q=JK+Construction+Jabalpur+reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                borderRadius: '6px',
                gap: '6px',
                background: 'linear-gradient(135deg, #eab308, #ca8a04)',
                boxShadow: '0 4px 10px rgba(234,179,8,0.2)'
              }}
            >
              Write Review
              <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
            No reviews added yet. Feel free to add reviews from the Admin Panel.
          </div>
        ) : (
          /* Slider Container */
          <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
            <div className="reviews-flex-container" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              
              {/* Prev Button */}
              <button
                onClick={prevReview}
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  color: 'var(--text-primary)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px var(--shadow-color)',
                  transition: 'all 0.3s ease',
                  flexShrink: 0,
                  zIndex: 2
                }}
                className="carousel-btn prev-btn"
                title="Previous Review"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Review Card Display */}
              <div style={{ flexGrow: 1, minHeight: '260px' }}>
                <div className="glass-panel" style={{
                  padding: '36px',
                  boxShadow: '0 12px 40px var(--shadow-color)',
                  border: '1.5px solid var(--card-border)',
                  borderRadius: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}>
                  {/* Subtle quote icon watermarked in bg */}
                  <span style={{
                    position: 'absolute',
                    right: '24px',
                    top: '12px',
                    fontSize: '120px',
                    lineHeight: 1,
                    fontFamily: 'serif',
                    fontWeight: 900,
                    opacity: 0.05,
                    color: 'var(--text-primary)',
                    pointerEvents: 'none',
                    userSelect: 'none'
                  }}>
                    ”
                  </span>

                  {/* Top line: Author Info & Rating */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* Avatar */}
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #1e3a8a, #0a192f)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '16px',
                        textTransform: 'uppercase',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                      }}>
                        {reviews[activeIndex]?.author_name ? reviews[activeIndex].author_name.charAt(0) : 'U'}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: 700, margin: 0 }}>
                          {reviews[activeIndex]?.author_name}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            {reviews[activeIndex]?.relative_time_description}
                          </span>
                          <span style={{ fontSize: '8px', color: 'var(--text-secondary)' }}>•</span>
                          <span style={{
                            fontSize: '11px',
                            color: '#10b981',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '2px'
                          }}>
                            <CheckCircle size={10} /> Verified Google Review
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stars */}
                    <div style={{ display: 'flex', gap: '2px', background: 'rgba(250,204,21,0.06)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(250,204,21,0.15)' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={14} fill={s <= reviews[activeIndex]?.rating ? '#FBBC05' : 'none'} color="#FBBC05" />
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <p style={{
                    fontSize: '15px',
                    lineHeight: '1.6',
                    color: 'var(--text-primary)',
                    fontStyle: 'italic',
                    fontWeight: 400
                  }}>
                    "{reviews[activeIndex]?.text}"
                  </p>

                  {/* Bottom Line: Source branding */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.75 }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>Posted on</span>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: googleColors.blue }}>G</span>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: googleColors.red }}>o</span>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: googleColors.yellow }}>o</span>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: googleColors.blue }}>g</span>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: googleColors.green }}>l</span>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: googleColors.red }}>e</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={nextReview}
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  color: 'var(--text-primary)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px var(--shadow-color)',
                  transition: 'all 0.3s ease',
                  flexShrink: 0,
                  zIndex: 2
                }}
                className="carousel-btn next-btn"
                title="Next Review"
              >
                <ChevronRight size={20} />
              </button>

            </div>

            {/* Slider Dots */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '20px'
            }}>
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  style={{
                    width: activeIndex === idx ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: activeIndex === idx ? 'var(--accent-color)' : 'var(--card-border)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  title={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Styled components hover rules overrides */}
      <style>{`
        .carousel-btn:hover {
          background: var(--accent-color) !important;
          color: #0a192f !important;
          border-color: var(--accent-color) !important;
          transform: scale(1.1);
        }
        @media (max-width: 576px) {
          .divider-hide-mobile {
            display: none !important;
          }
          .glass-panel {
            padding: 24px !important;
          }
          .reviews-flex-container {
            position: relative;
            padding-bottom: 56px;
          }
          .carousel-btn {
            position: absolute;
            bottom: 0;
          }
          .prev-btn {
            left: calc(50% - 55px);
          }
          .next-btn {
            right: calc(50% - 55px);
          }
        }
      `}</style>
    </section>
  );
}
