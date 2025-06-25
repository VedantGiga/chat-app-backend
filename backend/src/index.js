import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'
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
}))

app.use('/api/auth',authRoutes)
app.use('/api/messages',messageRoutes)

// API routes only - frontend served separately
app.get("/", (req,res) => {
    res.json({message: "Chat App API is running", status: "success"})
})

server.listen(PORT,() => {
    console.log("Server started on port:"+PORT)
    connectDB()
})