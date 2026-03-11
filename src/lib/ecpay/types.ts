export interface ECPayParams {
  MerchantID: string
  MerchantTradeNo: string
  MerchantTradeDate: string
  PaymentType: string
  TotalAmount: number
  TradeDesc: string
  ItemName: string
  ReturnURL: string
  ClientBackURL: string
  ChoosePayment: string
  EncryptType: number
  CheckMacValue?: string
}
