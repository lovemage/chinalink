import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ProposalLoginForm } from '@/components/proposal/ProposalLoginForm'
import {
  isProposalAccessTokenValid,
  PROPOSAL_ACCESS_COOKIE,
  PROPOSAL_PATH,
} from '@/lib/proposal/access'

export default async function ProposalLoginPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get(PROPOSAL_ACCESS_COOKIE)?.value

  if (isProposalAccessTokenValid(token)) redirect(PROPOSAL_PATH)

  return (
    <main className="grid min-h-screen bg-[#f4ecdf] text-[#28231f] lg:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)]">
      <section className="flex items-end border-b border-[#cdbda9] bg-[#28231f] px-6 py-12 text-[#fffaf2] sm:px-12 sm:py-16 lg:min-h-screen lg:border-b-0 lg:border-r lg:px-16 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-bold tracking-[0.24em] text-[#dca77f]">CHINALINK · CONFIDENTIAL BRIEF</p>
          <h1 className="mt-6 font-serif text-[clamp(3rem,7vw,7.4rem)] font-bold leading-[0.92] tracking-[-0.045em]">
            網站重新定位
            <span className="mt-2 block text-[#dca77f]">建議書問卷</span>
          </h1>
          <p className="mt-8 max-w-xl text-base leading-8 text-[#dfd4c8] sm:text-lg">
            這份問卷整理了網站改版建議與需要確認的方向。完成後，系統會將勾選內容及加註整理成 JSON 寄出。
          </p>
        </div>
      </section>

      <section className="flex items-center px-6 py-14 sm:px-12 lg:px-14">
        <div className="w-full max-w-xl">
          <p className="text-xs font-bold tracking-[0.2em] text-[#9f5d35]">PRIVATE ACCESS</p>
          <h2 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">請先輸入密碼</h2>
          <p className="mt-4 max-w-md leading-7 text-[#6f6257]">
            本頁僅供業主與專案相關人員檢視。密碼驗證後可開始填寫，內容會自動暫存在這台裝置。
          </p>
          <ProposalLoginForm />
        </div>
      </section>
    </main>
  )
}
