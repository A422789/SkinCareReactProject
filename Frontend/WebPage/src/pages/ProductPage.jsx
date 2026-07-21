import { useParams, Navigate } from 'react-router-dom';
import { ProductDetail } from '../components/ProductDetail';
import { RelatedProducts } from '../components/RelatedProducts';
import { useSettings } from '../context/SettingsContext';

export default function ProductPage() {
  const { slug } = useParams();
  const { products, isLoading } = useSettings();

  if (isLoading) return null; // Loader is handled globally by Suspense/SettingsContext

  const product = products.find((p) => p._id === slug || p.slug === slug);

  if (!product) return <Navigate to="/shop" replace />;

  const related = products.filter((p) => p._id !== product._id).slice(0, 4);

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
  );
}
