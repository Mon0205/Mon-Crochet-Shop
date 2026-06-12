import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ten san pham khong duoc de trong.'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Gia san pham khong duoc de trong.'],
      min: [0, 'Gia san pham khong hop le.'],
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: [0, 'Gia khuyen mai khong hop le.'],
    },
    quantity: {
      type: Number,
      required: [true, 'So luong san pham khong duoc de trong.'],
      min: [0, 'So luong san pham khong hop le.'],
    },
    color: {
      type: String,
      default: '',
      trim: true,
    },
    hasVariants: {
      type: Boolean,
      default: false,
    },
    category: {
      name: {
        type: String,
        enum: ['Len s\u1ee3i', 'Kim m\u00f3c', 'Ph\u1ee5 ki\u1ec7n'],
        default: 'Len s\u1ee3i',
        trim: true,
      },
    },
    images: {
      type: [
        {
          url: { type: String, required: true },
          publicId: { type: String, default: '' },
        },
      ],
      default: [],
    },
    variants: {
      type: [
        {
          color: {
            type: String,
            required: true,
            trim: true,
          },
          quantity: {
            type: Number,
            default: 0,
            min: [0, 'So luong mau khong hop le.'],
          },
          images: {
            type: [
              {
                url: { type: String, required: true },
                publicId: { type: String, default: '' },
              },
            ],
            default: [],
          },
        },
      ],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

const Product = mongoose.model('Product', productSchema)

export default Product

