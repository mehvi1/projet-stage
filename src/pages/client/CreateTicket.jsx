import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { PageHeader } from '../../components/ui/PageHeader'
import { useAuthStore } from '../../store/authStore'
import { useTranslation } from '../../store/languageStore'
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
}

function validate(form, t) {
  const errors = {}
  for (const key of Object.keys(initialForm)) {
    if (!form[key].trim()) errors[key] = t.required
  }
  if (form.mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.mail)) errors.mail = t.invalidEmail
  if (form.telephone && !/^\+?[0-9\s-]{8,18}$/.test(form.telephone)) errors.telephone = t.invalidPhone
  return errors
}

export function CreateTicket() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const user = useAuthStore((state) => state.user)
  const createTicket = useTicketStore((state) => state.createTicket)
  const pushToast = useToastStore((state) => state.pushToast)
  const { t } = useTranslation()

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
        description: `Client information submitted by ${form.prenom} ${form.nom} from ${form.societes}.`,
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
    setForm(initialForm)
    pushToast(`${t.sentInfo} ${t.reference} ${ticket.id}.`)
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={t.clientInfoEyebrow} title={t.clientInfoTitle} description={t.clientInfoDescription} />
      <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit}>
        <Card className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label={t.nom} value={form.nom} error={errors.nom} onChange={(event) => update('nom', event.target.value)} />
            <Input label={t.prenom} value={form.prenom} error={errors.prenom} onChange={(event) => update('prenom', event.target.value)} />
            <Input label={t.societes} value={form.societes} error={errors.societes} onChange={(event) => update('societes', event.target.value)} />
            <Input label={t.nMarche} value={form.nMarche} error={errors.nMarche} onChange={(event) => update('nMarche', event.target.value)} />
            <Input label={t.nFacture} value={form.nFacture} error={errors.nFacture} onChange={(event) => update('nFacture', event.target.value)} />
            <Input label={t.telephone} value={form.telephone} error={errors.telephone} onChange={(event) => update('telephone', event.target.value)} />
            <Input label={t.mail} type="email" value={form.mail} error={errors.mail} onChange={(event) => update('mail', event.target.value)} />
            <Input label={t.ville} value={form.ville} error={errors.ville} onChange={(event) => update('ville', event.target.value)} />
          </div>
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
