import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../lib/cart-context'
import { formatPrice } from '../lib/products'

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart()

  return (
    <main style={{ margin: '0 auto', maxWidth: '72rem', padding: '3.5rem 1rem' }} className="cart-main">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', textAlign: 'center' }}
      >
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold)' }}>Almost Yours</span>
        <h1 className="font-serif" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--foreground)' }}>Your Bag</h1>
      </motion.div>

      {items.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '4rem 0' }}>
          <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="HE Logo" style={{ height: '6rem', width: 'auto', objectFit: 'contain' }} />
          <p style={{ color: 'var(--muted-foreground)' }}>Your bag is empty — your ritual awaits.</p>
          <Link
            to="/shop"
            style={{ borderRadius: '0.375rem', backgroundColor: 'var(--gold)', padding: '1rem 2.25rem', fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--primary-foreground)', textDecoration: 'none' }}
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', alignItems: 'start', gap: '2.5rem' }} className="cart-grid">
          <ul style={{ display: 'flex', flexDirection: 'column', borderRadius: '0.75rem', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '0 1.5rem', listStyle: 'none', margin: 0 }}>
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.li
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: 40 }}
                  style={{ display: 'flex', gap: '1.25rem', padding: '1.5rem 0', borderBottom: '1px solid var(--border)' }}
                  className="cart-item"
                >
                  <Link
                    to={`/product/${item.product.slug}`}
                    style={{ position: 'relative', height: '8rem', width: '6rem', flexShrink: 0, overflow: 'hidden', borderRadius: '0.5rem', backgroundColor: 'var(--pearl)', display: 'block' }}
                  >
                    <img
                      src={item.product.image || '/placeholder.svg'}
                      alt={item.product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </Link>
                  <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '0.25rem' }}>
                    <p style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
                      {item.product.category}
                    </p>
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="font-serif"
                      style={{ fontSize: '1.125rem', color: 'var(--foreground)', textDecoration: 'none', transition: 'color 0.2s' }}
                    >
                      {item.product.name}
                    </Link>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{item.product.size}</p>
                    <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0.375rem', border: '1px solid var(--border)' }}>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          style={{ display: 'flex', height: '2.25rem', width: '2.25rem', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer' }}
                          aria-label={`Decrease quantity of ${item.product.name}`}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ width: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          style={{ display: 'flex', height: '2.25rem', width: '2.25rem', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer' }}
                          aria-label={`Increase quantity of ${item.product.name}`}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontWeight: 500, color: 'var(--gold)' }}>
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id)}
                          style={{ color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                          aria-label={`Remove ${item.product.name} from bag`}
                          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--destructive)'}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted-foreground)'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1.5rem' }}
            aria-label="Order summary"
            className="cart-summary"
          >
            <h2 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--foreground)' }}>Summary</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted-foreground)' }}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted-foreground)' }}>
                <span>Shipping</span>
                <span style={{ color: 'var(--gold)' }}>Complimentary</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.875rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>Total</span>
              <span className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--foreground)' }}>{formatPrice(subtotal)}</span>
            </div>
            <Link
              to="/checkout"
              style={{ borderRadius: '0.375rem', backgroundColor: 'var(--gold)', padding: '1rem', textAlign: 'center', fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--primary-foreground)', boxShadow: '0 14px 30px -12px rgba(176,141,87,0.7)', textDecoration: 'none', transition: 'opacity 0.2s' }}
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/shop"
              style={{ textAlign: 'center', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted-foreground)', textDecoration: 'none', transition: 'color 0.2s' }}
            >
              Continue Shopping
            </Link>
          </motion.aside>
        </div>
      )}
      <style>{`
        @media (min-width: 768px) { .cart-main { padding: 5rem 1.5rem; } }
        @media (min-width: 1024px) { .cart-grid { grid-template-columns: 1fr 360px; } .cart-summary { position: sticky; top: 7rem; } }
        .cart-item:last-child { border-bottom: none; }
      `}</style>
    </main>
  )
}
