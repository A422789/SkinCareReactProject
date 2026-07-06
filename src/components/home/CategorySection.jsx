import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const categories = [
  {
    name: 'Body Splash',
    image: '/images/body-splash.jpg',
    href: '/shop?category=Body+Splash',
    blurb: 'Brume parfumée for skin lightly scented all day.',
  },
  {
    name: 'Serum',
    image: '/images/serum.jpg',
    href: '/shop?category=Serum',
    blurb: 'Potent elixirs for hydration, repair, and glow.',
  },
  {
    name: 'Skincare',
    image: '/images/body-cream.png',
    href: '/shop?category=Skincare',
    blurb: 'Everyday rituals of nourishment and radiance.',
  },
]

export function CategorySection() {
  return (
    <section style={{ backgroundColor: 'rgba(239,230,216,0.5)', padding: '4rem 0' }} id="categories">
      <div style={{ margin: '0 auto', maxWidth: '72rem', padding: '0 1rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', textAlign: 'center' }}
        >
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold)' }}>Explore</span>
          <h2 className="font-serif" style={{ fontSize: 'clamp(1.875rem, 4vw, 2.25rem)', color: 'var(--foreground)' }}>
            Shop by Category
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gap: '1.5rem' }} className="cat-grid">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
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
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease-out', display: 'block' }}
                    className="cat-img"
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(61,52,40,0.7), rgba(61,52,40,0.1), transparent)' }} />
                </div>
                <div style={{ position: 'absolute', inset: 'auto 0 0 0', display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '1.5rem' }}>
                  <h3 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--cream)' }}>{cat.name}</h3>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'rgba(247,241,232,0.8)' }}>{cat.blurb}</p>
                  <span style={{ marginTop: '0.5rem', fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold-light)', transition: 'transform 0.3s' }}>
                    {'Discover →'}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) {
          .cat-grid { grid-template-columns: repeat(3, 1fr); }
          section { padding: 6rem 0; }
        }
        .cat-card:hover .cat-img { transform: scale(1.07); }
      `}</style>
    </section>
  )
}
