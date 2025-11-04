import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Camera from '@/models/Camera'

// GET single camera
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const params = await context.params
    const camera = await Camera.findById(params.id)

    if (!camera) {
      return NextResponse.json(
        { error: 'Camera not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: camera,
    })
  } catch (error) {
    console.error('Fetch camera error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch camera', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// PUT update camera
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const params = await context.params
    const body = await request.json()

    const camera = await Camera.findByIdAndUpdate(
      params.id,
      { 
        ...body,
        lastUsed: new Date(),
      },
      { new: true, runValidators: true }
    )

    if (!camera) {
      return NextResponse.json(
        { error: 'Camera not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: camera,
    })
  } catch (error) {
    console.error('Update camera error:', error)
    return NextResponse.json(
      { error: 'Failed to update camera', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE camera
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const params = await context.params

    const camera = await Camera.findByIdAndDelete(params.id)

    if (!camera) {
      return NextResponse.json(
        { error: 'Camera not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Camera deleted successfully',
    })
  } catch (error) {
    console.error('Delete camera error:', error)
    return NextResponse.json(
      { error: 'Failed to delete camera', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
