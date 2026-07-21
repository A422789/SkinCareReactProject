import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';

export function SiteFooter() {
  const { t, language } = useLanguage();
  const { settings } = useSettings();

  const footerLinks = [
    { href: '/shop', key: 'shop' },
    { href: '/new-arrivals', key: 'newArrivals' },
    { href: '/best-sellers', key: 'bestSellers' },
    { href: '/offers', key: 'offers' },
    { href: '/about', key: 'about' },
  ];

  const storeName = settings?.name?.[language] || settings?.name?.en || 'HE';

  return (
    <footer style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--pearl)' }}>
      <div style={{ margin: '0 auto', display: 'flex', maxWidth: '72rem', flexDirection: 'column', alignItems: 'center', gap: '2rem', padding: '3.5rem 1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <img
            src={settings?.logoUrl || `${import.meta.env.BASE_URL}images/logo.png`}
            alt={storeName}
            style={{ height: '4rem', width: 'auto', objectFit: 'contain' }}
            onError={(e) => {
              e.target.src = `${import.meta.env.BASE_URL}images/logo.png`;
            }}
          />
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
            <span style={{ height: '1px', width: '1.5rem', backgroundColor: 'var(--gold)' }} aria-hidden="true" />
            Splash · Serum · Skincare
            <span style={{ height: '1px', width: '1.5rem', backgroundColor: 'var(--gold)' }} aria-hidden="true" />
          </span>
        </div>

        <nav style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '0.75rem 2rem' }} aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted-foreground)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--gold)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--muted-foreground)'}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        {/* Contact Info Block */}
        {settings?.contact && (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem 2.5rem', fontSize: '0.75rem', color: 'var(--muted-foreground)', textAlign: 'center', borderTop: '1px dashed var(--border)', paddingTop: '1.5rem', width: '100%', maxWidth: '36rem' }}>
            <span>{t('email')}: <a href={`mailto:${settings.contact.email}`} style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 500 }}>{settings.contact.email}</a></span>
            <span>{t('phone')}: <a href={`tel:${settings.contact.phone.replace(/[^0-9+]/g, '')}`} style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 500 }}>{settings.contact.phone}</a></span>
            <span>{t('ourStore')}: <span style={{ color: 'var(--foreground)', fontWeight: 500 }}>{settings.contact.location}</span></span>
          </div>
        )}

        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '-0.5rem', textAlign: 'center' }}>
          {'© '}
          {new Date().getFullYear()}
          {` ${t('copyright')}`}
        </p>
      </div>
    </footer>
  );
}
