import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductCard } from './ProductCard'
import { useLanguage } from '../context/LanguageContext'

export function RelatedProducts({ products }) {
  const scrollRef = useRef(null)
  const { t } = useLanguage()

  function scroll(direction) {
    scrollRef.current?.scrollBy({
      left: direction === 'left' ? -300 : 300,
      behavior: 'smooth',
    })
  }

  return (
    <section style={{ marginTop: '5rem' }} aria-label="Related products">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold)' }}>{t('completeRitual')}</span>
          <h2 className="font-serif" style={{ fontSize: '1.875rem', color: 'var(--foreground)' }}>{t('relatedProducts')}</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="related-scroll-btns">
          <button
            type="button"
            onClick={() => scroll('left')}
            style={{ display: 'flex', height: '2.5rem', width: '2.5rem', alignItems: 'center', justifyContent: 'center', borderRadius: '9999px', border: '1px solid var(--border)', color: 'var(--muted-foreground)', background: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
            aria-label="Scroll left"
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted-foreground)' }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            style={{ display: 'flex', height: '2.5rem', width: '2.5rem', alignItems: 'center', justifyContent: 'center', borderRadius: '9999px', border: '1px solid var(--border)', color: 'var(--muted-foreground)', background: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
            aria-label="Scroll right"
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted-foreground)' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </motion.div>

      <div
        ref={scrollRef}
        style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
      >
        {products.map((product, i) => (
          <div key={product._id || product.id || i} style={{ flexShrink: 0, scrollSnapAlign: 'start' }} className="related-item">
            <ProductCard product={product} index={i} />
          </div>
        ))}
      </div>
      <style>{`
        .related-item { width: 100%; }
        @media (min-width: 640px) { .related-item { width: calc(50% - 0.5rem); } }
        @media (min-width: 768px) {
          .related-item { width: calc(25% - 0.95rem); }
          .related-scroll-btns { display: flex; }
        }
        .related-scroll-btns { display: none; }
        @media (min-width: 768px) { .related-scroll-btns { display: flex; } }
      `}</style>
    </section>
  )
}
