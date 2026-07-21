import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'
import { useSettings } from '../../context/SettingsContext'

export function CategorySection() {
  const { t, language } = useLanguage()
  const { categories: dbCategories, products: dbProducts } = useSettings()

  if (!dbCategories || dbCategories.length === 0) return null;

  const displayCategories = dbCategories.map(cat => {
    const catName = cat.name && typeof cat.name === 'object'
      ? (cat.name[language] || cat.name['en'] || '')
      : (cat.name || '');
    const catDescription = cat.description && typeof cat.description === 'object'
      ? (cat.description[language] || cat.description['en'] || '')
      : (cat.description || '');

    const firstProduct = dbProducts?.find(p => p.category === cat._id);
    const catImage = firstProduct?.image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
    const searchCatName = cat.name && typeof cat.name === 'object' ? cat.name.en : cat.name;

    return {
      key: cat._id,
      name: catName,
      image: catImage,
      href: `/shop?category=${encodeURIComponent(searchCatName)}`,
      blurb: catDescription
    };
  });

  return (
    <section style={{ backgroundColor: 'rgba(239,230,216,0.5)', padding: '4rem 0', position: 'relative' }} id="categories">
      <div style={{ margin: '0 auto', maxWidth: '72rem', padding: '0 1rem' }}>
        <div style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold)' }}>{t('explore')}</span>
          <h2 className="font-serif" style={{ fontSize: 'clamp(1.875rem, 4vw, 2.25rem)', color: 'var(--foreground)', margin: 0 }}>
            {t('shopByCategory')}
          </h2>
        </div>

        {/* Horizontal scroll container */}
        <div 
          className="cat-scroll"
          style={{ 
            display: 'flex', 
            gap: '1.5rem', 
            overflowX: 'auto', 
            paddingBottom: '1.5rem',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none'
          }}
        >
          {displayCategories.map((cat, i) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              style={{ flex: '0 0 20rem', scrollSnapAlign: 'start' }}
            >
              <Link
                to={cat.href}
                style={{ position: 'relative', display: 'block', overflow: 'hidden', borderRadius: '0.75rem', boxShadow: '0 16px 40px -20px rgba(120,90,50,0.4)', textDecoration: 'none' }}
                className="cat-card"
              >
                <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden' }}>
                  <img
                    src={cat.image || '/placeholder.svg'}
                    alt={cat.name}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease-out', display: 'block' }}
                    className="cat-img"
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(61,52,40,0.7), rgba(61,52,40,0.1), transparent)' }} />
                </div>
                <div style={{ position: 'absolute', inset: 'auto 0 0 0', display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '1.5rem' }}>
                  <h3 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--cream)' }}>{cat.name}</h3>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'rgba(247,241,232,0.8)' }}>{cat.blurb}</p>
                  <span style={{ marginTop: '0.5rem', fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold-light)', transition: 'transform 0.3s' }}>
                    {t('discover')}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        .cat-scroll::-webkit-scrollbar {
          display: none;
        }
        .cat-card:hover .cat-img { transform: scale(1.07); }
        @media (max-width: 768px) {
          section { padding: 4rem 0; }
        }
      `}</style>
    </section>
  )
}

