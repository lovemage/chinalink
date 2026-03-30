import { getSettings } from '@/lib/queries/settings'
import { getInquiries } from '@/lib/queries/inquiries'
import SettingsManager from './SettingsManager'

export default async function SettingsPage() {
  const [settings, inquiries] = await Promise.all([
    getSettings(),
    getInquiries(),
  ])

  return <SettingsManager settings={settings} inquiries={inquiries} />
}
