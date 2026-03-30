import { type NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getAdminFromCookies } from '@/lib/auth-admin'

export async function POST(req: NextRequest) {
  // Admin auth check
  const admin = await getAdminFromCookies()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Validate env vars
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  const folder = process.env.CLOUDINARY_FOLDER || 'chinalink'

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: 'Cloudinary credentials not configured' },
      { status: 500 }
    )
  }

  // Parse multipart form data
  let file: File | null = null
  try {
    const formData = await req.formData()
    const raw = formData.get('file')
    if (!raw || typeof raw === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    file = raw as File
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
  }

  // Build signed upload parameters
  const timestamp = Math.floor(Date.now() / 1000)
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`
  const signature = crypto
    .createHash('sha1')
    .update(paramsToSign + apiSecret)
    .digest('hex')

  // Build FormData for Cloudinary REST API
  const uploadForm = new FormData()
  uploadForm.append('file', file)
  uploadForm.append('folder', folder)
  uploadForm.append('timestamp', String(timestamp))
  uploadForm.append('api_key', apiKey)
  uploadForm.append('signature', signature)

  // Upload to Cloudinary
  let res: Response
  try {
    res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: uploadForm }
    )
  } catch (err) {
    console.error('[upload] Cloudinary fetch error:', err)
    return NextResponse.json({ error: 'Failed to reach Cloudinary' }, { status: 502 })
  }

  if (!res.ok) {
    const errorBody = await res.text()
    console.error('[upload] Cloudinary error response:', errorBody)
    return NextResponse.json({ error: 'Upload failed' }, { status: 502 })
  }

  const data = await res.json() as {
    secure_url: string
    public_id: string
    width: number
    height: number
  }

  return NextResponse.json({
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
  })
}
