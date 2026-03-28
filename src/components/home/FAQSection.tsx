'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: '懂陸姐是什麼？你們主要幫什麼忙？',
    a: '懂陸姐（ChinaLink）是專門協助台灣人在大陸生活與經商的顧問品牌。不管你是想開通大陸的手機號碼、銀行帳戶，還是需要註冊公司、經營小紅書，我們都能一站式幫你搞定，省去自己摸索的時間和踩坑風險。',
  },
  {
    q: '我完全沒有大陸經驗，也可以找你們嗎？',
    a: '當然可以，其實大部分來找我們的客戶都是第一次接觸大陸市場。我們會先了解你的狀況和需求，再用你聽得懂的方式，一步步帶你走完整個流程。不用擔心什麼都不懂，這正是我們最擅長的事。',
  },
  {
    q: '你們的服務跟商品有什麼不同？我該怎麼選？',
    a: '「商品」是已經幫你打包好的標準方案，像是門號代辦、帳號開通這類常見需求，價格透明、直接下單就行。「服務」則是比較客製化的項目，例如公司註冊顧問、小紅書代營運，會依據你的情況量身規劃。如果不確定，先透過 LINE 聊聊，我們會幫你推薦最適合的方案。',
  },
  {
    q: '費用大概是多少？有沒有公開價格？',
    a: '有的！大部分商品和基礎服務都有明確標價，你可以直接在網站上看到。部分客製化服務會依需求報價，我們會在確認需求後提供完整的費用說明，不會有隱藏收費的情況。',
  },
  {
    q: '人在台灣也能辦理大陸的帳號或門號嗎？',
    a: '可以的，這也是很多客戶選擇我們的原因。許多大陸平台的帳號開通和門號申辦，我們都能遠端協助完成，不需要你親自飛一趟。少數需要實名認證的項目，我們也會清楚說明流程和所需資料。',
  },
  {
    q: '下單之後多久可以完成？流程是什麼？',
    a: '標準商品通常 1–3 個工作天就能完成。流程很簡單：選好商品或服務後，透過 LINE 確認細節，我們會告訴你需要準備什麼資料，收到後就會開始處理，完成後會一併交付成果和使用說明。',
  },
  {
    q: '如果辦好之後遇到問題，還可以找你們嗎？',
    a: '當然可以！我們不是辦完就消失的那種。交付之後如果有操作問題、需要調整設定，都可以隨時透過 LINE 或微信聯繫我們。我們希望的是長期陪伴，不只是一次性服務。',
  },
  {
    q: '我想經營小紅書，但不知道從哪裡開始，你們能幫忙嗎？',
    a: '這塊我們很有經驗。從帳號類型選擇、專業號升級、內容策略規劃到投流操作，都有完整的顧問和代營運服務。不管你是個人品牌還是企業帳號，我們會根據你的目標幫你找到最有效的起步方式。',
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="bg-brand-bg py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-2 text-sm font-bold tracking-widest text-brand-primary uppercase">
            <span className="h-px w-8 bg-brand-primary"></span>
            FAQ
            <span className="h-px w-8 bg-brand-primary"></span>
          </div>
          <h2 className="text-3xl font-extrabold text-brand-text sm:text-4xl md:text-5xl">
            常見問題
          </h2>
          <p className="mt-4 text-lg text-brand-muted">
            第一次接觸大陸市場？這些是大家最常問的問題
          </p>
        </div>

        <div className="mx-auto max-w-3xl divide-y divide-border/60">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div key={index}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left transition-colors hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                >
                  <span className="text-base font-semibold text-brand-text sm:text-lg">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-brand-muted transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-brand-primary' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 text-base leading-relaxed text-brand-muted">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
