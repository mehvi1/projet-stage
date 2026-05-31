import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'

function serializeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    company: user.company,
    role: user.role,
    active: user.active,
    createdAt: user.createdAt,
  }
}

export async function listEmployees(_req, res, next) {
  try {
    const employees = await User.find({ role: { $in: ['employee', 'admin'] } }).sort({ createdAt: -1 })
    res.json(employees.map(serializeUser))
  } catch (error) {
    next(error)
  }
}

export async function createEmployee(req, res, next) {
  try {
    const { name, email, password, company, role = 'employee' } = req.body
    if (!['employee', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' })
    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ message: 'Email already registered' })

    const employee = await User.create({
      name,
      email,
      company,
      role,
      passwordHash: await bcrypt.hash(password, 12),
    })
    res.status(201).json(serializeUser(employee))
  } catch (error) {
    next(error)
  }
}

export async function updateEmployee(req, res, next) {
  try {
    const { name, email, company, role, active, password } = req.body
    if (role && !['employee', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' })
    const updates = { name, email, company, role, active }
    if (password) updates.passwordHash = await bcrypt.hash(password, 12)

    const employee = await User.findByIdAndUpdate(req.params.id, updates, { new: true })
    if (!employee) return res.status(404).json({ message: 'Employee not found' })
    res.json(serializeUser(employee))
  } catch (error) {
    next(error)
  }
}
