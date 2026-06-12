import dotenv from 'dotenv'
dotenv.config()

import cors from 'cors'
import express from 'express'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import { errorHandler, notFound } from './middlewares/errorMiddleware.js'

connectDB()

const app = express()

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error(`CORS blocked origin: ${origin}`))
    },
    credentials: true,
  }),
)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.json({ message: 'Crochet Shop API is running' }))
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/uploads', uploadRoutes)
app.use('/api/cart', cartRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
