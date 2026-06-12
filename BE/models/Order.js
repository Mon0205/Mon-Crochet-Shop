import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    variantColor: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { _id: false },
)

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(items) => items.length > 0, 'Don hang phai co san pham.'],
    },
    shippingAddress: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      note: { type: String, default: '', trim: true },
    },
    paymentMethod: {
      type: String,
      enum: ['COD'],
      default: 'COD',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'],
      default: 'pending',
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
)

const Order = mongoose.model('Order', orderSchema)

export default Order
