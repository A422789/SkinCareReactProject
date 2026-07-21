import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatPrice } from '../lib/utils'
import { useCart } from '../lib/cart-context'
import { useLanguage } from '../context/LanguageContext'
import { useSettings } from '../context/SettingsContext'

export function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart()
  const { t, language } = useLanguage()
  const { categories } = useSettings()

  const getLocalizedValue = (field) => {
    if (!field) return ''
    if (typeof field === 'object') {
      return field[language] || field['en'] || ''
    }
    return field
  }

  const catObj = categories?.find(c => c._id === product.category || c._id === product.category?._id)
  const categoryNameField = catObj ? catObj.name : (product.category?.name || product.category)
  const categoryName = typeof categoryNameField === 'object'
    ? (categoryNameField[language] || categoryNameField['en'] || '')
    : categoryNameField

  const isNew = product.isNew || product.isNewArrival
  const hasOffer = product.hasOffer || (product.compareAtPrice > product.price)
  const finalPrice = product.hasOffer && product.offerPrice ? product.offerPrice : product.price
  const originalPrice = product.hasOffer ? product.price : product.compareAtPrice

  const productName = getLocalizedValue(product.name)
  const productSlug = product.slug || product._id

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: 'easeOut' }}
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '0.75rem', backgroundColor: 'var(--card)', boxShadow: '0 10px 35px -18px rgba(120,90,50,0.35)', transition: 'box-shadow 0.3s' }}
      className="product-card"
    >
      <Link
        to={`/product/${productSlug}`}
        style={{ position: 'relative', display: 'block', aspectRatio: '3/4', overflow: 'hidden', backgroundColor: 'var(--pearl)', textDecoration: 'none' }}
      >
        <img
          src={product.image || '/placeholder.svg'}
          alt={productName}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease-out', display: 'block' }}
          className="product-img"
        />
        <div style={{ position: 'absolute', left: '0.75rem', top: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {isNew && (
            <span
              style={{
                borderRadius: '9999px',
                padding: '0.25rem 0.75rem',
                fontSize: '0.6rem',
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--accent-foreground)',
                backgroundColor: product.isRoseLine ? 'var(--mauve)' : 'var(--gold)',
              }}
            >
              {t('new')}
            </span>
          )}
          {hasOffer && originalPrice > finalPrice && (
            <span style={{ borderRadius: '9999px', backgroundColor: 'var(--gold)', padding: '0.25rem 0.75rem', fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--primary-foreground)' }}>
              {`${t('saveBadge')} ${Math.round((1 - finalPrice / originalPrice) * 100)}%`}
            </span>
          )}
        </div>
      </Link>

      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '0.25rem', padding: '1rem 1.25rem 1.25rem' }}>
        <p style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
          {t(categoryName?.toLowerCase()) || categoryName}
        </p>
        <Link to={`/product/${productSlug}`} style={{ textDecoration: 'none' }}>
          <h3 className="font-serif" style={{ fontSize: '1.125rem', lineHeight: 1.3, color: 'var(--foreground)', transition: 'color 0.2s' }} className="product-name">
            {productName}
          </h3>
        </Link>
        <div style={{ marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--gold)' }}>{formatPrice(finalPrice)}</span>
          {hasOffer && originalPrice && (
            <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', textDecoration: 'line-through' }}>
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => addItem(product)}
          style={{ marginTop: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--gold)', backgroundColor: 'transparent', padding: '0.625rem', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', cursor: 'pointer', transition: 'all 0.3s' }}
          className="add-to-bag-btn"
        >
          {t('addToCart')}
        </button>
      </div>
      <style>{`
        .product-card:hover { box-shadow: 0 24px 50px -18px rgba(120,90,50,0.45); }
        .product-card:hover .product-img { transform: scale(1.06); }
        .product-card:hover .product-name { color: var(--gold); }
        .add-to-bag-btn:hover { background-color: var(--gold); color: var(--primary-foreground); }
      `}</style>
    </motion.article>
  )
}
