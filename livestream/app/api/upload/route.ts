import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Photo from '@/models/Photo'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB()

    // Get form data
    const formData = await request.formData()
    const cameraName = formData.get('cameraName') as string
    const cameraUrl = formData.get('cameraUrl') as string
    const imageFile = formData.get('image') as File

    // Validate inputs
    if (!cameraName || !cameraUrl || !imageFile) {
      return NextResponse.json(
        { error: 'Missing required fields: cameraName, cameraUrl, or image' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const arrayBuffer = await imageFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(buffer, 'livestream/snapshots')

    // Save metadata to MongoDB
    const photo = await Photo.create({
      cameraName,
      cameraUrl,
      imageUrl: uploadResult.url,
      secureUrl: uploadResult.secureUrl,
      cloudinaryPublicId: uploadResult.publicId,
      capturedAt: new Date(),
      metadata: {
        size: buffer.length,
        format: imageFile.type.split('/')[1],
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        id: photo._id,
        imageUrl: photo.secureUrl,
        cameraName: photo.cameraName,
        capturedAt: photo.capturedAt,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET route to fetch all photos
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = parseInt(searchParams.get('skip') || '0')
    const cameraName = searchParams.get('cameraName')

    // Build query
    const query = cameraName ? { cameraName } : {}

    // Fetch photos with pagination
    const photos = await Photo.find(query)
      .sort({ capturedAt: -1 })
      .limit(limit)
      .skip(skip)
      .select('-__v')

    const total = await Photo.countDocuments(query)

    return NextResponse.json({
      success: true,
      data: photos,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + limit < total,
      },
    })
  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch photos', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
