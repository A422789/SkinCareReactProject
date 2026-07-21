import { motion } from 'framer-motion'
import { ProductCard } from './ProductCard'
import { useLanguage } from '../context/LanguageContext'

export function CollectionPage({ eyebrow, title, description, products, accent = 'gold' }) {
  const { t } = useLanguage()

  return (
    <main style={{ margin: '0 auto', maxWidth: '72rem', padding: '3.5rem 1rem' }} className="collection-main">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', textAlign: 'center' }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: accent === 'mauve' ? 'var(--mauve)' : 'var(--gold)',
          }}
        >
          {eyebrow}
        </span>
        <h1 className="font-serif" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--foreground)' }}>{title}</h1>
        <p style={{ maxWidth: '36rem', lineHeight: 1.7, color: 'var(--muted-foreground)' }}>{description}</p>
        <span
          aria-hidden="true"
          style={{ marginTop: '0.5rem', height: '1px', width: '4rem', backgroundColor: accent === 'mauve' ? 'var(--mauve)' : 'var(--gold)' }}
        />
      </motion.div>

      {products.length === 0 ? (
        <p style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--muted-foreground)' }}>{t('noProducts')}</p>
      ) : (
        <div className="products-flex">
          {products.map((product, i) => (
            <div key={product.id || product._id} className="products-item">
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </div>
      )}
      <style>{`
        .collection-main { padding: 3.5rem 1rem; }
        .products-flex {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        .products-item {
          width: 100%;
          max-width: 20rem;
        }
        @media (min-width: 768px) {
          .collection-main { padding: 5rem 1.5rem; }
          .products-flex { 
            flex-direction: row; 
            flex-wrap: wrap; 
            gap: 1.25rem; 
            justify-content: center; 
          }
          .products-item { 
            width: calc(25% - 0.95rem); 
            max-width: none;
          }
        }
      `}</style>
    </main>
  )
}
