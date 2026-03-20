import assert from 'node:assert/strict'
import test from 'node:test'
import fs from 'node:fs'
import path from 'node:path'

import {
  productCategories,
  productTags,
  productSeedSources,
  serviceCategories,
  serviceSeedSources,
} from './catalog'

const root = process.cwd()

test('catalog seed sources include service and product entries from the project domain', () => {
  assert.ok(serviceCategories.length >= 2)
  assert.ok(serviceSeedSources.length >= 2)
  assert.ok(productCategories.length >= 4)
  assert.ok(productTags.length >= 4)
  assert.ok(productSeedSources.length >= 4)

  const digitalPass = productSeedSources.find((entry) => entry.slug === 'mainland-digital-pass-app-registration-sms')
  assert.ok(digitalPass)
  assert.equal(digitalPass.tagSlugs.length >= 2, true)
  assert.equal(digitalPass.variants.length >= 2, true)
  assert.match(digitalPass.summary, /App|簡訊|驗證/)
})

test('payload config registers product catalog collections', () => {
  const configPath = path.resolve(root, 'src/payload.config.ts')
  const source = fs.readFileSync(configPath, 'utf8')

  assert.equal(source.includes("import { ProductCategories } from './collections/ProductCategories'"), true)
  assert.equal(source.includes("import { ProductTags } from './collections/ProductTags'"), true)
  assert.equal(source.includes("import { Products } from './collections/Products'"), true)
  assert.equal(source.includes('ProductCategories,'), true)
  assert.equal(source.includes('ProductTags,'), true)
  assert.equal(source.includes('Products,'), true)
})

test('orders and inquiries support product purchase flow without removing services', () => {
  const ordersSource = fs.readFileSync(path.resolve(root, 'src/collections/Orders.ts'), 'utf8')
  const inquiriesSource = fs.readFileSync(path.resolve(root, 'src/collections/Inquiries.ts'), 'utf8')

  assert.equal(ordersSource.includes("name: 'service'"), true)
  assert.equal(ordersSource.includes("name: 'product'"), true)
  assert.equal(ordersSource.includes("name: 'productVariantSKU'"), true)
  assert.equal(ordersSource.includes("name: 'productVariantName'"), true)
  assert.equal(ordersSource.includes("name: 'itemType'"), true)

  assert.equal(inquiriesSource.includes("name: 'service'"), true)
  assert.equal(inquiriesSource.includes("name: 'product'"), true)
  assert.equal(inquiriesSource.includes("name: 'itemType'"), true)
})

test('seed runner includes catalog target in default flow', () => {
  const runPath = path.resolve(root, 'src/seed/run.ts')
  const source = fs.readFileSync(runPath, 'utf8')

  assert.match(source, /target === 'catalog'/)
  assert.match(source, /seedCatalog\(\)/)
})

test('service entries are consultation-first and product entries retain explicit prices', () => {
  for (const service of serviceSeedSources) {
    assert.equal(service.pricingMode, 'custom')
  }

  for (const product of productSeedSources) {
    assert.ok(product.variants.length >= 1)
    for (const variant of product.variants) {
      assert.equal(typeof variant.price, 'number')
      assert.ok(variant.price > 0)
    }
  }
})

test('services collection exposes a fixed iconName select field for admin use', () => {
  const servicesSource = fs.readFileSync(path.resolve(root, 'src/collections/Services.ts'), 'utf8')

  assert.equal(servicesSource.includes("name: 'iconName'"), true)
  assert.equal(servicesSource.includes("type: 'select'"), true)
  assert.equal(servicesSource.includes('beforeInput'), true)
  assert.equal(
    servicesSource.includes("./components/payload/ServiceIconPreviewField.tsx#ServiceIconPreviewField"),
    true,
  )
})
