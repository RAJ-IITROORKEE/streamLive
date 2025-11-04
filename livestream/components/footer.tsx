"use client"

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center">
          <p className="text-sm text-muted-foreground text-center">
            © {currentYear} StreamLive | Design and developed by{" "}
            <span className="font-semibold text-foreground">Raj Rabidas</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
