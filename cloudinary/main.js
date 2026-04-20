// Warning: this is AI generated. I did not make this, but I did
// look it over before running...
import { v2 as cloudinary } from 'cloudinary'
import { glob } from 'glob'
import path from 'path'
import 'dotenv/config'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const ROOT_DIR = 'images' // change if needed

async function uploadFile(filePath) {
  // Normalize to forward slashes
  const normalized = filePath.split(path.sep).join('/')

  // Remove extension for public_id
  const publicId = normalized.replace(/\.[^/.]+$/, '')

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      use_filename: false,
      unique_filename: false,
      overwrite: true,
      resource_type: 'image',
    })

    console.log(`✅ Uploaded: ${result.public_id}`)
  } catch (err) {
    console.error(`❌ Failed: ${filePath}`, err.message)
  }
}

async function main() {
  const files = await glob(`${ROOT_DIR}/**/*.{png,jpg,jpeg,webp,gif}`)

  console.log(`Found ${files.length} files`)

  for (const file of files) {
    await uploadFile(file)
  }

  console.log('Done.')
}

main()
