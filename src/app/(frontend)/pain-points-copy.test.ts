import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const painPoints = readFileSync(new URL('../../components/home/PainPoints.tsx', import.meta.url), 'utf8')
const footer = readFileSync(new URL('../../components/layout/Footer.tsx', import.meta.url), 'utf8')

test('pain points section uses richer conversational copy', () => {
  assert.match(painPoints, /你是不是也常常卡在這些/)
  assert.match(painPoints, /明明想開始做，卻常常卡在帳號、付款、開店和平台規則/)
  assert.match(painPoints, /不是你不會，是一開始就少了能用的大陸門號/)
  assert.match(painPoints, /不是商品不能買，是付款這一步就先卡住/)
})

test('footer contact info is text-only without line or wechat icons', () => {
  assert.doesNotMatch(footer, /icons\/consulting\.png/)
  assert.doesNotMatch(footer, /icons\/account\.png/)
})
