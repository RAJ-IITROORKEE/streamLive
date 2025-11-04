import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'

export async function GET() {
  try {
    const checks = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      mongodbConfigured: !!process.env.MONGODB_URI,
      cloudinaryConfigured: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY),
      apiUrl: process.env.NEXT_PUBLIC_API_URL || 'not set',
    }

    // Try to connect to MongoDB
    let mongoStatus: string
    try {
      await connectDB()
      mongoStatus = 'connected'
    } catch (error) {
      mongoStatus = error instanceof Error ? error.message : 'connection failed'
    }

    return NextResponse.json({
      status: 'ok',
      checks: {
        ...checks,
        mongodb: mongoStatus,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
