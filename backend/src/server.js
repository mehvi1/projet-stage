import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { connectDatabase } from './config/database.js'
import { allowedOrigins, validateEnv } from './config/env.js'
import { authRoutes } from './routes/auth.routes.js'
import { employeeRoutes } from './routes/employee.routes.js'
import { notificationRoutes } from './routes/notification.routes.js'
import { ticketRoutes } from './routes/ticket.routes.js'
import { errorHandler } from './middleware/errorHandler.js'

dotenv.config()
validateEnv()

const app = express()
const origins = allowedOrigins()

app.use(helmet())
app.use(cors({
  origin(origin, callback) {
    if (!origin || origins.includes(origin)) return callback(null, true)
    return callback(new Error(`Origin not allowed by CORS: ${origin}`))
  },
  credentials: true,
}))
app.use(express.json({ limit: '1mb' }))
app.use(morgan('dev'))

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'pbxcom-api' }))
app.use('/api/auth', authRoutes)
app.use('/api/employees', employeeRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/tickets', ticketRoutes)
app.use(errorHandler)

const port = process.env.PORT || 5000

connectDatabase(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => console.log(`PBxcom API running on port ${port}`))
  })
  .catch((error) => {
    console.error('Failed to start PBxcom API:', error.message)
    process.exit(1)
  })
