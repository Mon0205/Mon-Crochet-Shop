import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên không được để trống.'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email không được để trống.'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'Mật khẩu không được để trống.'],
      minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự.'],
      select: false,
    },

    phone: {
      type: String,
      default: '',
      trim: true,
    },

    address: {
      type: String,
      default: '',
      trim: true,
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    resetPasswordOtp: {
      type: String,
      select: false,
    },

    resetPasswordOtpExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  },
)

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return
  }

  this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User