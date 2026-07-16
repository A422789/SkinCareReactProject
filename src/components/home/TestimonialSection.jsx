import { motion } from 'framer-motion'
import { Star, BadgeCheck } from 'lucide-react'

export function TestimonialSection() {
  return (
    <section style={{ backgroundColor: 'rgba(239,230,216,0.5)', padding: '4rem 0' }}>
      <div style={{ margin: '0 auto', maxWidth: '48rem', padding: '0 1rem' }}>
        <motion.figure
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', borderRadius: '1rem', backgroundColor: 'var(--card)', padding: '3rem 1.5rem', textAlign: 'center', boxShadow: '0 24px 60px -28px rgba(120,90,50,0.45)', margin: 0 }}
        >
          <span
            aria-hidden="true"
            className="gold-3d font-serif"
            style={{ fontSize: '4.5rem', fontWeight: 'bold', lineHeight: 1 }}
          >
            {'\u201C'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} aria-label="5 out of 5 stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} style={{ fill: 'var(--gold)', color: 'var(--gold)' }} />
            ))}
          </div>
          <blockquote className="font-serif" style={{ fontSize: 'clamp(1.125rem, 3vw, 1.5rem)', lineHeight: 1.7, color: 'var(--foreground)', margin: 0 }}>
            The Signature Body Splash is pure luxury. The scent is delicate yet lasts all day, and
            my skin has never felt softer. It&apos;s become my daily ritual.
          </blockquote>
          <figcaption style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground)' }}>
              <BadgeCheck size={16} style={{ color: 'var(--gold)' }} aria-hidden="true" />
              Amira K.
            </span>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
              Verified Customer
            </span>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  )
}
