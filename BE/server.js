import dotenv from 'dotenv'
dotenv.config()

import cors from 'cors'
import express from 'express'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import { errorHandler, notFound } from './middlewares/errorMiddleware.js'

connectDB()

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.json({ message: 'Crochet Shop API is running' }))
app.use('/api/auth', authRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
