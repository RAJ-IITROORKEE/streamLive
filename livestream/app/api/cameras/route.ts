import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Camera from '@/models/Camera'

// GET all cameras
export async function GET() {
  try {
    await connectDB()

    const cameras = await Camera.find({ isActive: true })
      .sort({ lastUsed: -1 })
      .select('-__v')

    return NextResponse.json({
      success: true,
      data: cameras,
    })
  } catch (error) {
    console.error('Fetch cameras error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cameras', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST create new camera
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { name, url, type = 'ip' } = body

    if (!name || !url) {
      return NextResponse.json(
        { error: 'Name and URL are required' },
        { status: 400 }
      )
    }

    // Check if camera with this URL already exists
    const existingCamera = await Camera.findOne({ url })
    if (existingCamera) {
      return NextResponse.json(
        { error: 'Camera with this URL already exists' },
        { status: 409 }
      )
    }

    // Create new camera
    const camera = await Camera.create({
      name,
      url,
      type,
      isActive: true,
    })

    return NextResponse.json({
      success: true,
      data: camera,
    }, { status: 201 })
  } catch (error) {
    console.error('Create camera error:', error)
    return NextResponse.json(
      { error: 'Failed to create camera', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
