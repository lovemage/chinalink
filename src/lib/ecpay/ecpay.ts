import crypto from 'crypto'

/**
 * Generate CheckMacValue using SHA256 per ECPay specification.
 */
export function generateCheckMacValue(params: Record<string, string | number>): string {
  const hashKey = process.env.ECPAY_HASH_KEY!
  const hashIV = process.env.ECPAY_HASH_IV!

  // 1. Sort params alphabetically by key
  const sorted = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&')

  // 2. Add HashKey and HashIV
  const raw = `HashKey=${hashKey}&${sorted}&HashIV=${hashIV}`

  // 3. URL encode (lowercase)
  const encoded = encodeURIComponent(raw).toLowerCase()

  // 4. Replace special chars per ECPay spec
  const replaced = encoded
    .replace(/%2d/g, '-')
    .replace(/%5f/g, '_')
    .replace(/%2e/g, '.')
    .replace(/%21/g, '!')
    .replace(/%2a/g, '*')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')
    .replace(/%20/g, '+')

  // 5. SHA256 hash, uppercase
  return crypto.createHash('sha256').update(replaced).digest('hex').toUpperCase()
}

/**
 * Generate payment form HTML that auto-submits to ECPay.
 */
export function createPaymentFormHtml(params: Record<string, string | number>): string {
  const checkMac = generateCheckMacValue(params)
  const allParams = { ...params, CheckMacValue: checkMac }

  const inputs = Object.entries(allParams)
    .map(([k, v]) => `<input type="hidden" name="${k}" value="${v}" />`)
    .join('\n')

  return `
    <form id="ecpay-form" method="POST" action="${process.env.ECPAY_API_URL}">
      ${inputs}
    </form>
    <script>document.getElementById('ecpay-form').submit();</script>
  `
}

/**
 * Verify callback CheckMacValue from ECPay.
 */
export function verifyCheckMacValue(body: Record<string, string>): boolean {
  const receivedMac = body.CheckMacValue
  const params = { ...body }
  delete params.CheckMacValue
  const calculated = generateCheckMacValue(params)
  return calculated === receivedMac
}

/**
 * Format date for ECPay: yyyy/MM/dd HH:mm:ss
 */
export function formatECPayDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${y}/${m}/${d} ${h}:${min}:${s}`
}
