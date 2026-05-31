import { useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Save } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input, PasswordInput } from '../../components/ui/Input'
import { PageHeader } from '../../components/ui/PageHeader'
import { Select } from '../../components/ui/Select'
import { useAuthStore } from '../../store/authStore'
import { languages, useLanguageStore, useTranslation } from '../../store/languageStore'
import { useToastStore } from '../../store/toastStore'

export function ClientSettings() {
  const user = useAuthStore((state) => state.user)
  const updateProfile = useAuthStore((state) => state.updateProfile)
  const resetDemoData = useAuthStore((state) => state.resetDemoData)
  const language = useLanguageStore((state) => state.language)
  const setLanguage = useLanguageStore((state) => state.setLanguage)
  const pushToast = useToastStore((state) => state.pushToast)
  const { t } = useTranslation()
  const [form, setForm] = useState({
    name: user?.name ?? '',
    company: user?.company ?? '',
    email: user?.email ?? '',
    password: '',
    language,
  })
  const [errors, setErrors] = useState({})

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const submit = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = t.required
    if (!form.company.trim()) nextErrors.company = t.required
    if (!form.email.trim()) nextErrors.email = t.required
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = t.invalidEmail
    if (form.password && form.password.length < 6) nextErrors.password = 'Minimum 6 characters'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      pushToast(t.fixFields, 'error')
      return
    }

    try {
      await updateProfile({
        name: form.name,
        company: form.company,
        email: form.email,
        password: form.password,
      })
      setLanguage(form.language)
      setForm((current) => ({ ...current, password: '' }))
      pushToast(t.settingsSaved)
    } catch (error) {
      pushToast(error.message, 'error')
    }
  }

  const resetData = () => {
    if (!window.confirm('Reset local demo data and return to login?')) return
    resetDemoData()
    window.location.assign('/login')
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={t.settingsEyebrow} title={t.settingsTitle} description={t.settingsDescription} />
      <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="space-y-6">
        <Card>
          <h2 className="text-lg font-black text-slate-950 dark:text-white">{t.profileCard}</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Input label={t.fullName} value={form.name} error={errors.name} onChange={(event) => update('name', event.target.value)} />
            <Input label={t.company} value={form.company} error={errors.company} onChange={(event) => update('company', event.target.value)} />
            <Input label={t.email} type="email" value={form.email} error={errors.email} onChange={(event) => update('email', event.target.value)} />
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-black text-slate-950 dark:text-white">{t.passwordCard}</h2>
          <div className="mt-5 max-w-xl">
            <PasswordInput
              label={t.newPassword}
              value={form.password}
              error={errors.password}
              onChange={(event) => update('password', event.target.value)}
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{t.leaveBlank}</p>
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-black text-slate-950 dark:text-white">{t.languageCard}</h2>
          <div className="mt-5 max-w-xl">
            <Select label={t.preferredLanguage} value={form.language} onChange={(event) => update('language', event.target.value)}>
              {languages.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </Select>
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-black text-slate-950 dark:text-white">Demo data</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Clear local demo accounts, tickets, and notifications stored in this browser.</p>
          <Button className="mt-4" variant="danger" onClick={resetData}>
            <RotateCcw className="h-4 w-4" />
            Reset local data
          </Button>
        </Card>
        <div className="flex justify-end">
          <Button type="submit">
            <Save className="h-4 w-4" />
            {t.saveSettings}
          </Button>
        </div>
      </motion.form>
    </div>
  )
}
