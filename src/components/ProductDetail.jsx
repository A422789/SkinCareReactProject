import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Minus, Plus } from 'lucide-react'
import { FloatingBottle } from './FloatingBottle'
import { formatPrice } from '../lib/products'
import { useCart } from '../lib/cart-context'

const accordions = [
  { key: 'ingredients', label: 'Ingredients' },
  { key: 'howToUse', label: 'How to Use' },
]

export function ProductDetail({ product }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [open, setOpen] = useState('ingredients')

  return (
    <div style={{ display: 'grid', alignItems: 'start', gap: '2.5rem' }} className="product-detail-grid">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ margin: '0 auto', width: '100%', maxWidth: '20rem' }}
        className="product-sticky"
      >
        <FloatingBottle src={product.image} alt={product.name} priority />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
        style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: product.isRoseLine ? 'var(--mauve)' : 'var(--gold)',
            }}
          >
            {product.category}
            {product.isNew && ' · New'}
          </span>
          <h1 className="font-serif" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--foreground)' }}>
            {product.name}
          </h1>
          <p style={{ fontSize: '0.875rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
            {product.tagline}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
          <span className="font-serif" style={{ fontSize: '1.875rem', color: 'var(--gold)' }}>{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span style={{ fontSize: '1.125rem', color: 'var(--muted-foreground)', textDecoration: 'line-through' }}>
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
          <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{product.size}</span>
        </div>

        <p style={{ lineHeight: 1.7, color: 'var(--muted-foreground)' }}>{product.description}</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0.375rem', border: '1px solid var(--border)' }}>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              style={{ display: 'flex', height: '3rem', width: '3rem', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer' }}
              aria-label="Decrease quantity"
            >
              <Minus size={15} />
            </button>
            <span style={{ width: '2rem', textAlign: 'center', fontSize: '0.875rem' }} aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              style={{ display: 'flex', height: '3rem', width: '3rem', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer' }}
              aria-label="Increase quantity"
            >
              <Plus size={15} />
            </button>
          </div>
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => addItem(product, quantity)}
            style={{ flex: 1, borderRadius: '0.375rem', backgroundColor: 'var(--gold)', padding: '1rem', fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--primary-foreground)', boxShadow: '0 14px 30px -12px rgba(176,141,87,0.7)', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
          >
            Add to Bag
          </motion.button>
        </div>

        <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', borderRadius: '0.75rem', border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}>
          {accordions.map(({ key, label }) => {
            const isOpen = open === key
            return (
              <div key={key} style={{ borderBottom: isOpen || key === 'howToUse' ? 'none' : '1px solid var(--border)' }}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : key)}
                  style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', borderBottom: key === 'ingredients' ? '1px solid var(--border)' : 'none' }}
                  aria-expanded={isOpen}
                >
                  <span style={{ fontSize: '0.875rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--foreground)' }}>
                    {label}
                  </span>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown size={16} style={{ color: 'var(--gold)' }} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p style={{ padding: '0 1.25rem 1.25rem', fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--muted-foreground)' }}>
                        {product[key]}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </motion.div>
      <style>{`
        @media (min-width: 768px) {
          .product-detail-grid { grid-template-columns: 1fr 1fr; gap: 4rem; }
          .product-sticky { position: sticky; top: 7rem; }
        }
      `}</style>
    </div>
  )
}
