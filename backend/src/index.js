import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import { connectDB } from './lib/db.js'
import { app,server } from './lib/socket.js'

dotenv.config()


const PORT = process.env.PORT || 5001
const __dirname = path.resolve()

app.use(express.json({ limit: "10mb" }))
app.use(cookieParser())
app.use(cors({
    origin: process.env.NODE_ENV === "production" ? true : "http://localhost:5173",
    credentials: true,
    methods: ["GET","POST","PUT","DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))

app.use('/api/auth',authRoutes)
app.use('/api/messages',messageRoutes)

if(process.env.NODE_ENV==="production"){
    // Try multiple paths for frontend dist
    const possiblePaths = [
        path.join(__dirname, "../../frontend/dist"),
        path.join(__dirname, "../frontend/dist"),
        path.join(__dirname, "../dist"),
        path.join(process.cwd(), "frontend/dist"),
        path.join(process.cwd(), "../frontend/dist")
    ]
    
    let frontendPath = null
    let indexPath = null
    
    for(const testPath of possiblePaths) {
        const testIndex = path.join(testPath, "index.html")
        console.log(`Testing path: ${testPath} - exists: ${fs.existsSync(testIndex)}`)
        if(fs.existsSync(testIndex)) {
            frontendPath = testPath
            indexPath = testIndex
            break
        }
    }
    
    if(frontendPath && indexPath) {
        // Serve static files with proper headers
        app.use(express.static(frontendPath, {
            maxAge: '1d',
            etag: false
        }))
        
        // Handle SPA routing - serve index.html for all non-API routes
        app.get("*", (req,res) => {
            if(req.path.startsWith('/api/')) {
                return res.status(404).json({error: 'API route not found'})
            }
            res.sendFile(indexPath)
        })
    } else {
        console.error("Frontend build not found! Available paths checked:")
        possiblePaths.forEach(p => console.log(`  - ${p}: ${fs.existsSync(p)}`))
        app.get("*", (req,res) => {
            res.json({
                message: "Chat App API is running - Frontend not built", 
                status: "success", 
                api: "working",
                paths_checked: possiblePaths.map(p => ({path: p, exists: fs.existsSync(p)}))
            })
        })
    }
} else {
    app.get("/", (req,res) => {
        res.json({message: "Chat App API is running in DEVELOPMENT mode", status: "success", env: process.env.NODE_ENV || 'development'})
    })
}

server.listen(PORT,() => {
    console.log("Server started on port:"+PORT)
    connectDB()
})