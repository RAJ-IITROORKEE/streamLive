import { Camera, Code2, Globe, Smartphone, User, Mail, Hash, ExternalLink, Sparkles, Zap, Shield } from "lucide-react"

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)'}}>
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Modern Camera Streaming Platform</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            About StreamLive
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A professional, real-time camera streaming and snapshot management platform 
            built with cutting-edge web technologies.
          </p>
        </div>

        {/* Key Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-lg border" style={{backgroundColor: 'var(--card)', borderColor: 'var(--border)'}}>
            <div className="p-3 rounded-lg inline-block mb-4" style={{backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)'}}>
              <Camera className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Multi-Camera Support</h3>
            <p className="text-sm text-muted-foreground">
              Connect and manage multiple IP cameras simultaneously with real-time streaming
            </p>
          </div>
          
          <div className="p-6 rounded-lg border" style={{backgroundColor: 'var(--card)', borderColor: 'var(--border)'}}>
            <div className="p-3 rounded-lg inline-block mb-4" style={{backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)'}}>
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Instant Capture</h3>
            <p className="text-sm text-muted-foreground">
              Take snapshots with customizable timers (3s, 5s, 10s) and fullscreen viewing
            </p>
          </div>
          
          <div className="p-6 rounded-lg border" style={{backgroundColor: 'var(--card)', borderColor: 'var(--border)'}}>
            <div className="p-3 rounded-lg inline-block mb-4" style={{backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)'}}>
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure & Local</h3>
            <p className="text-sm text-muted-foreground">
              All camera configs stored locally in your browser with network info display
            </p>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-12 p-8 rounded-lg border" style={{backgroundColor: 'var(--card)', borderColor: 'var(--border)'}}>
          <div className="flex items-center gap-2 mb-6">
            <Code2 className="h-6 w-6" style={{color: 'var(--primary)'}} />
            <h2 className="text-3xl font-bold">Technology Stack</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Globe className="h-5 w-5" style={{color: 'var(--primary)'}} />
                Frontend
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{backgroundColor: 'var(--primary)'}}></span>
                  <span>Next.js 15 with App Router</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{backgroundColor: 'var(--primary)'}}></span>
                  <span>React 18 & TypeScript</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{backgroundColor: 'var(--primary)'}}></span>
                  <span>Tailwind CSS v4 with dark mode</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{backgroundColor: 'var(--primary)'}}></span>
                  <span>shadcn/ui components</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Code2 className="h-5 w-5" style={{color: 'var(--primary)'}} />
                Backend
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{backgroundColor: 'var(--primary)'}}></span>
                  <span>Python FastAPI</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{backgroundColor: 'var(--primary)'}}></span>
                  <span>OpenCV for image processing</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{backgroundColor: 'var(--primary)'}}></span>
                  <span>Uvicorn ASGI server</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{backgroundColor: 'var(--primary)'}}></span>
                  <span>CORS-enabled REST API</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* How to Connect */}
        <div className="mb-12 p-8 rounded-lg border" style={{backgroundColor: 'var(--card)', borderColor: 'var(--border)'}}>
          <div className="flex items-center gap-2 mb-6">
            <Smartphone className="h-6 w-6" style={{color: 'var(--primary)'}} />
            <h2 className="text-3xl font-bold">How to Connect Your Camera</h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg" style={{backgroundColor: 'var(--accent)'}}>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Using IP Webcam App (Recommended)
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground ml-7">
                <li>Download <strong>&quot;IP Webcam&quot;</strong> app on your smartphone (Android/iOS)</li>
                <li>Open the app and scroll down to click <strong>&quot;Start Server&quot;</strong></li>
                <li>The app will display a URL (e.g., http://192.168.1.100:8080)</li>
                <li>Make sure your computer and phone are on the <strong>same WiFi network</strong></li>
                <li>Copy the URL and add <code className="px-1 py-0.5 rounded" style={{backgroundColor: 'var(--muted)'}}>/video</code> at the end</li>
                <li>Click <strong>&quot;Add Camera&quot;</strong> button in StreamLive dashboard</li>
                <li>Paste the complete URL (e.g., http://192.168.1.100:8080/video)</li>
                <li>Give it a name and click &quot;Add Camera&quot; - your stream will appear instantly!</li>
              </ol>
            </div>

            <div className="p-4 rounded-lg border" style={{borderColor: 'var(--border)'}}>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Using Other IP Cameras
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground ml-7">
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full mt-2 shrink-0" style={{backgroundColor: 'var(--primary)'}}></span>
                  <span>Ensure camera has HTTP/MJPEG streaming enabled</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full mt-2 shrink-0" style={{backgroundColor: 'var(--primary)'}}></span>
                  <span>Find camera IP from router settings or camera app</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full mt-2 shrink-0" style={{backgroundColor: 'var(--primary)'}}></span>
                  <span>Note the streaming port (commonly 8080, 554, or 4747)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full mt-2 shrink-0" style={{backgroundColor: 'var(--primary)'}}></span>
                  <span>Enter complete URL in Add Camera dialog</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Developer Profile */}
        <div className="p-8 rounded-lg border relative overflow-hidden" style={{backgroundColor: 'var(--card)', borderColor: 'var(--border)'}}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-6">
              <User className="h-6 w-6" style={{color: 'var(--primary)'}} />
              <h2 className="text-3xl font-bold">Developer</h2>
            </div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="p-4 rounded-full" style={{backgroundColor: 'var(--accent)'}}>
                <User className="h-16 w-16" style={{color: 'var(--accent-foreground)'}} />
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Raj Rabidas</h3>
                <p className="text-muted-foreground mb-4">
                  Full-stack developer passionate about building modern, scalable web applications 
                  with exceptional user experiences.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="https://rajrabidas.me" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
                    style={{backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)'}}
                  >
                    <Globe className="h-4 w-4" />
                    <span>Portfolio</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  
                  <a 
                    href="https://instagram.com/rajrabidas03" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
                    style={{backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)'}}
                  >
                    <Hash className="h-4 w-4" />
                    <span>@rajrabidas03</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  
                  <a 
                    href="mailto:rajrabidas001@gmail.com"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
                    style={{backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)'}}
                  >
                    <Mail className="h-4 w-4" />
                    <span>Email Me</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
