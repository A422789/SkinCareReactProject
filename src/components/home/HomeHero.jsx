import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FloatingBottle } from '../FloatingBottle'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 * i, ease: 'easeOut' },
  }),
}

export function HomeHero() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        aria-hidden="true"
        style={{ pointerEvents: 'none', position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top, rgba(212,187,146,0.25), transparent 60%)' }}
      />
      <div style={{ margin: '0 auto', display: 'grid', maxWidth: '72rem', alignItems: 'center', gap: '3rem', padding: '4rem 1rem' }} className="hero-grid">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1.5rem' }}>
          <motion.span
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold)' }}
          >
            <span style={{ height: '1px', width: '2.5rem', backgroundColor: 'var(--gold)' }} aria-hidden="true" />
            The Art of Radiance
          </motion.span>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="font-serif"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 500, lineHeight: 1.08, color: 'var(--foreground)' }}
          >
            Skin, lightly
            <span className="gold-3d" style={{ display: 'block', fontWeight: 'bold' }}>perfumed</span>
            all day.
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            style={{ maxWidth: '28rem', lineHeight: 1.7, color: 'var(--muted-foreground)' }}
          >
            Discover HE — a collection of luxurious body splashes, serums, and skincare rituals
            crafted with rare botanicals and a whisper of gold.
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}
          >
            <Link
              to="/shop"
              style={{ borderRadius: '0.375rem', backgroundColor: 'var(--gold)', padding: '1rem 2.25rem', fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--primary-foreground)', boxShadow: '0 14px 30px -12px rgba(176,141,87,0.7)', textDecoration: 'none', transition: 'all 0.2s' }}
            >
              Shop Now
            </Link>
            <Link
              to="/new-arrivals"
              style={{ borderRadius: '0.375rem', border: '1px solid var(--gold)', padding: '1rem 2.25rem', fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', textDecoration: 'none', transition: 'all 0.2s' }}
            >
              New Arrivals
            </Link>
          </motion.div>
        </div>

        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '1rem' }}>
          <motion.div
            initial={{ opacity: 0, x: -40, rotate: -4 }}
            animate={{ opacity: 1, x: 0, rotate: -3 }}
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
            style={{ width: '42%' }}
          >
            <FloatingBottle
              src={`${import.meta.env.BASE_URL}images/body-splash.jpg`}
              alt="HE Signature Body Splash bottle with gold cap"
              priority
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40, rotate: 4 }}
            animate={{ opacity: 1, x: 0, rotate: 3 }}
            transition={{ duration: 0.9, delay: 0.45, ease: 'easeOut' }}
            style={{ width: '38%', paddingBottom: '2.5rem' }}
          >
            <FloatingBottle
              src={`${import.meta.env.BASE_URL}images/serum.jpg`}
              alt="HE Hydrating Serum dropper bottle"
              delayed
              priority
            />
          </motion.div>
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) {
          .hero-grid { grid-template-columns: 1fr 1fr; gap: 2rem; padding: 6rem 1.5rem; }
        }
      `}</style>
    </section>
  )
}
