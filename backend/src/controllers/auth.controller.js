import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export async function register(req, res, next) {
  try {
    const { name, email, password, company } = req.body
    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ message: 'Email already registered' })

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({ name, email, passwordHash, company, role: 'client' })
    res.status(201).json({ token: signToken(user), user: { id: user.id, name, email, company, role: user.role } })
  } catch (error) {
    next(error)
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !user.active || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    res.json({ token: signToken(user), user: { id: user.id, name: user.name, email: user.email, company: user.company, role: user.role } })
  } catch (error) {
    next(error)
  }
}

export async function me(req, res) {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    company: req.user.company,
    role: req.user.role,
  })
}

export async function updateMe(req, res, next) {
  try {
    const { name, email, company, password } = req.body
    const normalizedEmail = email?.trim().toLowerCase()
    const exists = await User.findOne({ email: normalizedEmail, _id: { $ne: req.user.id } })
    if (exists) return res.status(409).json({ message: 'Email already registered' })

    const updates = {
      name: name?.trim(),
      email: normalizedEmail,
      company: company?.trim(),
    }
    if (password) updates.passwordHash = await bcrypt.hash(password, 12)

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-passwordHash')
    res.json({ id: user.id, name: user.name, email: user.email, company: user.company, role: user.role })
  } catch (error) {
    next(error)
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (user) {
      user.resetToken = crypto.randomBytes(24).toString('hex')
      user.resetTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 30)
      await user.save()
      console.log(`Password reset link for ${user.email}: /reset-password?token=${user.resetToken}`)
    }
    res.json({ message: 'Password reset instructions sent if the account exists.' })
  } catch (error) {
    next(error)
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body
    const user = await User.findOne({ resetToken: token, resetTokenExpiresAt: { $gt: new Date() } })
    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' })

    user.passwordHash = await bcrypt.hash(password, 12)
    user.resetToken = undefined
    user.resetTokenExpiresAt = undefined
    await user.save()
    res.json({ message: 'Password updated successfully.' })
  } catch (error) {
    next(error)
  }
}
