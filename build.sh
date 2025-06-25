#!/bin/bash
set -e

echo "Installing frontend dependencies..."
cd frontend
npm install
echo "Building frontend..."
npm run build
echo "Frontend build complete"

echo "Installing backend dependencies..."
cd ../backend
npm install
echo "Backend dependencies installed"