import { useParams, Navigate } from 'react-router-dom'
import { getProduct, getRelatedProducts } from '../lib/products'
import { ProductDetail } from '../components/ProductDetail'
import { RelatedProducts } from '../components/RelatedProducts'

export default function ProductPage() {
  const { slug } = useParams()
  const product = getProduct(slug)

  if (!product) return <Navigate to="/shop" replace />

  const related = getRelatedProducts(product)

  return (
    <main style={{ margin: '0 auto', maxWidth: '72rem', padding: '3rem 1rem' }} className="product-page">
      <ProductDetail product={product} />
      <RelatedProducts products={related} />
      <style>{`
        @media (min-width: 768px) {
          .product-page { padding: 4rem 1.5rem; }
        }
      `}</style>
    </main>
  )
}
