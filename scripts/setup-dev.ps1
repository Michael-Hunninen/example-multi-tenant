# Development Environment Setup Script
# This script helps ensure MongoDB is running and the environment is properly configured

Write-Host "Setting up development environment..." -ForegroundColor Green

# Check if MongoDB is running
Write-Host "Checking MongoDB status..." -ForegroundColor Yellow
$mongoProcess = Get-Process -Name "mongod" -ErrorAction SilentlyContinue

if ($mongoProcess) {
    Write-Host "MongoDB is running (PID: $($mongoProcess.Id))" -ForegroundColor Green
} else {
    Write-Host "MongoDB is not running. Please start MongoDB service." -ForegroundColor Red
    Write-Host "You can start MongoDB with: net start MongoDB" -ForegroundColor Yellow
    Write-Host "Or if using MongoDB Community: mongod --dbpath C:\data\db" -ForegroundColor Yellow
}

# Check if .env file exists
if (Test-Path ".env") {
    Write-Host ".env file found" -ForegroundColor Green
} else {
    Write-Host "Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "Please update the .env file with your actual configuration" -ForegroundColor Yellow
}

# Clean and rebuild
Write-Host "Cleaning build artifacts..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
}

Write-Host "Installing dependencies..." -ForegroundColor Yellow
pnpm install

Write-Host "Generating types..." -ForegroundColor Yellow
pnpm generate:types

Write-Host "Setup complete! You can now run 'pnpm dev' to start the development server." -ForegroundColor Green
