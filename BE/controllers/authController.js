import User from '../models/User.js'
import { generateToken } from '../utils/generateToken.js'
import { createOtp, hashOtp } from '../utils/createOtp.js'
import { sendEmail } from '../utils/sendEmail.js'

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  address: user.address,
  role: user.role,
})

export const register = async (req, res) => {
  console.log('REGISTER BODY:', req.body)

  try {
    const { name, email, password, phone, address } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Vui lòng nhập tên, email và mật khẩu.',
      })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const existedUser = await User.findOne({ email: normalizedEmail })

    if (existedUser) {
      return res.status(409).json({
        message: 'Email đã tồn tại, vui lòng dùng email khác.',
      })
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      phone,
      address,
    })

    return res.status(201).json({
      message: 'Đăng ký thành công.',
      user: publicUser(user),
      token: generateToken(user._id),
    })
  } catch (error) {
    console.log('REGISTER ERROR MESSAGE:', error.message)
    console.log('REGISTER ERROR FULL:', error)

    return res.status(500).json({
      message: error.message || 'Lỗi server khi đăng ký.',
    })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'Vui lòng nhập email và mật khẩu.',
      })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const user = await User.findOne({ email: normalizedEmail }).select('+password')

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        message: 'Email hoặc mật khẩu không đúng.',
      })
    }

    return res.json({
      message: 'Đăng nhập thành công.',
      user: publicUser(user),
      token: generateToken(user._id),
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Lỗi server khi đăng nhập.',
    })
  }
}

export const getMe = async (req, res) => {
  try {
    return res.json({
      user: publicUser(req.user),
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Lỗi server khi lấy thông tin user.',
    })
  }
}

export const updateMe = async (req, res) => {
  try {
    const { name, phone, address } = req.body

    if (!name?.trim()) {
      return res.status(400).json({
        message: 'Vui lòng nhập họ tên.',
      })
    }

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        message: 'Không tìm thấy tài khoản.',
      })
    }

    user.name = name.trim()
    user.phone = phone?.trim() || ''
    user.address = address?.trim() || ''

    await user.save({ validateBeforeSave: false })

    return res.json({
      message: 'Cập nhật thông tin cá nhân thành công.',
      user: publicUser(user),
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Lỗi server khi cập nhật thông tin cá nhân.',
    })
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        message: 'Vui lòng nhập email.',
      })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const user = await User.findOne({ email: normalizedEmail }).select(
      '+resetPasswordOtp +resetPasswordOtpExpires',
    )

    if (!user) {
      return res.json({
        message: 'Nếu email tồn tại, mã xác thực sẽ được gửi đến email đó.',
      })
    }

    const otp = createOtp()

    user.resetPasswordOtp = hashOtp(otp)
    user.resetPasswordOtpExpires = new Date(Date.now() + 10 * 60 * 1000)

    await user.save({ validateBeforeSave: false })

    await sendEmail({
      to: user.email,
      subject: 'Mã xác thực đặt lại mật khẩu',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6">
          <h2>Mon Crochet Shop</h2>
          <p>Mã xác thực đặt lại mật khẩu của bạn là:</p>
          <h1 style="letter-spacing: 4px">${otp}</h1>
          <p>Mã này có hiệu lực trong 10 phút.</p>
          <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
        </div>
      `,
    })

    return res.json({
      message: 'Nếu email tồn tại, mã xác thực sẽ được gửi đến email đó.',
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Lỗi server khi gửi mã xác thực.',
    })
  }
}

export const verifyResetPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({
        message: 'Vui lòng nhập email và mã xác thực.',
      })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const user = await User.findOne({
      email: normalizedEmail,
      resetPasswordOtp: hashOtp(otp),
      resetPasswordOtpExpires: { $gt: Date.now() },
    }).select('+resetPasswordOtp +resetPasswordOtpExpires')

    if (!user) {
      return res.status(400).json({
        message: 'Mã xác thực không đúng hoặc đã hết hạn.',
      })
    }

    return res.json({
      message: 'Xác thực mã thành công. Vui lòng nhập mật khẩu mới.',
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Lỗi server khi xác thực mã.',
    })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: 'Vui lòng nhập email, mã xác thực và mật khẩu mới.',
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự.',
      })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const user = await User.findOne({
      email: normalizedEmail,
      resetPasswordOtp: hashOtp(otp),
      resetPasswordOtpExpires: { $gt: Date.now() },
    }).select('+password +resetPasswordOtp +resetPasswordOtpExpires')

    if (!user) {
      return res.status(400).json({
        message: 'Mã xác thực không đúng hoặc đã hết hạn.',
      })
    }

    user.password = newPassword
    user.resetPasswordOtp = undefined
    user.resetPasswordOtpExpires = undefined

    await user.save()

    return res.json({
      message: 'Đổi mật khẩu thành công. Bạn có thể đăng nhập lại.',
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Lỗi server khi đổi mật khẩu.',
    })
  }
}
