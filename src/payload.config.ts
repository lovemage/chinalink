import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudinaryPlugin } from '@jhb.software/payload-cloudinary-plugin'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Posts } from './collections/Posts'
import { ServiceCategories } from './collections/ServiceCategories'
import { Services } from './collections/Services'
import { ProductCategories } from './collections/ProductCategories'
import { ProductTags } from './collections/ProductTags'
import { Products } from './collections/Products'
import { Customers } from './collections/Customers'
import { Orders } from './collections/Orders'
import { Inquiries } from './collections/Inquiries'
import { EmailTemplates } from './collections/EmailTemplates'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const isDevelopment = process.env.NODE_ENV === 'development'
const disableDatabasePush = process.env.PAYLOAD_DISABLE_DB_PUSH === 'true' && !isDevelopment
const payloadSecret = process.env.PAYLOAD_SECRET || process.env.PAYLOADCMS_SECRET || process.env.AUTH_SECRET || ''
const databaseUri = process.env.DATABASE_URI || process.env.DATABASE_URL || ''
const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME || ''
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY || ''
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET || ''
const cloudinaryFolder = (process.env.CLOUDINARY_FOLDER || 'chinalink').replace(/^\/+|\/+$/g, '')
const cloudinaryEnabled =
  process.env.CLOUDINARY_ENABLED === 'true' &&
  Boolean(cloudinaryCloudName && cloudinaryApiKey && cloudinaryApiSecret)

const imageExtensions = new Set(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'tif', 'webp', 'avif', 'heic', 'heif'])
const videoExtensions = new Set(['mp4', 'mov', 'webm', 'm4v', 'avi', 'mkv'])

function cloneMediaCollection() {
  const uploadConfig =
    Media.upload && typeof Media.upload === 'object'
      ? {
          ...Media.upload,
          imageSizes: Media.upload.imageSizes ? [...Media.upload.imageSizes] : Media.upload.imageSizes,
          mimeTypes: Media.upload.mimeTypes ? [...Media.upload.mimeTypes] : Media.upload.mimeTypes,
        }
      : Media.upload

  return {
    ...Media,
    upload: uploadConfig,
    fields: Media.fields ? [...Media.fields] : Media.fields,
  }
}

function createCloudinaryURL(args: {
  cloudName: string
  folder: string
  filename: string
  prefix?: string
  width?: number
  height?: number
}) {
  const ext = args.filename.split('.').pop()?.toLowerCase() || ''
  const resourceType = videoExtensions.has(ext) ? 'video' : imageExtensions.has(ext) ? 'image' : 'raw'

  const transformations: string[] = []

  if (resourceType === 'image') {
    // Force Cloudinary image delivery as WebP while keeping quality optimization.
    transformations.push('f_webp', 'q_auto')
  } else if (resourceType === 'video') {
    transformations.push('q_auto')
  }

  if (args.width || args.height) {
    const width = args.width ? `w_${args.width}` : ''
    const height = args.height ? `h_${args.height}` : ''
    transformations.push(['c_limit', width, height].filter(Boolean).join(','))
  }

  const publicId = [args.folder, args.prefix, args.filename].filter(Boolean).join('/')
  const transformSegment = transformations.length > 0 ? `${transformations.join(',')}/` : ''

  return `https://res.cloudinary.com/${args.cloudName}/${resourceType}/upload/${transformSegment}${publicId}`
}

function normalizeDevAdminEmail(value: string) {
  const normalized = value.trim().toLowerCase()

  if (normalized.includes('@')) {
    return normalized
  }

  return `${normalized}@local.dev`
}

async function ensureDevAdmin(payload: any) {
  if (!isDevelopment) return

  const devAdminEmail = normalizeDevAdminEmail(process.env.DEV_ADMIN_EMAIL || 'admin@local.dev')
  const devAdminPassword = process.env.DEV_ADMIN_PASSWORD || 'admin123'

  try {
    const existing = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: devAdminEmail,
        },
      },
      limit: 1,
      overrideAccess: true,
      depth: 0,
    })

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'users',
        id: existing.docs[0].id,
        data: {
          password: devAdminPassword,
          role: 'admin',
        },
        overrideAccess: true,
      })

      payload.logger.info(`[dev-admin] Updated dev admin credentials: ${devAdminEmail}`)
      return
    }

    await payload.create({
      collection: 'users',
      data: {
        email: devAdminEmail,
        password: devAdminPassword,
        role: 'admin',
      },
      overrideAccess: true,
    })

    payload.logger.info(`[dev-admin] Created dev admin account: ${devAdminEmail}`)
  } catch (error) {
    payload.logger.error('[dev-admin] Failed to ensure dev admin account')
    payload.logger.error(error)
  }
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    cloneMediaCollection(),
    Categories,
    Posts,
    ServiceCategories,
    Services,
    ProductCategories,
    ProductTags,
    Products,
    Customers,
    Orders,
    Inquiries,
    EmailTemplates,
  ],
  editor: lexicalEditor(),
  secret: payloadSecret,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    push: !disableDatabasePush,
    pool: {
      connectionString: databaseUri,
    },
  }),
  sharp,
  plugins: [
    ...(cloudinaryEnabled
      ? [
          payloadCloudinaryPlugin({
            cloudName: cloudinaryCloudName,
            credentials: {
              apiKey: cloudinaryApiKey,
              apiSecret: cloudinaryApiSecret,
            },
            folder: cloudinaryFolder,
            useFilename: true,
            collections: {
              media: {
                disablePayloadAccessControl: true,
                generateFileURL: ({ filename, prefix, size }) =>
                  createCloudinaryURL({
                    cloudName: cloudinaryCloudName,
                    folder: cloudinaryFolder,
                    filename,
                    prefix,
                    width: size?.width,
                    height: size?.height,
                  }),
              },
            },
          }),
        ]
      : []),
  ],
  onInit: async (payload) => {
    if (process.env.CLOUDINARY_ENABLED === 'true' && !cloudinaryEnabled) {
      payload.logger.warn('[cloudinary] CLOUDINARY_ENABLED=true but credentials are incomplete; falling back to local uploads.')
    }

    await ensureDevAdmin(payload)
  },
})
