import { Link } from 'react-router-dom'

export function SiteFooter() {
  return (
    <footer style={{ borderTop: '1px solid rgba(227,215,195,0.6)', backgroundColor: 'var(--pearl)' }}>
      <div style={{ margin: '0 auto', display: 'flex', maxWidth: '72rem', flexDirection: 'column', alignItems: 'center', gap: '2rem', padding: '3.5rem 1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <img
            src={`${import.meta.env.BASE_URL}images/logo.png`}
            alt="HE Logo"
            style={{ height: '4rem', width: 'auto', objectFit: 'contain' }}
          />
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
            <span style={{ height: '1px', width: '1.5rem', backgroundColor: 'var(--gold)' }} aria-hidden="true" />
            Splash · Serum · Skincare
            <span style={{ height: '1px', width: '1.5rem', backgroundColor: 'var(--gold)' }} aria-hidden="true" />
          </span>
        </div>

        <nav style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '0.75rem 2rem' }} aria-label="Footer navigation">
          {[
            { href: '/shop', label: 'Shop' },
            { href: '/new-arrivals', label: 'New Arrivals' },
            { href: '/best-sellers', label: 'Best Sellers' },
            { href: '/offers', label: 'Offers' },
            { href: '/about', label: 'About' },
          ].map((link) => (
            <Link
              key={link.href}
              to={link.href}
              style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted-foreground)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--gold)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--muted-foreground)'}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
          {'© '}
          {new Date().getFullYear()}
          {' HE Skincare. Crafted with care for radiant skin.'}
        </p>
      </div>
    </footer>
  )
}
