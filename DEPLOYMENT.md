# Render Deployment Guide

## Deploy with Blueprint

1. Fork this repository to your GitHub account
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New" → "Blueprint"
4. Connect your GitHub repository
5. Select this repository
6. Render will automatically detect the `render.yaml` file
7. Click "Apply" to deploy

## Environment Variables

The following environment variables will be automatically configured:
- `NODE_ENV`: production
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Auto-generated secure secret
- `CLOUDINARY_*`: Your Cloudinary credentials
- `CLIENT_URL`: Auto-configured for CORS

## Features Included

- ✅ Real-time messaging with Socket.IO
- ✅ User authentication with JWT
- ✅ Image uploads with Cloudinary
- ✅ Online status tracking
- ✅ Typing indicators
- ✅ MongoDB Atlas integration
- ✅ Production-ready configuration