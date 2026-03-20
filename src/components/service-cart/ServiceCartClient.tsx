'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import type { Service, ServiceCategory, Product, ProductCategory, Media } from '@/payload-types'
import Image from 'next/image'
import { MaterialSymbol } from '@/components/ui/MaterialSymbol'
import { defaultServiceIconName } from '@/lib/services/serviceIcons'
import {
  ShoppingBag,
  ArrowRight,
  X,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  Package,
} from 'lucide-react'

/* ────────────────────────────── Types ────────────────────────────── */

interface CartItem {
  type: 'service' | 'product'
  service?: Service
  product?: Product
  variantSKU?: string
  variantName?: string
  quantity: number
}

interface ServiceCartClientProps {
  services: Service[]
  products: Product[]
  categories: ServiceCategory[]
  productCategories: ProductCategory[]
  initialAddServiceId?: number
  initialAddProductSlug?: string
  autoCheckout?: boolean
}

interface OrderResult {
  orderNumber: string
  totalAmount: number
  lineUrl: string
  lineId: string
}

/* ────────────────────────── localStorage ────────────────────────── */

const CART_STORAGE_KEY = 'chinalink-cart'

interface StoredCartItem {
  type: 'service' | 'product'
  serviceId?: number
  productSlug?: string
  variantSKU?: string
  variantName?: string
  quantity: number
}

function saveCartToStorage(cart: CartItem[]) {
  try {
    const items: StoredCartItem[] = cart.map((item) => ({
      type: item.type,
      serviceId: item.service?.id,
      productSlug: item.product?.slug,
      variantSKU: item.variantSKU,
      variantName: item.variantName,
      quantity: item.quantity,
    }))
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // localStorage unavailable or full — silently degrade
  }
}

function loadCartFromStorage(services: Service[], products: Product[]): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const items: StoredCartItem[] = JSON.parse(raw)
    return items
      .map((stored) => {
        if (stored.type === 'service' && stored.serviceId) {
          const service = services.find((s) => s.id === stored.serviceId)
          if (!service) return null
          return { type: 'service' as const, service, quantity: stored.quantity }
        }
        if (stored.type === 'product' && stored.productSlug) {
          const product = products.find((p) => p.slug === stored.productSlug)
          if (!product) return null
          return {
            type: 'product' as const,
            product,
            variantSKU: stored.variantSKU,
            variantName: stored.variantName,
            quantity: stored.quantity,
          }
        }
        return null
      })
      .filter(Boolean) as CartItem[]
  } catch {
    return []
  }
}

function clearCartStorage() {
  try {
    localStorage.removeItem(CART_STORAGE_KEY)
  } catch {
    // silently degrade
  }
}

/* ────────────────────────────── Helpers ────────────────────────────── */

function getServicePrice(service: Service): number | null {
  switch (service.pricingMode) {
    case 'fixed':
      return service.price ?? null
    case 'addons':
      return service.basePrice ?? null
    default:
      return null
  }
}

function getProductVariantPrice(product: Product, variantSKU?: string): number | null {
  const variants = (product.variants || []).filter((v) => v.isActive !== false)
  if (variantSKU) {
    const variant = variants.find((v) => v.sku === variantSKU)
    return variant?.price ?? null
  }
  const defaultVariant = variants.find((v) => v.isDefault) || variants[0]
  return defaultVariant?.price ?? null
}

function formatPrice(price: number): string {
  return `NT$ ${price.toLocaleString()}`
}

function getServiceCover(service: Service): Media | null {
  return typeof service.coverImage === 'object' && service.coverImage
    ? (service.coverImage as Media)
    : null
}

function getServiceCategory(service: Service): ServiceCategory | null {
  return typeof service.serviceCategory === 'object' && service.serviceCategory
    ? (service.serviceCategory as ServiceCategory)
    : null
}

function getProductCover(product: Product): Media | null {
  return typeof product.coverImage === 'object' && product.coverImage
    ? (product.coverImage as Media)
    : null
}

function getCartItemKey(item: CartItem): string {
  if (item.type === 'service' && item.service) return `service-${item.service.id}`
  if (item.type === 'product' && item.product && item.variantSKU)
    return `product-${item.product.id}-${item.variantSKU}`
  return `unknown-${Math.random()}`
}

