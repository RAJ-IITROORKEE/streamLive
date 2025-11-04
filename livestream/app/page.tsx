"use client"

import { useCallback, useEffect, useState } from "react"
import { Camera, Info, Plus, X, Maximize2, Timer, Edit } from "lucide-react"
import { toast } from "sonner"

interface CameraConfig {
  id: string
  name: string
  url: string
  type: "webcam" | "ip"
}

export default function Home() {
  const [cameras, setCameras] = useState<CameraConfig[]>([])
  const [showAddCamera, setShowAddCamera] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [editingCamera, setEditingCamera] = useState<CameraConfig | null>(null)
  const [newCameraName, setNewCameraName] = useState("")
  const [newCameraUrl, setNewCameraUrl] = useState("")
  const [localIp, setLocalIp] = useState("Loading...")
  const [publicIp, setPublicIp] = useState("Loading...")
  const [fullscreenCamera, setFullscreenCamera] = useState<CameraConfig | null>(null)
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [savedCameras, setSavedCameras] = useState<Array<{name: string, url: string}>>([])
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  // Load cameras from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cameras")
    if (saved) {
      try {
        setCameras(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse saved cameras", e)
      }
    }
    
    // Load saved camera templates
    const savedTemplates = localStorage.getItem("savedCameraTemplates")
    if (savedTemplates) {
      try {
        setSavedCameras(JSON.parse(savedTemplates))
      } catch (e) {
        console.error("Failed to parse saved templates", e)
      }
    }
  }, [])

  // Save cameras to localStorage
  useEffect(() => {
    localStorage.setItem("cameras", JSON.stringify(cameras))
  }, [cameras])

  const addCamera = () => {
    if (!newCameraName.trim() || !newCameraUrl.trim()) {
      toast.error("Please enter both name and URL")
      return
    }

    if (editingCamera) {
      // Update existing camera
      setCameras(cameras.map(c => 
        c.id === editingCamera.id 
          ? { ...c, name: newCameraName.trim(), url: newCameraUrl.trim() }
          : c
      ))
      toast.success("Camera updated successfully!")
      setEditingCamera(null)
    } else {
      // Add new camera
      const newCamera: CameraConfig = {
        id: Date.now().toString(),
        name: newCameraName.trim(),
        url: newCameraUrl.trim(),
        type: "ip",
      }
      setCameras([...cameras, newCamera])
      
      // Save as template if not already saved
      const template = { name: newCameraName.trim(), url: newCameraUrl.trim() }
      const exists = savedCameras.some(sc => sc.url === template.url)
      if (!exists) {
        const updated = [...savedCameras, template]
        setSavedCameras(updated)
        localStorage.setItem("savedCameraTemplates", JSON.stringify(updated))
      }
      
      toast.success(`Camera "${newCamera.name}" added successfully!`)
    }
    
    setNewCameraName("")
    setNewCameraUrl("")
    setShowAddCamera(false)
  }

  const removeCamera = (id: string) => {
    setCameras(cameras.filter((c) => c.id !== id))
    toast.success("Camera removed")
  }

  const startEditCamera = (camera: CameraConfig) => {
    setEditingCamera(camera)
    setNewCameraName(camera.name)
    setNewCameraUrl(camera.url)
    setShowAddCamera(true)
  }

  const selectSavedCamera = (saved: {name: string, url: string}) => {
    setNewCameraName(saved.name)
    setNewCameraUrl(saved.url)
  }

  const loadNetworkInfo = useCallback(async () => {
    try {
      const res = await fetch(`${API}/network-info`)
      if (!res.ok) throw new Error("failed to load network info")
      const data = await res.json()
      setLocalIp(data.local_ip || "unknown")
      setPublicIp(data.public_ip || "unknown")
    } catch (e) {
      console.warn(e)
      setLocalIp("Error loading")
      setPublicIp("Error loading")
    }
  }, [API])

  useEffect(() => {
    loadNetworkInfo()
  }, [loadNetworkInfo])

  // removed duplicate loadPhotos function - use the useCallback version above

  const takeSnapshot = async (sourceUrl?: string) => {
    try {
      const body = sourceUrl ? { camera_url: sourceUrl } : { camera_index: 0 }
      const res = await fetch(`${API}/snapshot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || "snapshot failed")
      }
      await res.json()
      toast.success("Snapshot saved successfully!")
    } catch (e) {
      const msg = e && (e as Error).message ? (e as Error).message : String(e)
      toast.error("Snapshot failed: " + msg)
    }
  }

  const startTimer = (camera: CameraConfig, seconds: number) => {
    setTimerSeconds(seconds)
    setCountdown(seconds)
    toast.info(`Timer started: ${seconds} seconds`)
    
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval)
          return null
        }
        return prev - 1
      })
    }, 1000)
    
    setTimeout(() => {
      takeSnapshot(camera.type === "ip" ? camera.url : undefined)
      setTimerSeconds(null)
      setCountdown(null)
    }, seconds * 1000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1" style={{color: 'var(--muted-foreground)'}}>Manage your camera streams</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowInfo(true)}
            className="p-2 rounded-lg hover:opacity-90 transition-opacity"
            style={{backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)'}}
            title="Info"
          >
            <Info className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowAddCamera(true)}
            className="px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
            style={{backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)'}}
          >
            <Plus className="h-5 w-5" />
            Add Camera
          </button>
        </div>
      </div>

      {/* Network Info Card */}
      <div className="mb-6 p-4 border rounded-lg" style={{backgroundColor: 'var(--card)', borderColor: 'var(--border)'}}>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Network Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span style={{color: 'var(--muted-foreground)'}}>Local IP:</span>{" "}
            <span className="font-mono font-semibold">{localIp}</span>
          </div>
          <div>
            <span style={{color: 'var(--muted-foreground)'}}>Public IP:</span>{" "}
            <span className="font-mono font-semibold">{publicIp}</span>
          </div>
        </div>
      </div>

      {/* Camera Grid */}
      {cameras.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-lg" style={{borderColor: 'var(--border)'}}>
          <Camera className="h-16 w-16 mb-4" style={{color: 'var(--muted-foreground)'}} />
          <h3 className="text-xl font-semibold mb-2">No cameras added yet</h3>
          <p style={{color: 'var(--muted-foreground)'}}>
            Click Add Camera button to start streaming
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cameras.map((camera) => (
            <div key={camera.id} className="border rounded-lg overflow-hidden shadow-lg" style={{backgroundColor: 'var(--card)', borderColor: 'var(--border)'}}>
              <div className="p-4 border-b flex items-center justify-between" style={{borderColor: 'var(--border)'}}>
                <h3 className="font-semibold">{camera.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFullscreenCamera(camera)}
                    className="p-1.5 rounded hover:opacity-80"
                    style={{backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)'}}
                    title="Fullscreen"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => startEditCamera(camera)}
                    className="p-1.5 rounded hover:opacity-80"
                    style={{backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)'}}
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeCamera(camera.id)}
                    className="p-1.5 rounded hover:opacity-80"
                    style={{backgroundColor: 'var(--destructive)', color: 'var(--destructive-foreground)'}}
                    title="Remove"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="aspect-video bg-black relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={camera.url}
                  alt={camera.name}
                  className="w-full h-full object-contain"
                  onError={() => toast.error(`Failed to load ${camera.name}`)}
                />
              </div>
              <div className="p-4 flex gap-2">
                <button
                  onClick={() => takeSnapshot(camera.url)}
                  className="flex-1 px-3 py-2 rounded hover:opacity-90 text-sm"
                  style={{backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)'}}
                >
                  Snapshot
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Camera Dialog */}
      {showAddCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{backgroundColor: 'rgba(0,0,0,0.8)'}}>
          <div className="rounded-lg max-w-md w-full p-6" style={{backgroundColor: 'var(--card)'}}>
            <h2 className="text-xl font-bold mb-4">{editingCamera ? 'Edit Camera' : 'Add New Camera'}</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="camera-name" className="block text-sm font-medium mb-2">Camera Name</label>
                <input
                  id="camera-name"
                  type="text"
                  value={newCameraName}
                  onChange={(e) => setNewCameraName(e.target.value)}
                  placeholder="e.g., Front Door Camera"
                  className="w-full px-3 py-2 border rounded-md"
                  style={{backgroundColor: 'var(--background)', borderColor: 'var(--border)'}}
                />
              </div>
              <div>
                <label htmlFor="camera-url" className="block text-sm font-medium mb-2">Camera URL</label>
                <input
                  id="camera-url"
                  type="text"
                  value={newCameraUrl}
                  onChange={(e) => setNewCameraUrl(e.target.value)}
                  placeholder="http://192.168.1.100:8080/video"
                  className="w-full px-3 py-2 border rounded-md"
                  style={{backgroundColor: 'var(--background)', borderColor: 'var(--border)'}}
                />
              </div>
              {/* Saved Cameras Templates */}
              {!editingCamera && savedCameras.length > 0 && (
                <div>
                  <div className="block text-sm font-medium mb-2">Quick Add from Saved</div>
                  <div className="flex flex-wrap gap-2">
                    {savedCameras.map((saved) => (
                      <button
                        key={`${saved.name}-${saved.url}`}
                        onClick={() => selectSavedCamera(saved)}
                        className="px-3 py-1.5 text-sm rounded-full hover:opacity-80"
                        style={{backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)'}}
                      >
                        {saved.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowAddCamera(false)
                    setEditingCamera(null)
                    setNewCameraName('')
                    setNewCameraUrl('')
                  }}
                  className="px-4 py-2 rounded-md hover:opacity-90"
                  style={{backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)'}}
                >
                  Cancel
                </button>
                <button
                  onClick={addCamera}
                  className="px-4 py-2 rounded-md hover:opacity-90"
                  style={{backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)'}}
                >
                  {editingCamera ? 'Update Camera' : 'Add Camera'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Dialog */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{backgroundColor: 'rgba(0,0,0,0.8)'}}>
          <div className="rounded-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto" style={{backgroundColor: 'var(--card)'}}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">How to Connect</h2>
              <button
                onClick={() => setShowInfo(false)}
                className="p-2 rounded hover:opacity-80"
                style={{backgroundColor: 'var(--secondary)'}}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold text-lg mb-2">Connection Requirements</h3>
                <ul className="list-disc list-inside space-y-1" style={{color: 'var(--muted-foreground)'}}>
                  <li>Camera device must be on the same local network</li>
                  <li>Camera must have HTTP/MJPEG streaming enabled</li>
                  <li>You need the camera IP address and streaming port</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Setup Steps</h3>
                <ol className="list-decimal list-inside space-y-1" style={{color: 'var(--muted-foreground)'}}>
                  <li>Find your camera IP address (check camera app or router)</li>
                  <li>Note the streaming port (commonly 8080, 554, or 4747)</li>
                  <li>Click Add Camera button</li>
                  <li>Enter a descriptive name for your camera</li>
                  <li>Enter the complete URL (e.g., http://192.168.1.100:8080/video)</li>
                  <li>Click Add Camera to start streaming</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Features</h3>
                <ul className="list-disc list-inside space-y-1" style={{color: 'var(--muted-foreground)'}}>
                  <li>Take instant snapshots from any camera</li>
                  <li>Fullscreen viewing mode with timer options (3s, 5s, 10s)</li>
                  <li>All snapshots saved to Assets page for later access</li>
                  <li>Download any snapshot directly</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Camera View */}
      {fullscreenCamera && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="border-b p-4 flex items-center justify-between" style={{backgroundColor: 'var(--card)', borderColor: 'var(--border)'}}>
            <h2 className="text-lg font-semibold">{fullscreenCamera.name}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => takeSnapshot(fullscreenCamera.url)}
                className="px-3 py-1.5 rounded hover:opacity-90 flex items-center gap-2"
                style={{backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)'}}
                disabled={timerSeconds !== null}
              >
                <Camera className="h-4 w-4" />
                Snapshot
              </button>
              <button
                onClick={() => startTimer(fullscreenCamera, 3)}
                className="px-3 py-1.5 rounded hover:opacity-90 flex items-center gap-1"
                style={{backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)'}}
                disabled={timerSeconds !== null}
              >
                <Timer className="h-4 w-4" />
                3s
              </button>
              <button
                onClick={() => startTimer(fullscreenCamera, 5)}
                className="px-3 py-1.5 rounded hover:opacity-90 flex items-center gap-1"
                style={{backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)'}}
                disabled={timerSeconds !== null}
              >
                <Timer className="h-4 w-4" />
                5s
              </button>
              <button
                onClick={() => startTimer(fullscreenCamera, 10)}
                className="px-3 py-1.5 rounded hover:opacity-90 flex items-center gap-1"
                style={{backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)'}}
                disabled={timerSeconds !== null}
              >
                <Timer className="h-4 w-4" />
                10s
              </button>
              <button
                onClick={() => setFullscreenCamera(null)}
                className="px-3 py-1.5 rounded hover:opacity-90"
                style={{backgroundColor: 'var(--destructive)', color: 'var(--destructive-foreground)'}}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 relative flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fullscreenCamera.url}
              alt={fullscreenCamera.name}
              className="max-w-full max-h-full object-contain"
            />
            {countdown !== null && countdown > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-white text-9xl font-bold animate-pulse">{countdown}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
