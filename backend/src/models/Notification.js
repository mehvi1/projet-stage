import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    recipientEmail: { type: String, required: true },
    recipientRole: { type: String, enum: ['client', 'employee', 'admin'], required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    ticketPublicId: { type: String },
    channel: { type: String, enum: ['gmail', 'email', 'website'], default: 'gmail' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export const Notification = mongoose.model('Notification', notificationSchema)
