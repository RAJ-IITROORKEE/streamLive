"use client"

import { useCallback, useEffect, useState } from "react"
import { Download, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"

interface Photo {
  filename: string
  url: string
}

export default function Assets() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [loading, setLoading] = useState(true)
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const loadPhotos = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API}/photos`)
      if (!res.ok) throw new Error("Failed to load photos")
      const data = await res.json()
      setPhotos(data.map((p: Photo) => ({ filename: p.filename, url: p.url })))
    } catch (e) {
      const msg = e && (e as Error).message ? (e as Error).message : String(e)
      toast.error("Failed to load photos: " + msg)
    } finally {
      setLoading(false)
    }
  }, [API])

  useEffect(() => {
    loadPhotos()
  }, [loadPhotos])

  const handleDownload = async (photo: Photo) => {
    try {
      const response = await fetch(photo.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = photo.filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("Download started!")
    } catch (e) {
      toast.error("Failed to download image")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Assets</h1>
          <p className="text-muted-foreground mt-2">
            All captured snapshots ({photos.length} total)
          </p>
        </div>
        <button
          onClick={loadPhotos}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-muted-foreground">Loading assets...</div>
        </div>
      ) : photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No assets yet</h3>
          <p className="text-muted-foreground">
            Capture some snapshots to see them here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.filename}
              className="group relative bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.filename}
                className="w-full h-48 object-cover"
              />
              <div className="p-3">
                <p className="text-sm font-medium truncate">{photo.filename}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDownload(photo)
                }}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Download"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Preview Dialog */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-card rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">{selectedPhoto.filename}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(selectedPhoto)}
                  className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md hover:opacity-90 transition-opacity"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.filename}
                className="w-full h-auto rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
