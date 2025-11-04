# LiveStream Vercel Deployment Script (PowerShell)
# This script helps you deploy to Vercel quickly

Write-Host "🚀 LiveStream Vercel Deployment Helper" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "⚠️  Vercel CLI is not installed." -ForegroundColor Yellow
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host "✅ Vercel CLI is ready!" -ForegroundColor Green
Write-Host ""

# Navigate to the livestream directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$scriptPath\livestream"

Write-Host "📍 Current directory: $(Get-Location)" -ForegroundColor Gray
Write-Host ""

# Check for environment variables
if (-not (Test-Path .env.local)) {
    Write-Host "⚠️  No .env.local file found!" -ForegroundColor Yellow
    
    if (Test-Path .env.example) {
        Write-Host "Creating .env.local from .env.example..." -ForegroundColor Yellow
        Copy-Item .env.example .env.local
        Write-Host "✅ Created .env.local" -ForegroundColor Green
        Write-Host "⚠️  Please update NEXT_PUBLIC_API_URL in .env.local with your backend URL" -ForegroundColor Yellow
        Write-Host ""
    }
}

# Ask user for deployment type
Write-Host "Choose deployment type:" -ForegroundColor Cyan
Write-Host "1) Preview deployment (test before going live)"
Write-Host "2) Production deployment"
Write-Host ""

$choice = Read-Host "Enter choice (1 or 2)"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "🚀 Deploying to preview..." -ForegroundColor Cyan
    vercel
}
elseif ($choice -eq "2") {
    Write-Host ""
    Write-Host "⚠️  This will deploy to PRODUCTION!" -ForegroundColor Yellow
    $confirm = Read-Host "Are you sure? (y/n)"
    
    if ($confirm -eq "y" -or $confirm -eq "Y") {
        Write-Host ""
        Write-Host "🚀 Deploying to production..." -ForegroundColor Cyan
        vercel --prod
    }
    else {
        Write-Host "❌ Deployment cancelled." -ForegroundColor Red
        exit 0
    }
}
else {
    Write-Host "❌ Invalid choice. Deployment cancelled." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 Your app should be live now!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Visit your Vercel URL to test"
Write-Host "2. Make sure backend CORS includes your Vercel URL"
Write-Host "3. Test all features (camera add, snapshot, assets)"
Write-Host ""
