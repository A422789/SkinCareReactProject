import { motion } from 'framer-motion';
import { Star, BadgeCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';

export function TestimonialSection() {
  const { t } = useLanguage();
  const { settings } = useSettings();

  const list = settings?.testimonials || [];
  if (list.length === 0) return null;

  return (
    <section style={{ backgroundColor: 'rgba(239,230,216,0.5)', padding: '4rem 0' }}>
      <div style={{ margin: '0 auto', maxWidth: '72rem', padding: '0 1rem' }}>
        <h2 className="font-serif text-center" style={{ fontSize: '2rem', marginBottom: '2.5rem', color: 'var(--foreground)' }}>
          {t('testimonialsTitle')}
        </h2>
        
        {/* Horizontal scrollable container */}
        <div 
          className="testimonial-scroll"
          style={{ 
            display: 'flex', 
            gap: '1.5rem', 
            overflowX: 'auto', 
            padding: '1.5rem 0.5rem 2.5rem 0.5rem',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {list.map((item, idx) => (
            <motion.div
              key={item.id || item._id || idx}
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: 'easeOut' }}
              style={{ 
                flex: '0 0 20rem',
                scrollSnapAlign: 'start',
                borderRadius: '1rem', 
                backgroundColor: 'var(--card)', 
                boxShadow: '0 20px 40px -20px rgba(120,90,50,0.3)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '22rem',
                border: '1px solid rgba(227,215,195,0.4)'
              }}
            >
              {item.type === 'screenshot' ? (
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <img 
                    src={item.screenshotUrl} 
                    alt={item.caption || 'Customer review'} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div 
                    style={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      left: 0, 
                      right: 0, 
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', 
                      color: 'white', 
                      padding: '1rem',
                      fontSize: '0.75rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      textAlign: 'center'
                    }}
                  >
                    {t('verifiedScreenshot')}
                  </div>
                </div>
              ) : (
                <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', height: '100%', justifyContent: 'space-between' }}>
                  <span
                    aria-hidden="true"
                    className="gold-3d font-serif"
                    style={{ fontSize: '3.5rem', fontWeight: 'bold', lineHeight: 0.8 }}
                  >
                    {'\u201C'}
                  </span>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} aria-label="5 out of 5 stars">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} size={14} style={{ fill: 'var(--gold)', color: 'var(--gold)' }} />
                    ))}
                  </div>
                  
                  <blockquote className="font-serif" style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--foreground)', margin: 0, flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                    &quot;{item.quote}&quot;
                  </blockquote>
                  
                  <figcaption style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', marginTop: 'auto' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground)' }}>
                      <BadgeCheck size={14} style={{ color: 'var(--gold)' }} aria-hidden="true" />
                      {item.author}
                    </span>
                    <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
                      {t('verifiedCustomer')}
                    </span>
                  </figcaption>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Hide horizontal scrollbar scroll styling helper */}
      <style>{`
        .testimonial-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .testimonial-scroll::-webkit-scrollbar-track {
          background: rgba(227,215,195,0.2);
          border-radius: 999px;
        }
        .testimonial-scroll::-webkit-scrollbar-thumb {
          background: var(--gold-light);
          border-radius: 999px;
        }
        .testimonial-scroll::-webkit-scrollbar-thumb:hover {
          background: var(--gold);
        }
      `}</style>
    </section>
  )
}

