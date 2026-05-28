import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Send } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input, Textarea } from '../../components/ui/Input'
import { PageHeader } from '../../components/ui/PageHeader'
import { Select } from '../../components/ui/Select'
import { getMoroccanCities } from '../../services/moroccanCities'
import { useAuthStore } from '../../store/authStore'
import { useTranslation } from '../../store/languageStore'
import { useNotificationStore } from '../../store/notificationStore'
import { useTicketStore } from '../../store/ticketStore'
import { useToastStore } from '../../store/toastStore'

const initialForm = {
  nom: '',
  prenom: '',
  societes: '',
  nMarche: '',
  nFacture: '',
  telephone: '',
  mail: '',
  ville: '',
  problemDescription: '',
}

const requiredFields = Object.keys(initialForm)
const moroccanCities = getMoroccanCities()

function buildInitialForm(latestTicket) {
  if (!latestTicket?.client) return initialForm
  return { ...initialForm, ...latestTicket.client, problemDescription: '' }
}

function validate(form, t) {
  const errors = {}
  for (const key of requiredFields) {
    if (!form[key].trim()) errors[key] = t.required
  }
  if (form.mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.mail)) errors.mail = t.invalidEmail
  if (form.telephone && !/^\+?[0-9\s-]{8,18}$/.test(form.telephone)) errors.telephone = t.invalidPhone
  return errors
}

export function CreateTicket() {
  const user = useAuthStore((state) => state.user)
  const users = useAuthStore((state) => state.users)
  const allTickets = useTicketStore((state) => state.tickets)
  const latestTicket = allTickets
    .filter((ticket) => ticket.userId === user.id)
    .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt))[0]
  const [form, setForm] = useState(() => buildInitialForm(latestTicket))
  const [errors, setErrors] = useState({})
  const createTicket = useTicketStore((state) => state.createTicket)
  const sendEmailNotification = useNotificationStore((state) => state.sendEmailNotification)
  const pushToast = useToastStore((state) => state.pushToast)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const hasTicketHistory = allTickets.some((ticket) => ticket.userId === user.id)

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const submit = (event) => {
    event.preventDefault()
    const nextErrors = validate(form, t)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      pushToast(t.fixFields, 'error')
      return
    }
    const ticket = createTicket(
      {
        subject: `Client information - ${form.societes}`,
        description: form.problemDescription,
        priority: 'Medium',
        client: {
          nom: form.nom,
          prenom: form.prenom,
          societes: form.societes,
          nMarche: form.nMarche,
          nFacture: form.nFacture,
          telephone: form.telephone,
          mail: form.mail,
          ville: form.ville,
        },
      },
      user.id,
    )
    users
      .filter((account) => account.role === 'admin' || account.role === 'employee')
      .forEach((admin) => {
        sendEmailNotification({
          recipientId: admin.id,
          recipientEmail: admin.email,
          recipientRole: admin.role,
          ticketId: ticket.id,
          subject: `New client ticket ${ticket.id}`,
          message: `${user.name} sent a new problem ticket for ${form.societes}.`,
        })
      })
    setForm({ ...form, problemDescription: '' })
    pushToast(`${t.sentInfo} ${t.reference} ${ticket.id}. Admin email notification sent.`)
    navigate('/client')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t.clientInfoEyebrow}
        title={hasTicketHistory ? t.clientInfoTitle : t.firstTicketTitle}
        description={hasTicketHistory ? t.clientInfoDescription : t.firstTicketDescription}
        action={hasTicketHistory ? <Button as={Link} to="/client" variant="secondary"><ArrowLeft className="h-4 w-4" /> {t.backToHistory}</Button> : null}
      />
      <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit}>
        <Card className="space-y-6">
          {hasTicketHistory ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              {t.savedClientFields}
            </div>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            <Input label={t.nom} value={form.nom} error={errors.nom} required onChange={(event) => update('nom', event.target.value)} />
            <Input label={t.prenom} value={form.prenom} error={errors.prenom} required onChange={(event) => update('prenom', event.target.value)} />
            <Input label={t.societes} value={form.societes} error={errors.societes} required onChange={(event) => update('societes', event.target.value)} />
            <Input label={t.nMarche} value={form.nMarche} error={errors.nMarche} required onChange={(event) => update('nMarche', event.target.value)} />
            <Input label={t.nFacture} value={form.nFacture} error={errors.nFacture} required onChange={(event) => update('nFacture', event.target.value)} />
            <Input label={t.telephone} value={form.telephone} error={errors.telephone} required onChange={(event) => update('telephone', event.target.value)} />
            <Input label={t.mail} type="email" value={form.mail} error={errors.mail} required onChange={(event) => update('mail', event.target.value)} />
            <Select label={t.ville} value={form.ville} error={errors.ville} required onChange={(event) => update('ville', event.target.value)}>
              <option value="">{t.chooseCity}</option>
              {moroccanCities.map((city) => <option key={city} value={city}>{city}</option>)}
            </Select>
          </div>
          <Textarea
            label={t.problemDescription}
            value={form.problemDescription}
            error={errors.problemDescription}
            required
            onChange={(event) => update('problemDescription', event.target.value)}
            placeholder={t.problemDescriptionPlaceholder}
          />
          <div className="flex justify-end">
            <Button type="submit">
              <Send className="h-4 w-4" />
              {t.submitInformation}
            </Button>
          </div>
        </Card>
      </motion.form>
    </div>
  )
}
