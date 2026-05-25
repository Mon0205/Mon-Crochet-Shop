import crypto from 'crypto'

export const createOtp = () => String(Math.floor(100000 + Math.random() * 900000))
export const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex')
