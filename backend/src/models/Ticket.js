import mongoose from 'mongoose'

const historySchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    actor: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false },
)

const clientSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    societes: { type: String, required: true },
    nMarche: { type: String, required: true },
    nFacture: { type: String, required: true },
    telephone: { type: String, required: true },
    mail: { type: String, required: true },
    ville: { type: String, required: true },
  },
  { _id: false },
)

const ticketSchema = new mongoose.Schema(
  {
    publicId: { type: String, unique: true, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    status: {
      type: String,
      enum: ['Pending', 'Seen', 'In Progress', 'Resolved', 'Closed'],
      default: 'Pending',
    },
    client: { type: clientSchema, required: true },
    history: { type: [historySchema], default: [] },
    notes: { type: [String], default: [] },
  },
  { timestamps: true },
)

export const Ticket = mongoose.model('Ticket', ticketSchema)
