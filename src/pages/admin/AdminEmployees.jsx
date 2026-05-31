import { useEffect, useState } from 'react'
import { ShieldCheck, UserPlus } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input, PasswordInput } from '../../components/ui/Input'
import { PageHeader } from '../../components/ui/PageHeader'
import { Select } from '../../components/ui/Select'
import { api, apiMessage } from '../../services/api'
import { useToastStore } from '../../store/toastStore'

const emptyForm = { name: '', email: '', company: 'PBxcom', password: '', role: 'employee' }

export function AdminEmployees() {
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState(emptyForm)
  const pushToast = useToastStore((state) => state.pushToast)

  useEffect(() => {
    let ignore = false
    api.get('/employees')
      .then(({ data }) => {
        if (!ignore) setEmployees(data)
      })
      .catch((error) => {
        if (!ignore) pushToast(apiMessage(error, 'Unable to load employees.'), 'error')
      })
    return () => {
      ignore = true
    }
  }, [pushToast])

  const createEmployee = async (event) => {
    event.preventDefault()
    try {
      const { data } = await api.post('/employees', form)
      setEmployees((current) => [data, ...current])
      setForm(emptyForm)
      pushToast('Employee account created.')
    } catch (error) {
      pushToast(apiMessage(error, 'Unable to create employee.'), 'error')
    }
  }

  const toggleEmployee = async (employee) => {
    if (!window.confirm(`${employee.active ? 'Deactivate' : 'Activate'} ${employee.name}?`)) return
    try {
      const { data } = await api.patch(`/employees/${employee.id}`, { active: !employee.active })
      setEmployees((current) => current.map((item) => (item.id === data.id ? data : item)))
      pushToast('Employee status updated.')
    } catch (error) {
      pushToast(apiMessage(error, 'Unable to update employee.'), 'error')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin settings"
        title="Employee management"
        description="Create support accounts and deactivate access when someone leaves the team."
      />
      <Card>
        <form onSubmit={createEmployee} className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Input label="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <Input label="Company" value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} required />
          <PasswordInput label="Password" minLength={6} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          <Select label="Role" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </Select>
          <div className="md:col-span-2 xl:col-span-5">
            <Button type="submit">
              <UserPlus className="h-4 w-4" />
              Create employee
            </Button>
          </div>
        </form>
      </Card>
      <div className="grid gap-3">
        {employees.map((employee) => (
          <Card key={employee.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-black text-slate-950 dark:text-white">{employee.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{employee.email}</p>
                <p className="mt-1 text-xs font-bold uppercase text-slate-400">{employee.role} · {employee.active ? 'Active' : 'Inactive'}</p>
              </div>
              <Button variant={employee.active ? 'danger' : 'secondary'} onClick={() => toggleEmployee(employee)}>
                <ShieldCheck className="h-4 w-4" />
                {employee.active ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
