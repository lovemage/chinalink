export const dynamic = 'force-dynamic'

import { HeroSection } from '@/components/home/HeroSection'
import { PainPoints } from '@/components/home/PainPoints'
import { ServiceOverview } from '@/components/home/ServiceOverview'
import { LatestPosts } from '@/components/home/LatestPosts'
import { TrustSection } from '@/components/home/TrustSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PainPoints />
      <ServiceOverview />
      <LatestPosts />
      <TrustSection />
    </>
  )
}
