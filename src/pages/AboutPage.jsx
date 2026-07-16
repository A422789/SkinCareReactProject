import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const fadeIn = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: 'easeOut' },
}

export default function AboutPage() {
  return (
    <main>
      <section style={{ position: 'relative', overflow: 'hidden', padding: '5rem 0' }}>
        <div
          aria-hidden="true"
          style={{ pointerEvents: 'none', position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top, rgba(212,187,146,0.22), transparent 60%)' }}
        />
        <motion.div {...fadeIn} style={{ margin: '0 auto', display: 'flex', maxWidth: '48rem', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '0 1rem', textAlign: 'center' }}>
          <img
            src={`${import.meta.env.BASE_URL}images/logo.png`}
            alt="HE gold monogram logo"
            style={{ height: '10rem', width: 'auto', objectFit: 'contain', display: 'block' }}
          />
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold)' }}>Our Story</span>
          <h1 className="font-serif" style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)', lineHeight: 1.2, color: 'var(--foreground)' }}>
            A House Built on the Quiet Luxury of Ritual
          </h1>
          <p style={{ maxWidth: '36rem', lineHeight: 1.7, color: 'var(--muted-foreground)' }}>
            HE was born from a simple belief: that the most beautiful moments of the day are the
            ones we keep for ourselves.
          </p>
        </motion.div>
      </section>

      <section style={{ backgroundColor: 'rgba(239,230,216,0.5)', padding: '4rem 0' }}>
        <div style={{ margin: '0 auto', display: 'grid', maxWidth: '72rem', alignItems: 'center', gap: '3rem', padding: '0 1rem' }} className="about-grid">
          <motion.div {...fadeIn} style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', borderRadius: '1rem', boxShadow: '0 30px 60px -25px rgba(120,90,50,0.45)' }}>
            <img
              src={`${import.meta.env.BASE_URL}images/body-splash.jpg`}
              alt="HE Signature Body Splash amid white jasmine blossoms"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </motion.div>
          <motion.div {...fadeIn} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold)' }}>Heritage</span>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', color: 'var(--foreground)' }}>
              Crafted Slowly, Worn Lightly
            </h2>
            <p style={{ lineHeight: 1.7, color: 'var(--muted-foreground)' }}>
              Each HE formula begins in small ateliers where botanicals are pressed, distilled, and
              folded into featherweight textures. Our signature brume parfumée took three years to
              perfect — a scent designed not to announce itself, but to linger like a memory.
            </p>
            <p style={{ lineHeight: 1.7, color: 'var(--muted-foreground)' }}>
              From the first golden cap to the last drop of serum, everything we make is an
              invitation to slow down and honor your skin.
            </p>
          </motion.div>
        </div>
      </section>

      <section style={{ padding: '4rem 0' }}>
        <div style={{ margin: '0 auto', display: 'grid', maxWidth: '72rem', alignItems: 'center', gap: '3rem', padding: '0 1rem' }} className="about-grid">
          <motion.div {...fadeIn} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="about-order-1">
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--mauve)' }}>Philosophy</span>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', color: 'var(--foreground)' }}>
              Fewer, Finer, Forever
            </h2>
            <p style={{ lineHeight: 1.7, color: 'var(--muted-foreground)' }}>
              We believe in fewer products, finer ingredients, and rituals that last forever. Every
              bottle is refillable, every ingredient traceable, and every formula tested for all
              skin types — never on animals.
            </p>
            <Link
              to="/shop"
              style={{ marginTop: '0.5rem', alignSelf: 'flex-start', borderRadius: '0.375rem', backgroundColor: 'var(--gold)', padding: '1rem 2.25rem', fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--primary-foreground)', textDecoration: 'none', transition: 'opacity 0.2s' }}
            >
              Explore the Collection
            </Link>
          </motion.div>
          <motion.div {...fadeIn} style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', borderRadius: '1rem', boxShadow: '0 30px 60px -25px rgba(120,90,50,0.45)' }} className="about-order-2">
            <img
              src={`${import.meta.env.BASE_URL}images/serum.jpg`}
              alt="HE Hydrating Serum with dried botanicals"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </motion.div>
        </div>
      </section>
      <style>{`
        @media (min-width: 768px) {
          .about-grid { grid-template-columns: 1fr 1fr; padding: 0 1.5rem; }
          .about-order-1 { order: 1; }
          .about-order-2 { order: 2; }
          section { padding: 6rem 0; }
        }
      `}</style>
    </main>
  )
}
