import Order from '../models/Order.js'
import Product from '../models/Product.js'
import User from '../models/User.js'

const rangeConfigs = ['day', 'week', 'month', 'year']

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

const addHours = (date, amount) => {
  const next = new Date(date)
  next.setHours(next.getHours() + amount)
  return next
}

const addDays = (date, amount) => {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

const addMonths = (date, amount) => {
  const next = new Date(date)
  next.setMonth(next.getMonth() + amount)
  return next
}

const startOfWeek = (date) => {
  const current = startOfDay(date)
  const day = current.getDay() || 7
  return addDays(current, 1 - day)
}

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1)
const startOfYear = (date) => new Date(date.getFullYear(), 0, 1)

const formatHourLabel = (date) => `${String(date.getHours()).padStart(2, '0')}h`
const formatDateLabel = (date) => `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`
const formatMonthLabel = (date) => `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
const weekDayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

const createBucket = (start, end, label) => ({ start, end, label, value: 0, orders: 0 })

const buildBuckets = (range) => {
  const now = new Date()
  const buckets = []

  if (range === 'day') {
    const periodStart = startOfDay(now)
    for (let hour = 0; hour < 24; hour += 1) {
      const start = addHours(periodStart, hour)
      buckets.push(createBucket(start, addHours(start, 1), formatHourLabel(start)))
    }
    return buckets
  }

  if (range === 'week') {
    const periodStart = startOfWeek(now)
    for (let day = 0; day < 7; day += 1) {
      const start = addDays(periodStart, day)
      buckets.push(createBucket(start, addDays(start, 1), `${weekDayLabels[start.getDay()]} ${formatDateLabel(start)}`))
    }
    return buckets
  }

  if (range === 'month') {
    const periodStart = startOfMonth(now)
    const periodEnd = addMonths(periodStart, 1)
    for (let start = periodStart; start < periodEnd; start = addDays(start, 1)) {
      buckets.push(createBucket(start, addDays(start, 1), formatDateLabel(start)))
    }
    return buckets
  }

  if (range === 'year') {
    const periodStart = startOfYear(now)
    for (let month = 0; month < 12; month += 1) {
      const start = addMonths(periodStart, month)
      buckets.push(createBucket(start, addMonths(start, 1), formatMonthLabel(start)))
    }
    return buckets
  }

  return buckets
}

const findBucket = (buckets, date) => buckets.find((bucket) => date >= bucket.start && date < bucket.end)

export const getAdminStats = async (req, res) => {
  try {
    const range = rangeConfigs.includes(req.query.range) ? req.query.range : 'month'
    const buckets = buildBuckets(range)
    const fromDate = buckets[0].start
    const toDate = buckets[buckets.length - 1].end
    const activeOrderQuery = {
      status: { $ne: 'cancelled' },
    }
    const rangedOrderQuery = {
      ...activeOrderQuery,
      createdAt: { $gte: fromDate, $lt: toDate },
    }

    const [orders, productsCount, usersCount, pendingOrdersCount] = await Promise.all([
      Order.find(rangedOrderQuery).lean(),
      Product.countDocuments(),
      User.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
    ])

    const topProductMap = new Map()
    let revenue = 0
    let ordersCount = 0

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt)
      const totalPrice = Number(order.totalPrice || 0)
      const bucket = findBucket(buckets, orderDate)

      revenue += totalPrice
      ordersCount += 1

      if (bucket) {
        bucket.value += totalPrice
        bucket.orders += 1
      }

      order.items.forEach((item) => {
        const variantColor = item.variantColor?.trim() || ''
        const key = `${String(item.product)}::${variantColor || 'default'}`
        const current = topProductMap.get(key) || {
          id: key,
          name: item.name,
          variantColor,
          quantity: 0,
          revenue: 0,
        }

        current.quantity += Number(item.quantity || 0)
        current.revenue += Number(item.price || 0) * Number(item.quantity || 0)
        topProductMap.set(key, current)
      })
    })

    const topProducts = Array.from(topProductMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 6)

    return res.json({
      summary: {
        revenue,
        ordersCount,
        productsCount,
        usersCount,
        pendingOrdersCount,
      },
      revenueSeries: buckets.map(({ label, value, orders }) => ({ label, value, orders })),
      topProducts,
      range,
    })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Khong tai duoc thong ke admin.' })
  }
}

export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('name email phone address role createdAt')
      .sort({ createdAt: -1 })

    return res.json({ users })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Khong tai duoc danh sach nguoi dung.' })
  }
}

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Role khong hop le.' })
    }

    if (String(req.user._id) === String(req.params.id) && role !== 'admin') {
      return res.status(400).json({ message: 'Ban khong the tu ha quyen admin cua chinh minh.' })
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true },
    ).select('name email phone address role createdAt')

    if (!user) {
      return res.status(404).json({ message: 'Khong tim thay nguoi dung.' })
    }

    return res.json({ message: 'Cap nhat role thanh cong.', user })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Khong cap nhat duoc role.' })
  }
}
