import { HomeHero } from '../components/home/HomeHero'
import { CategorySection } from '../components/home/CategorySection'
import { BestSellersSection } from '../components/home/BestSellersSection'
import { TestimonialSection } from '../components/home/TestimonialSection'

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <CategorySection />
      <BestSellersSection />
      <TestimonialSection />
    </main>
  )
}
