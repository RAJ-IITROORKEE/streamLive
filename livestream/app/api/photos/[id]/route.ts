import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Photo from '@/models/Photo'
import { deleteFromCloudinary } from '@/lib/cloudinary'

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    // Await params in Next.js 15
    const params = await context.params
    const photoId = params.id

    // Find the photo
    const photo = await Photo.findById(photoId)

    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      )
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(photo.cloudinaryPublicId)

    // Delete from database
    await Photo.findByIdAndDelete(photoId)

    return NextResponse.json({
      success: true,
      message: 'Photo deleted successfully',
    })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete photo', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
