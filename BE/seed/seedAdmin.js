import dotenv from 'dotenv'
dotenv.config()

import { connectDB } from '../config/db.js'
import User from '../models/User.js'

const run = async () => {
  await connectDB()

  const email = process.env.ADMIN_EMAIL || 'admin@gmail.com'
  const password = process.env.ADMIN_PASSWORD || '123456'

  const existed = await User.findOne({ email })
  if (existed) {
    console.log('Admin already exists:', email)
    process.exit(0)
  }

  await User.create({
    name: 'Admin',
    email,
    password,
    role: 'admin',
  })

  console.log('Admin created:', email, password)
  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
