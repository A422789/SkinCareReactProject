import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { ProductCard } from '../ProductCard';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';

export function BestSellersSection() {
  const { t } = useLanguage();
  const { products } = useSettings();

  const list = products.filter(p => p.isBestSeller).slice(0, 4);

  if (list.length === 0) return null;

  return (
    <section style={{ padding: '4rem 0' }}>
      <div style={{ margin: '0 auto', maxWidth: '72rem', padding: '0 1rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', textAlign: 'center' }}
        >
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold)' }}>{t('mostLoved')}</span>
          <h2 className="font-serif" style={{ fontSize: 'clamp(1.875rem, 4vw, 2.25rem)', color: 'var(--foreground)' }}>
            {t('bestSellers')}
          </h2>
        </motion.div>

        <div className="bs-flex">
          {list.map((product, i) => (
            <div key={product.id || product._id} className="bs-item">
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </div>

        <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center' }}>
          <Link
            to="/best-sellers"
            style={{ borderRadius: '0.375rem', border: '1px solid var(--gold)', padding: '0.875rem 2.25rem', fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', textDecoration: 'none', transition: 'all 0.2s' }}
          >
            {t('viewAllBestSellers')}
          </Link>
        </div>
      </div>
      <style>{`
        .bs-flex {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        .bs-item {
          width: 100%;
          max-width: 20rem;
        }
        @media (min-width: 768px) {
          .bs-flex { 
            flex-direction: row; 
            flex-wrap: wrap; 
            gap: 1.25rem; 
            justify-content: center; 
          }
          .bs-item { 
            width: calc(25% - 0.95rem); 
            max-width: none;
          }
          section { padding: 6rem 0; }
        }
      `}</style>
    </section>
  )
}
