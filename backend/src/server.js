import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { connectDatabase } from './config/database.js'
import { authRoutes } from './routes/auth.routes.js'
import { ticketRoutes } from './routes/ticket.routes.js'
import { errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(morgan('dev'))

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'pbxcom-api' }))
app.use('/api/auth', authRoutes)
app.use('/api/tickets', ticketRoutes)
app.use(errorHandler)

const port = process.env.PORT || 5000

connectDatabase(process.env.MONGO_URI).then(() => {
  app.listen(port, () => console.log(`PBxcom API running on port ${port}`))
})
