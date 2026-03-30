import { getMembers } from '@/lib/queries/members'
import MembersTable from './MembersTable'

interface PageProps {
  searchParams: Promise<{
    search?: string
  }>
}

export default async function MembersPage({ searchParams }: PageProps) {
  const params = await searchParams
  const search = params.search ?? ''

  const membersList = await getMembers({
    search: search || undefined,
  })

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">會員管理</h1>
      </div>

      <MembersTable members={membersList} initialSearch={search} />
    </div>
  )
}
