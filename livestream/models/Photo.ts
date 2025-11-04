import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPhoto extends Document {
  cameraName: string
  cameraUrl: string
  imageUrl: string
  secureUrl: string
  cloudinaryPublicId: string
  thumbnail?: string
  capturedAt: Date
  metadata?: {
    width?: number
    height?: number
    format?: string
    size?: number
  }
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}

const PhotoSchema: Schema<IPhoto> = new Schema(
  {
    cameraName: {
      type: String,
      required: [true, 'Camera name is required'],
      trim: true,
    },
    cameraUrl: {
      type: String,
      required: [true, 'Camera URL is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    secureUrl: {
      type: String,
      required: [true, 'Secure URL is required'],
    },
    cloudinaryPublicId: {
      type: String,
      required: [true, 'Cloudinary public ID is required'],
      unique: true,
    },
    thumbnail: {
      type: String,
    },
    capturedAt: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      width: Number,
      height: Number,
      format: String,
      size: Number,
    },
    tags: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
  }
)

// Add indexes for faster queries
PhotoSchema.index({ cameraName: 1, createdAt: -1 })
PhotoSchema.index({ capturedAt: -1 })
PhotoSchema.index({ tags: 1 })

// Prevent model recompilation during hot reload in development
const Photo: Model<IPhoto> = mongoose.models.Photo || mongoose.model<IPhoto>('Photo', PhotoSchema)

export default Photo
