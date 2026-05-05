export const dynamic = 'force-dynamic'

import { HeroSection } from '@/components/home/HeroSection'
import { PainPoints } from '@/components/home/PainPoints'
import { ServiceOverview } from '@/components/home/ServiceOverview'
import { LatestPosts } from '@/components/home/LatestPosts'
import { FAQSection } from '@/components/home/FAQSection'
import { getSetting } from '@/lib/queries/settings'

export default async function HomePage() {
  const lineOfficialUrl = await getSetting('lineOfficialUrl')

  return (
    <>
      <HeroSection lineOfficialUrl={lineOfficialUrl} />
      <PainPoints />
      <ServiceOverview />
      <LatestPosts />
      <FAQSection />
    </>
  )
}
