import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICamera extends Document {
  name: string
  url: string
  type: 'webcam' | 'ip'
  isActive: boolean
  lastUsed?: Date
  metadata?: {
    resolution?: string
    fps?: number
  }
  createdAt: Date
  updatedAt: Date
}

const CameraSchema: Schema<ICamera> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Camera name is required'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'Camera URL is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['webcam', 'ip'],
      default: 'ip',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastUsed: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      resolution: String,
      fps: Number,
    },
  },
  {
    timestamps: true,
  }
)

// Add indexes for faster queries
CameraSchema.index({ name: 1 })
CameraSchema.index({ isActive: 1, lastUsed: -1 })
CameraSchema.index({ url: 1 }, { unique: true })

// Prevent model recompilation during hot reload in development
const Camera: Model<ICamera> = mongoose.models.Camera || mongoose.model<ICamera>('Camera', CameraSchema)

export default Camera
