import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { connectDatabase } from '../config/database.js'
import { User } from '../models/User.js'

dotenv.config()

const requiredEnv = ['MONGO_URI', 'ADMIN_NAME', 'ADMIN_EMAIL', 'ADMIN_PASSWORD']
const missingEnv = requiredEnv.filter((key) => !process.env[key])

if (missingEnv.length) {
  console.error(`Missing required environment variables: ${missingEnv.join(', ')}`)
  process.exit(1)
}

try {
  await connectDatabase(process.env.MONGO_URI)

  const email = process.env.ADMIN_EMAIL.toLowerCase().trim()
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12)
  const admin = await User.findOneAndUpdate(
    { email },
    {
      name: process.env.ADMIN_NAME.trim(),
      email,
      passwordHash,
      company: process.env.ADMIN_COMPANY?.trim() || 'PBxcom',
      role: 'admin',
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  )

  console.log(`Admin account ready: ${admin.email}`)
} catch (error) {
  console.error(error)
  process.exitCode = 1
} finally {
  await mongoose.disconnect()
}
