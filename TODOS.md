# TODOS

## 待辦

### ~~購物車 localStorage 持久化~~ ✅ Done (2026-03-20)
- **What:** 購物車狀態存入 localStorage，頁面重載/導轉後自動恢復
- **Why:** 目前用 React useState，登入重導後多商品購物車會丟失（只保留 URL param 中的最後一個商品）
- **Pros:** 完整保留多商品購物車、用戶體驗大幅提升
- **Cons:** 需處理 localStorage 禁用/已滿的 edge case（降級為原本行為即可）
- **Context:** ServiceCartClient.tsx 的 `cart` state 加入 useEffect 讀寫 localStorage，約 20 行。訂單成功後清除 localStorage。初始化時 localStorage 優先於 URL query param。
- **Depends on:** 無
- **Priority:** High — 直接影響購物車結帳流程
- **Source:** /plan-eng-review 2026-03-20

### 建立 E2E 測試框架（Playwright）
- **What:** 用 Playwright 建立前端 E2E 測試，覆蓋購物車關鍵流程
- **Why:** 專案目前沒有任何前端測試框架，購物車的登入重導、持久化、自動開啟面板等關鍵路徑無測試覆蓋
- **Pros:** 防止回歸 bug、CI 自動化驗證、信心提升
- **Cons:** 初始設定需要約 30 分鐘，需要測試用的 seed data
- **Context:** 測試場景：加入商品 → 未登入結帳 → 登入 → 自動回到購物車 → 面板已開啟 → 提交訂單。需要 Playwright config、test helpers、可能需要 test fixtures 或 seed script。
- **Depends on:** localStorage 持久化（先完成才能測試完整流程）
- **Priority:** Medium — 建議在 localStorage 持久化完成後立即進行
- **Source:** /plan-eng-review 2026-03-20
