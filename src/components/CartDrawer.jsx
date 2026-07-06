import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../lib/cart-context'
import { formatPrice } from '../lib/products'

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            style={{ position: 'fixed', inset: 0, zIndex: 50, backgroundColor: 'rgba(61,52,40,0.3)', backdropFilter: 'blur(2px)' }}
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            style={{ position: 'fixed', right: 0, top: 0, zIndex: 50, display: 'flex', height: '100%', width: '100%', maxWidth: '28rem', flexDirection: 'column', backgroundColor: 'var(--card)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
            role="dialog"
            aria-label="Shopping bag"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', padding: '1.25rem 1.5rem' }}>
              <h2 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--foreground)' }}>Your Bag</h2>
              <button
                type="button"
                onClick={closeCart}
                style={{ display: 'flex', height: '2.25rem', width: '2.25rem', alignItems: 'center', justifyContent: 'center', borderRadius: '9999px', color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
                aria-label="Close cart"
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--pearl)'; e.currentTarget.style.color = 'var(--foreground)' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--muted-foreground)' }}
              >
                <X size={18} />
              </button>
            </div>

            {items.length === 0 ? (
              <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '0 1.5rem' }}>
                <img src="/images/logo.png" alt="HE Logo" style={{ height: '5rem', width: 'auto', objectFit: 'contain' }} />
                <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Your bag is empty.</p>
                <Link
                  to="/shop"
                  onClick={closeCart}
                  style={{ borderRadius: '0.375rem', backgroundColor: 'var(--gold)', padding: '0.75rem 2rem', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--primary-foreground)', textDecoration: 'none', transition: 'opacity 0.2s' }}
                >
                  Shop Now
                </Link>
              </div>
            ) : (
              <>
                <ul style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem', listStyle: 'none', margin: 0 }}>
                  {items.map((item) => (
                    <motion.li
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(227,215,195,0.6)', padding: '1rem 0' }}
                    >
                      <div style={{ position: 'relative', height: '6rem', width: '4.5rem', flexShrink: 0, overflow: 'hidden', borderRadius: '0.375rem', backgroundColor: 'var(--pearl)' }}>
                        <img
                          src={item.product.image || '/placeholder.svg'}
                          alt={item.product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '0.25rem' }}>
                        <p className="font-serif" style={{ fontSize: '0.875rem', color: 'var(--foreground)' }}>{item.product.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{item.product.size}</p>
                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border)' }}>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              style={{ display: 'flex', height: '1.75rem', width: '1.75rem', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer' }}
                              aria-label={`Decrease quantity of ${item.product.name}`}
                            >
                              <Minus size={12} />
                            </button>
                            <span style={{ width: '1rem', textAlign: 'center', fontSize: '0.75rem' }}>{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              style={{ display: 'flex', height: '1.75rem', width: '1.75rem', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer' }}
                              aria-label={`Increase quantity of ${item.product.name}`}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--gold)' }}>
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        style={{ alignSelf: 'flex-start', color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                        aria-label={`Remove ${item.product.name} from bag`}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--destructive)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted-foreground)'}
                      >
                        <Trash2 size={15} />
                      </button>
                    </motion.li>
                  ))}
                </ul>

                <div style={{ borderTop: '1px solid var(--border)', backgroundColor: 'rgba(239,230,216,0.6)', padding: '1.25rem 1.5rem' }}>
                  <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.875rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>Subtotal</span>
                    <span className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--foreground)' }}>{formatPrice(subtotal)}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link
                      to="/checkout"
                      onClick={closeCart}
                      style={{ borderRadius: '0.375rem', backgroundColor: 'var(--gold)', padding: '0.875rem', textAlign: 'center', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--primary-foreground)', textDecoration: 'none', transition: 'opacity 0.2s' }}
                    >
                      Checkout
                    </Link>
                    <Link
                      to="/cart"
                      onClick={closeCart}
                      style={{ borderRadius: '0.375rem', border: '1px solid var(--gold)', padding: '0.875rem', textAlign: 'center', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', textDecoration: 'none', transition: 'all 0.2s' }}
                    >
                      View Bag
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
