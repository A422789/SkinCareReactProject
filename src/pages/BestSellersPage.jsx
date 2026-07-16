import { bestSellers } from '../lib/products'
import { CollectionPage } from '../components/CollectionPage'

export default function BestSellersPage() {
  return (
    <CollectionPage
      eyebrow="Most Loved"
      title="Best Sellers"
      description="Our most-loved rituals — the HE pieces that have become daily essentials for thousands."
      products={bestSellers}
    />
  )
}
