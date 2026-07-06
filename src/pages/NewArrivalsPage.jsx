import { newArrivals } from '../lib/products'
import { CollectionPage } from '../components/CollectionPage'

export default function NewArrivalsPage() {
  return (
    <CollectionPage
      eyebrow="Just Arrived"
      title="New Arrivals"
      description="The latest additions to the HE collection — the Rose Line has arrived. Velvety, romantic, and utterly new."
      products={newArrivals}
      accent="mauve"
    />
  )
}
