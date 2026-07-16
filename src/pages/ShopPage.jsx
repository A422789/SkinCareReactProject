import { useSearchParams } from 'react-router-dom'
import { products } from '../lib/products'
import { CollectionPage } from '../components/CollectionPage'

export default function ShopPage() {
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category')
  const filtered = category ? products.filter((p) => p.category === category) : products

  return (
    <CollectionPage
      eyebrow="The Collection"
      title={category ?? 'Shop All'}
      description="Every HE ritual, from featherweight serums to enveloping body care — crafted with rare botanicals and a whisper of gold."
      products={filtered}
    />
  )
}
