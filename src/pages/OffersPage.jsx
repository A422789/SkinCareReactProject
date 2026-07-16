import { offers } from '../lib/products'
import { CollectionPage } from '../components/CollectionPage'

export default function OffersPage() {
  return (
    <CollectionPage
      eyebrow="Limited Time"
      title="Offers"
      description="Exceptional HE rituals at special prices — for a limited time only."
      products={offers}
    />
  )
}
