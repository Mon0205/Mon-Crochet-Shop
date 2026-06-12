import dotenv from 'dotenv'
dotenv.config()

import { connectDB } from '../config/db.js'
import Product from '../models/Product.js'

const products = [
  {
    name: 'Len Milk Cotton bang mau pastel',
    description: 'Len mem, de moc thu bong va phu kien handmade.',
    price: 28000,
    discountPrice: 24000,
    quantity: 48,
    color: 'Pastel mix',
    category: { name: 'Len sợi' },
    images: [{ url: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=900&q=80' }],
  },
  {
    name: 'Bo kim moc can mem nhieu size',
    description: 'Bo kim co nhieu co kim, phu hop nguoi moi bat dau.',
    price: 89000,
    discountPrice: 0,
    quantity: 26,
    color: 'Nhieu mau',
    category: { name: 'Kim móc' },
    images: [{ url: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=80' }],
  },
  {
    name: 'Mat thu an toan cho thu bong len',
    description: 'Phu kien gan mat cho amigurumi va thu bong handmade.',
    price: 18000,
    discountPrice: 0,
    quantity: 120,
    color: 'Den',
    category: { name: 'Phụ kiện' },
    images: [{ url: 'https://images.unsplash.com/photo-1517840933437-c41356892b35?auto=format&fit=crop&w=900&q=80' }],
  },
  {
    name: 'Combo nguoi moi bat dau moc len',
    description: 'Combo gom len, kim moc va phu kien co ban.',
    price: 159000,
    discountPrice: 139000,
    quantity: 18,
    color: 'Tuy chon',
    category: { name: 'Len sợi' },
    images: [{ url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=900&q=80' }],
  },
]

const seedProducts = async () => {
  await connectDB()
  const count = await Product.countDocuments()

  if (count > 0) {
    console.log('Products already exist:', count)
    process.exit(0)
  }

  await Product.insertMany(products)
  console.log('Products seeded:', products.length)
  process.exit(0)
}

seedProducts().catch((error) => {
  console.error(error)
  process.exit(1)
})
