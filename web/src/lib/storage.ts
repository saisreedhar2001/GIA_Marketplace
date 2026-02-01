import { storage } from './firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

/**
 * Upload an image file to Firebase Storage
 * @param file - The image file to upload
 * @param folder - Folder path in storage (e.g., 'products', 'users')
 * @returns Download URL of the uploaded file
 */
export async function uploadImage(file: File, folder: string = 'products'): Promise<string> {
  try {
    if (!file) {
      throw new Error('No file provided')
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image')
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB')
    }

    // Create unique filename
    const timestamp = new Date().getTime()
    const randomId = Math.random().toString(36).substring(2, 8)
    const filename = `${timestamp}-${randomId}-${file.name}`

    // Create storage reference
    const storageRef = ref(storage, `${folder}/${filename}`)

    // Upload file
    await uploadBytes(storageRef, file)

    // Get download URL
    const url = await getDownloadURL(storageRef)
    return url
  } catch (error: any) {
    console.error('Error uploading image:', error)
    throw new Error(error.message || 'Failed to upload image')
  }
}

/**
 * Upload multiple image files to Firebase Storage
 * @param files - Array of image files to upload
 * @param folder - Folder path in storage
 * @returns Array of download URLs
 */
export async function uploadImages(files: File[], folder: string = 'products'): Promise<string[]> {
  try {
    const uploadPromises = files.map((file) => uploadImage(file, folder))
    return await Promise.all(uploadPromises)
  } catch (error: any) {
    console.error('Error uploading images:', error)
    throw new Error(error.message || 'Failed to upload images')
  }
}
