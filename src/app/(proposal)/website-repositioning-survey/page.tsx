import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ProposalQuestionnaire } from '@/components/proposal/ProposalQuestionnaire'
import {
  isProposalAccessTokenValid,
  PROPOSAL_ACCESS_COOKIE,
} from '@/lib/proposal/access'

export default async function WebsiteRepositioningSurveyPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get(PROPOSAL_ACCESS_COOKIE)?.value

  if (!isProposalAccessTokenValid(token)) {
    redirect('/website-repositioning-survey/login')
  }

  return <ProposalQuestionnaire />
}
