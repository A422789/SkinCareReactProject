import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '../lib/cart-context'

const navLinks = [
  { href: '/shop', label: 'Shop' },
  { href: '/new-arrivals', label: 'New Arrivals' },
  { href: '/best-sellers', label: 'Best Sellers' },
  { href: '/offers', label: 'Offers' },
  { href: '/about', label: 'About' },
]

export function SiteHeader() {
  const location = useLocation()
  const pathname = location.pathname
  const { itemCount, openCart } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 40, borderBottom: '1px solid rgba(227,215,195,0.6)', backgroundColor: 'rgba(247,241,232,0.85)', backdropFilter: 'blur(12px)' }}>
      <div style={{ margin: '0 auto', display: 'flex', height: '4rem', maxWidth: '72rem', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem' }}>
        <button
          type="button"
          style={{ display: 'flex', height: '2.5rem', width: '2.5rem', alignItems: 'center', justifyContent: 'center', color: 'var(--foreground)', background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          className="md-hide"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img
            src="/images/logo.png"
            alt="HE Logo"
            style={{ height: '3rem', width: 'auto', objectFit: 'contain' }}
          />
        </Link>

        <nav className="desktop-nav" style={{ display: 'none', alignItems: 'center', gap: '2rem' }} aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              style={{
                position: 'relative',
                fontSize: '0.875rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                color: pathname === link.href ? 'var(--gold)' : 'rgba(61,52,40,0.8)',
                transition: 'color 0.2s',
              }}
            >
              {link.label}
              {pathname === link.href && (
                <motion.span
                  layoutId="nav-underline"
                  style={{ position: 'absolute', bottom: '-4px', left: 0, right: 0, height: '1px', backgroundColor: 'var(--gold)' }}
                />
              )}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={openCart}
          style={{ position: 'relative', display: 'flex', height: '2.5rem', width: '2.5rem', alignItems: 'center', justifyContent: 'center', color: 'var(--foreground)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
          aria-label={`Open cart, ${itemCount} items`}
        >
          <ShoppingBag size={20} />
          <AnimatePresence>
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                style={{ position: 'absolute', top: '-2px', right: '-2px', display: 'flex', height: '1.25rem', width: '1.25rem', alignItems: 'center', justifyContent: 'center', borderRadius: '9999px', backgroundColor: 'var(--gold)', fontSize: '0.65rem', fontWeight: 500, color: 'var(--primary-foreground)' }}
              >
                {itemCount}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', borderTop: '1px solid rgba(227,215,195,0.6)', backgroundColor: 'var(--cream)' }}
            aria-label="Mobile navigation"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '1rem' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    borderRadius: '0.375rem',
                    padding: '0.75rem',
                    fontSize: '0.875rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    backgroundColor: pathname === link.href ? 'var(--pearl)' : 'transparent',
                    color: pathname === link.href ? 'var(--gold)' : 'rgba(61,52,40,0.8)',
                    transition: 'background-color 0.2s, color 0.2s',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 768px) {
          .md-hide { display: none !important; }
          .desktop-nav { display: flex !important; }
        }
      `}</style>
    </header>
  )
}
