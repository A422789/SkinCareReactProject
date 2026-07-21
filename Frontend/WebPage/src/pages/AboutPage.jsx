import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';

const fadeIn = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: 'easeOut' },
};

export default function AboutPage() {
  const { t, language } = useLanguage();
  const { settings } = useSettings();

  // Dynamic Content with fallback
  const logo = settings?.logoUrl || `${import.meta.env.BASE_URL}images/logo.png`;

  const introTitle = settings?.aboutIntro?.title?.[language] || settings?.aboutIntro?.title?.en || t('sec1Title');
  const introText = settings?.aboutIntro?.text?.[language] || settings?.aboutIntro?.text?.en || t('sec1Subtitle');

  const getLocalizedValue = (field, fallbackKey) => {
    if (field && typeof field === 'object') {
      return field[language] || field['en'] || t(fallbackKey);
    }
    return t(fallbackKey);
  };

  const sec1Title = getLocalizedValue(settings?.about?.sec1Title, 'sec1Title');
  const sec1Subtitle = getLocalizedValue(settings?.about?.sec1Subtitle, 'sec1Subtitle');
  const sec2Title = getLocalizedValue(settings?.about?.sec2Title, 'sec2Title');
  const sec2Subtitle = getLocalizedValue(settings?.about?.sec2Subtitle, 'sec2Subtitle');
  const sec3Title = getLocalizedValue(settings?.about?.sec3Title, 'sec3Title');
  const sec3Subtitle = getLocalizedValue(settings?.about?.sec3Subtitle, 'sec3Subtitle');

  const sec2Image = settings?.about?.sec2ImageUrl || '/placeholder.svg';
  const sec3Image = settings?.about?.sec3ImageUrl || '/placeholder.svg';

  return (
    <main>
      <section style={{ position: 'relative', overflow: 'hidden', padding: '5rem 0' }}>
        <div
          aria-hidden="true"
          style={{ pointerEvents: 'none', position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top, rgba(212,187,146,0.22), transparent 60%)' }}
        />
        <motion.div {...fadeIn} style={{ margin: '0 auto', display: 'flex', maxWidth: '48rem', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '0 1rem', textAlign: 'center' }}>
          <img
            src={settings?.logoUrl || `${import.meta.env.BASE_URL}images/logo.png`}
            alt="HE gold monogram logo"
            style={{ height: '10rem', width: 'auto', objectFit: 'contain', display: 'block' }}
            onError={(e) => { e.target.src = '/placeholder.svg'; }}
          />
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold)' }}>{t('ourStory')}</span>
          <h1 className="font-serif" style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)', lineHeight: 1.2, color: 'var(--foreground)' }}>
            {sec1Title}
          </h1>
          <p style={{ maxWidth: '36rem', lineHeight: 1.7, color: 'var(--muted-foreground)' }}>
            {sec1Subtitle}
          </p>
        </motion.div>
      </section>

      <section style={{ backgroundColor: 'rgba(239,230,216,0.5)', padding: '4rem 0' }}>
        <div style={{ margin: '0 auto', display: 'grid', maxWidth: '72rem', alignItems: 'center', gap: '3rem', padding: '0 1rem' }} className="about-grid">
          <motion.div {...fadeIn} style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', borderRadius: '1rem', boxShadow: '0 30px 60px -25px rgba(120,90,50,0.45)' }}>
            <img
              src={sec2Image}
              alt="HE Heritage Block"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </motion.div>
          <motion.div {...fadeIn} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold)' }}>{t('about')}</span>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', color: 'var(--foreground)' }}>
              {sec2Title}
            </h2>
            <p style={{ lineHeight: 1.7, color: 'var(--muted-foreground)' }}>
              {sec2Subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section style={{ padding: '4rem 0' }}>
        <div style={{ margin: '0 auto', display: 'grid', maxWidth: '72rem', alignItems: 'center', gap: '3rem', padding: '0 1rem' }} className="about-grid">
          <motion.div {...fadeIn} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="about-order-1">
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--mauve)' }}>{t('toners')}</span>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', color: 'var(--foreground)' }}>
              {sec3Title}
            </h2>
            <p style={{ lineHeight: 1.7, color: 'var(--muted-foreground)' }}>
              {sec3Subtitle}
            </p>
            <Link
              to="/shop"
              style={{ marginTop: '0.5rem', alignSelf: 'flex-start', borderRadius: '0.375rem', backgroundColor: 'var(--gold)', padding: '1rem 2.25rem', fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--primary-foreground)', textDecoration: 'none', transition: 'opacity 0.2s' }}
            >
              {t('exploreCollection')}
            </Link>
          </motion.div>
          <motion.div {...fadeIn} style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', borderRadius: '1rem', boxShadow: '0 30px 60px -25px rgba(120,90,50,0.45)' }} className="about-order-2">
            <img
              src={sec3Image}
              alt="HE Philosophy block"
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
  );
}