function getCartItemPrice(item: CartItem): number | null {
  if (item.type === 'service' && item.service) return getServicePrice(item.service)
  if (item.type === 'product' && item.product) return getProductVariantPrice(item.product, item.variantSKU)
  return null
}

function getCartItemTitle(item: CartItem): string {
  if (item.type === 'service' && item.service) return item.service.title
  if (item.type === 'product' && item.product) {
    return item.variantName
      ? `${item.product.title} - ${item.variantName}`
      : item.product.title
  }
  return ''
}

/* ────────────────────────────── Main Component ────────────────────────────── */

export function ServiceCartClient({
  services,
  products,
  categories,
  productCategories,
  initialAddServiceId,
  initialAddProductSlug,
  autoCheckout,
}: ServiceCartClientProps) {
  const { data: session } = useSession()
  const [cart, setCart] = useState<CartItem[]>(() => loadCartFromStorage(services, products))
  const [activeTab, setActiveTab] = useState<'services' | 'products'>('services')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [fabVisible, setFabVisible] = useState(false)
  const [fabAnimating, setFabAnimating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const prevCartLength = useRef(0)

  // Sync cart to localStorage
  useEffect(() => {
    saveCartToStorage(cart)
  }, [cart])

  // Auto-switch to products tab if initialAddProductSlug is set
  useEffect(() => {
    if (initialAddProductSlug) setActiveTab('products')
  }, [initialAddProductSlug])

  // Reset category filter when switching tabs
  useEffect(() => {
    setActiveCategory(null)
  }, [activeTab])

  // Filter services by category
  const filteredServices = useMemo(() => {
    if (!activeCategory) return services
    return services.filter((s) => {
      const cat = getServiceCategory(s)
      return cat?.slug === activeCategory
    })
  }, [services, activeCategory])

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (!activeCategory) return products
    return products.filter((p) => {
      const cat =
        typeof p.productCategory === 'object' && p.productCategory
          ? (p.productCategory as ProductCategory)
          : null
      return cat?.slug === activeCategory
    })
  }, [products, activeCategory])

  // Cart calculations
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => {
    const price = getCartItemPrice(item)
    return sum + (price ?? 0) * item.quantity
  }, 0)

  // FAB visibility logic
  useEffect(() => {
    const hadItems = prevCartLength.current > 0
    const hasItems = cart.length > 0

    if (!hadItems && hasItems) {
      setFabVisible(true)
      requestAnimationFrame(() => setFabAnimating(true))
    } else if (hadItems && !hasItems) {
      setFabAnimating(false)
      const timer = setTimeout(() => setFabVisible(false), 300)
      prevCartLength.current = cart.length
      return () => clearTimeout(timer)
    }

    prevCartLength.current = cart.length
  }, [cart.length])

  // Cart actions — services
  const addServiceToCart = useCallback((service: Service) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.type === 'service' && item.service?.id === service.id)
      if (existing) {
        return prev.map((item) =>
          item.type === 'service' && item.service?.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }
      return [...prev, { type: 'service' as const, service, quantity: 1 }]
    })
  }, [])

  // Cart actions — products
  const addProductToCart = useCallback((product: Product, variantSKU: string, variantName: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.type === 'product' && item.product?.id === product.id && item.variantSKU === variantSKU,
      )
      if (existing) {
        return prev.map((item) =>
          item.type === 'product' && item.product?.id === product.id && item.variantSKU === variantSKU
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }
      return [...prev, { type: 'product' as const, product, variantSKU, variantName, quantity: 1 }]
    })
  }, [])

  const updateQuantity = useCallback((key: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (getCartItemKey(item) !== key) return item
          const newQty = item.quantity + delta
          return newQty <= 0 ? null : { ...item, quantity: newQty }
        })
        .filter(Boolean) as CartItem[]
    })
  }, [])

  const removeFromCart = useCallback((key: string) => {
    setCart((prev) => prev.filter((item) => getCartItemKey(item) !== key))
  }, [])

  const isServiceInCart = useCallback(
    (serviceId: number) => cart.some((item) => item.type === 'service' && item.service?.id === serviceId),
    [cart],
  )

  const getServiceCartQuantity = useCallback(
    (serviceId: number) =>
      cart.find((item) => item.type === 'service' && item.service?.id === serviceId)?.quantity ?? 0,
    [cart],
  )

  const isProductVariantInCart = useCallback(
    (productId: number, variantSKU: string) =>
      cart.some(
        (item) => item.type === 'product' && item.product?.id === productId && item.variantSKU === variantSKU,
      ),
    [cart],
  )

  const getProductVariantCartQuantity = useCallback(
    (productId: number, variantSKU: string) =>
      cart.find(
        (item) => item.type === 'product' && item.product?.id === productId && item.variantSKU === variantSKU,
      )?.quantity ?? 0,
    [cart],
  )

  // Auto-add service from URL query param
  const hasAutoAdded = useRef(false)
  useEffect(() => {
    if (hasAutoAdded.current) return
    if (initialAddServiceId) {
      hasAutoAdded.current = true
      const service = services.find((s) => s.id === initialAddServiceId)
      if (service && service.pricingMode !== 'custom') {
        addServiceToCart(service)
      }
    }
    if (initialAddProductSlug) {
      hasAutoAdded.current = true
      const product = products.find((p) => p.slug === initialAddProductSlug)
      if (product) {
        const variants = (product.variants || []).filter((v) => v.isActive !== false)
        const defaultVariant = variants.find((v) => v.isDefault) || variants[0]
        if (defaultVariant) {
          addProductToCart(product, defaultVariant.sku, defaultVariant.name)
        }
      }
    }
  }, [initialAddServiceId, initialAddProductSlug, services, products, addServiceToCart, addProductToCart])

  // Auto-open panel when returning from login with checkout=1
  const hasAutoCheckedOut = useRef(false)
  useEffect(() => {
    if (hasAutoCheckedOut.current || !autoCheckout || cart.length === 0) return
    hasAutoCheckedOut.current = true
    setIsPanelOpen(true)
  }, [autoCheckout, cart.length])

  // Panel open/close
  const openPanel = () => {
    setIsPanelOpen(true)
    setFabAnimating(false)
  }

  const closePanel = () => {
    setIsPanelOpen(false)
    if (cart.length > 0) {
      requestAnimationFrame(() => setFabAnimating(true))
    }
  }

  // When cart empties while panel is open, close panel
  useEffect(() => {
    if (isPanelOpen && cart.length === 0) {
      setIsPanelOpen(false)
      setFabAnimating(false)
      const timer = setTimeout(() => setFabVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [cart.length, isPanelOpen])

  // Submit order
  const handleSubmitOrder = async () => {
    const customerId = (session?.user as { customerId?: number } | undefined)?.customerId
    if (!customerId) {
      const url = new URL(window.location.href)
      url.searchParams.set('checkout', '1')
      window.location.href = `/login?callbackUrl=${encodeURIComponent(url.pathname + url.search)}`
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch('/api/service-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          items: cart.map((item) => {
            if (item.type === 'product' && item.product) {
              return {
                type: 'product',
                productId: item.product.id,
                variantSKU: item.variantSKU,
                quantity: item.quantity,
              }
            }
            return {
              type: 'service',
              serviceId: item.service?.id,
              quantity: item.quantity,
            }
          }),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setSubmitError(data.error || '訂單建立失敗')
        return
      }

      setOrderResult({
        orderNumber: data.orderNumber,
        totalAmount: data.totalAmount,
        lineUrl: data.lineUrl,
        lineId: data.lineId,
      })

      // Clear cart, storage, and close panel
      setCart([])
      clearCartStorage()
      setIsPanelOpen(false)
    } catch {
      setSubmitError('網路錯誤，請稍後再試')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Close success dialog
  const closeSuccessDialog = () => {
    setOrderResult(null)
  }

  const currentCategories = activeTab === 'services' ? categories : productCategories

  return (
    <section className="relative min-h-screen overflow-hidden bg-brand-bg pt-32 pb-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -top-20 right-0 h-[600px] w-[600px] rounded-[60%_40%_30%_70%_/_60%_30%_70%_40%] bg-brand-primary/5 blur-3xl opacity-60" />
      <div className="pointer-events-none absolute bottom-0 -left-40 h-[400px] w-[400px] rounded-full bg-brand-cta/3 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-brand-primary uppercase">
            <span className="h-px w-8 bg-brand-primary" />
            Shopping Cart
          </div>
          <h1 className="font-serif text-5xl font-medium tracking-tight text-brand-text sm:text-6xl">
            選購專區 <span className="font-playfair italic text-brand-primary">Select</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-brand-muted">
            挑選您需要的服務與商品，加入購物車後一次完成預約。
          </p>
        </div>

        {/* Tab Switch: Services / Products */}
        <div className="mt-10 flex gap-2">
          <button
            onClick={() => setActiveTab('services')}
            className={`rounded-full border px-6 py-2.5 text-sm font-semibold transition-all duration-200 ${
              activeTab === 'services'
                ? 'border-brand-text bg-brand-text text-white shadow-lg'
                : 'border-brand-primary/15 bg-white/80 text-brand-text hover:border-brand-text/40 hover:bg-white'
            }`}
          >
            服務項目
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`rounded-full border px-6 py-2.5 text-sm font-semibold transition-all duration-200 ${
              activeTab === 'products'
                ? 'border-brand-text bg-brand-text text-white shadow-lg'
                : 'border-brand-primary/15 bg-white/80 text-brand-text hover:border-brand-text/40 hover:bg-white'
            }`}
          >
            商品專區
          </button>
        </div>

        {/* Category Tabs */}
        {currentCategories.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveCategory(null)}
              className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                !activeCategory
                  ? 'border-brand-cta bg-brand-cta text-white shadow-lg shadow-brand-cta/20'
                  : 'border-brand-primary/15 bg-white/80 text-brand-text hover:border-brand-cta/40 hover:bg-white'
              }`}
            >
              全部
            </button>
            {currentCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat.slug
                    ? 'border-brand-cta bg-brand-cta text-white shadow-lg shadow-brand-cta/20'
                    : 'border-brand-primary/15 bg-white/80 text-brand-text hover:border-brand-cta/40 hover:bg-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Services Grid */}
        {activeTab === 'services' && (
          <>
            {filteredServices.length > 0 ? (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredServices.map((service) => (
                  <ServiceItemCard
                    key={service.id}
                    service={service}
                    inCart={isServiceInCart(service.id)}
                    quantity={getServiceCartQuantity(service.id)}
                    onAdd={() => addServiceToCart(service)}
                    onUpdateQuantity={(delta) =>
                      updateQuantity(`service-${service.id}`, delta)
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="mt-24 text-center">
                <p className="font-serif text-xl text-brand-muted">目前沒有符合條件的服務</p>
              </div>
            )}
          </>
        )}

        {/* Products Grid */}
        {activeTab === 'products' && (
          <>
            {filteredProducts.length > 0 ? (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductItemCard
                    key={product.id}
                    product={product}
                    isVariantInCart={isProductVariantInCart}
                    getVariantCartQuantity={getProductVariantCartQuantity}
                    onAddVariant={(sku, name) => addProductToCart(product, sku, name)}
                    onUpdateVariantQuantity={(sku, delta) =>
                      updateQuantity(`product-${product.id}-${sku}`, delta)
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="mt-24 text-center">
                <p className="font-serif text-xl text-brand-muted">目前沒有符合條件的商品</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Cart Button — Desktop */}
      {fabVisible && !isPanelOpen && (
        <button
          onClick={openPanel}
          className={`fixed bottom-8 right-8 z-40 hidden items-center gap-3 rounded-2xl bg-brand-cta px-6 py-4 text-white shadow-2xl shadow-brand-cta/30 transition-all duration-300 md:inline-flex ${
            fabAnimating
              ? 'translate-y-0 scale-100 opacity-100'
              : 'translate-y-4 scale-95 opacity-0'
          }`}
        >
          <ShoppingBag className="h-[22px] w-[22px]" />
          <span className="text-sm font-semibold">{totalItems} 件</span>
          <span className="h-4 w-px bg-white/30" />
          <span className="text-sm font-semibold">{formatPrice(totalPrice)}</span>
        </button>
      )}

      {/* Floating Cart Button — Mobile */}
      {fabVisible && !isPanelOpen && (
        <button
          onClick={openPanel}
          className={`fixed inset-x-0 bottom-0 z-40 flex items-center justify-between bg-brand-cta px-6 py-4 text-white shadow-[0_-4px_24px_rgba(0,0,0,0.1)] transition-all duration-300 md:hidden ${
            fabAnimating
              ? 'translate-y-0 opacity-100'
              : 'translate-y-full opacity-0'
          }`}
        >
          <span className="flex items-center gap-2">
            <ShoppingBag className="h-[22px] w-[22px]" />
            <span className="font-semibold">{totalItems} 件</span>
          </span>
          <span className="font-semibold">{formatPrice(totalPrice)}</span>
          <span className="flex items-center gap-1 text-sm font-medium">
            查看
            <ArrowRight className="h-[18px] w-[18px]" />
          </span>
        </button>
      )}

      {/* Cart Panel Overlay */}
      {isPanelOpen && (
        <div
          className="fixed inset-0 z-50 bg-brand-text/10 backdrop-blur-[2px] transition-opacity duration-200"
          onClick={closePanel}
        />
      )}

      {/* Cart Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-out md:w-[420px] ${
          isPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between border-b border-brand-primary/10 px-6 py-5">
          <div>
            <h2 className="font-serif text-xl font-medium text-brand-text">購物車</h2>
            <p className="mt-0.5 text-sm text-brand-muted">{totalItems} 個項目</p>
          </div>
          <button
            onClick={closePanel}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-brand-muted transition-colors hover:bg-brand-primary/5 hover:text-brand-text"
          >
            <X className="h-[22px] w-[22px]" />
          </button>
        </div>

        {/* Panel Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="mb-4 h-[48px] w-[48px] text-brand-primary/20" />
              <p className="text-sm text-brand-muted">尚未選擇任何項目</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.map((item) => {
                const key = getCartItemKey(item)
                const price = getCartItemPrice(item)
                const title = getCartItemTitle(item)
                return (
                  <li
                    key={key}
                    className="flex items-start gap-4 rounded-2xl border border-brand-primary/8 bg-brand-bg/50 p-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {item.type === 'product' && (
                          <Package className="h-3.5 w-3.5 shrink-0 text-brand-primary/60" />
                        )}
                        <p className="font-medium text-brand-text truncate">{title}</p>
                      </div>
                      <p className="mt-1 text-sm font-medium text-brand-primary">
                        {price !== null ? formatPrice(price) : '諮詢報價'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => updateQuantity(key, -1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-primary/15 text-brand-muted transition-colors hover:border-brand-primary/30 hover:text-brand-text"
                      >
                        <Minus className="h-[18px] w-[18px]" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-brand-text">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(key, 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-primary/15 text-brand-muted transition-colors hover:border-brand-primary/30 hover:text-brand-text"
                      >
                        <Plus className="h-[18px] w-[18px]" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(key)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-brand-muted/60 transition-colors hover:bg-brand-cta/10 hover:text-brand-cta"
                    >
                      <Trash2 className="h-[18px] w-[18px]" />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Panel Footer */}
        {cart.length > 0 && (
          <div className="border-t border-brand-primary/10 px-6 py-5">
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-sm text-brand-muted">合計</span>
              <span className="font-serif text-2xl font-semibold text-brand-text">
                {formatPrice(totalPrice)}
              </span>
            </div>
            {submitError && (
              <p className="mb-3 text-sm text-brand-cta">{submitError}</p>
            )}
            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-brand-cta py-4 text-center font-semibold text-white shadow-lg shadow-brand-cta/20 transition-all duration-200 hover:bg-brand-cta/90 hover:shadow-xl hover:shadow-brand-cta/25 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
            >
              {isSubmitting ? '處理中...' : '確認預約'}
            </button>
          </div>
        )}
      </div>

      {/* Success Dialog — Order Placed */}
      {orderResult && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-brand-text/20 backdrop-blur-sm"
            onClick={closeSuccessDialog}
          />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
              {/* Success icon */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle className="h-[32px] w-[32px] text-emerald-500" />
              </div>

              <h3 className="mt-5 text-center font-serif text-2xl font-medium text-brand-text">
                訂單已建立
              </h3>
              <p className="mt-2 text-center text-sm text-brand-muted">
                請透過官方 LINE 聯繫客服，並提供訂單編號以完成後續服務。
              </p>

              {/* Order number */}
              <div className="mt-6 rounded-2xl border border-brand-primary/10 bg-brand-bg p-5">
                <p className="text-xs tracking-wider text-brand-muted uppercase">訂單編號</p>
                <p className="mt-1 font-mono text-xl font-semibold tracking-widest text-brand-text">
                  {orderResult.orderNumber}
                </p>
                <div className="mt-3 flex items-baseline justify-between border-t border-brand-primary/8 pt-3">
                  <span className="text-sm text-brand-muted">訂單金額</span>
                  <span className="font-serif text-lg font-semibold text-brand-primary">
                    {formatPrice(orderResult.totalAmount)}
                  </span>
                </div>
              </div>

              {/* LINE CTA */}
              {orderResult.lineUrl && (
                <a
                  href={orderResult.lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#06C755] py-4 font-semibold text-white shadow-lg shadow-[#06C755]/20 transition-all duration-200 hover:bg-[#05b04d] active:scale-[0.98]"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                  </svg>
                  加入官方 LINE 聯繫客服
                  {orderResult.lineId && (
                    <span className="text-sm font-normal opacity-80">{orderResult.lineId}</span>
                  )}
                </a>
              )}

              <p className="mt-4 text-center text-xs leading-relaxed text-brand-muted">
                請將訂單編號 <span className="font-semibold text-brand-text">{orderResult.orderNumber}</span> 傳送給客服，
                我們將盡速為您處理。
              </p>

              <button
                onClick={closeSuccessDialog}
                className="mt-5 w-full rounded-2xl border border-brand-primary/15 py-3 text-sm font-medium text-brand-text transition-colors hover:bg-brand-bg"
              >
                關閉
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

/* ────────────────────────────── Service Item Card ────────────────────────────── */

interface ServiceItemCardProps {
  service: Service
  inCart: boolean
  quantity: number
  onAdd: () => void
  onUpdateQuantity: (delta: number) => void
}

function ServiceItemCard({ service, inCart, quantity, onAdd, onUpdateQuantity }: ServiceItemCardProps) {
  const cover = getServiceCover(service)
  const category = getServiceCategory(service)
  const price = getServicePrice(service)
  const isCustomPrice = service.pricingMode === 'custom'

  return (
    <div className="group flex flex-col overflow-hidden rounded-[2rem] border border-brand-primary/8 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-brand-primary/8">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-bg m-2 rounded-[1.5rem]">
        {cover?.url ? (
          <Image
            src={cover.sizes?.card?.url || cover.url}
            alt={cover.alt || service.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/80 text-brand-primary/40 shadow-sm ring-1 ring-brand-primary/8">
              <MaterialSymbol
                name={service.iconName || defaultServiceIconName}
                className="text-[40px]"
              />
            </div>
          </div>
        )}
        {category && (
          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-brand-text backdrop-blur-sm">
            {category.name}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-6 pt-4 pb-6">
        <h3 className="font-serif text-xl font-medium text-brand-text line-clamp-2">
          {service.title}
        </h3>

        <div className="mt-auto flex items-end justify-between gap-4 pt-5">
          <div>
            <p className="text-xs tracking-wider text-brand-muted uppercase">
              {service.pricingMode === 'addons' ? '基本價格' : '價格'}
            </p>
            <p className="mt-1 font-serif text-xl font-semibold text-brand-primary">
              {isCustomPrice ? '諮詢報價' : price !== null ? formatPrice(price) : '免費'}
            </p>
          </div>

          {/* Add / Quantity Control */}
          {!isCustomPrice && (
            <div className="shrink-0">
              {inCart ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdateQuantity(-1)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand-primary/15 text-brand-muted transition-colors hover:border-brand-primary/30 hover:text-brand-text"
                  >
                    <Minus className="h-[18px] w-[18px]" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-brand-text">
                    {quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(1)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand-primary/15 text-brand-muted transition-colors hover:border-brand-primary/30 hover:text-brand-text"
                  >
                    <Plus className="h-[18px] w-[18px]" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onAdd}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand-primary/10 px-4 py-2.5 text-sm font-medium text-brand-primary transition-all duration-200 hover:bg-brand-primary hover:text-white active:scale-95"
                >
                  <Plus className="h-[18px] w-[18px]" />
                  加入
                </button>
              )}
            </div>
          )}
        </div>

        {/* In-cart indicator */}
        {inCart && (
          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
            <CheckCircle className="h-[16px] w-[16px]" />
            已加入
          </div>
        )}
      </div>
    </div>
  )
}

/* ────────────────────────────── Product Item Card ────────────────────────────── */

interface ProductItemCardProps {
  product: Product
  isVariantInCart: (productId: number, variantSKU: string) => boolean
  getVariantCartQuantity: (productId: number, variantSKU: string) => number
  onAddVariant: (variantSKU: string, variantName: string) => void
  onUpdateVariantQuantity: (variantSKU: string, delta: number) => void
}

function ProductItemCard({
  product,
  isVariantInCart,
  getVariantCartQuantity,
  onAddVariant,
  onUpdateVariantQuantity,
}: ProductItemCardProps) {
  const cover = getProductCover(product)
  const variants = (product.variants || []).filter((v) => v.isActive !== false)
  const category =
    typeof product.productCategory === 'object' && product.productCategory
      ? (product.productCategory as ProductCategory)
      : null

  return (
    <div className="group flex flex-col overflow-hidden rounded-[2rem] border border-brand-primary/8 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-brand-primary/8">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-bg m-2 rounded-[1.5rem]">
        {cover?.url ? (
          <Image
            src={cover.sizes?.card?.url || cover.url}
            alt={cover.alt || product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/80 text-brand-primary/40 shadow-sm ring-1 ring-brand-primary/8">
              <Package className="h-10 w-10" />
            </div>
          </div>
        )}
        {category && (
          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-brand-text backdrop-blur-sm">
            {category.name}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-6 pt-4 pb-6">
        <h3 className="font-serif text-xl font-medium text-brand-text line-clamp-2">
          {product.title}
        </h3>
        {product.summary && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-brand-muted">
            {product.summary}
          </p>
        )}

        {/* Variants */}
        <div className="mt-auto space-y-3 pt-5">
          {variants.map((variant) => {
            const inCart = isVariantInCart(product.id, variant.sku)
            const qty = getVariantCartQuantity(product.id, variant.sku)

            return (
              <div
                key={variant.sku}
                className="flex items-center justify-between gap-3 rounded-xl border border-brand-primary/8 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-brand-text truncate">{variant.name}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-sm font-semibold text-brand-primary">
                      {formatPrice(variant.price)}
                    </p>
                    {variant.compareAtPrice && (
                      <p className="text-xs text-brand-muted line-through">
                        {formatPrice(variant.compareAtPrice)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="shrink-0">
                  {inCart ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onUpdateVariantQuantity(variant.sku, -1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-primary/15 text-brand-muted transition-colors hover:border-brand-primary/30 hover:text-brand-text"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-7 text-center text-sm font-semibold text-brand-text">
                        {qty}
                      </span>
                      <button
                        onClick={() => onUpdateVariantQuantity(variant.sku, 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-primary/15 text-brand-muted transition-colors hover:border-brand-primary/30 hover:text-brand-text"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onAddVariant(variant.sku, variant.name)}
                      className="inline-flex items-center gap-1 rounded-lg bg-brand-primary/10 px-3 py-2 text-xs font-medium text-brand-primary transition-all duration-200 hover:bg-brand-primary hover:text-white active:scale-95"
                    >
                      <Plus className="h-4 w-4" />
                      加入
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* In-cart indicator */}
        {variants.some((v) => isVariantInCart(product.id, v.sku)) && (
          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
            <CheckCircle className="h-[16px] w-[16px]" />
            已加入購物車
          </div>
        )}
      </div>
    </div>
  )
}
