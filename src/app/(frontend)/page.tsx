export const dynamic = 'force-dynamic'

import { HeroSection } from '@/components/home/HeroSection'
import { PainPoints } from '@/components/home/PainPoints'
import { ServiceOverview } from '@/components/home/ServiceOverview'
import { LatestPosts } from '@/components/home/LatestPosts'
import { FAQSection } from '@/components/home/FAQSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PainPoints />
      <ServiceOverview />
      <LatestPosts />
      <FAQSection />
    </>
  )
}
