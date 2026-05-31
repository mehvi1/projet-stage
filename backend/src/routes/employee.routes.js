import { Router } from 'express'
import { createEmployee, listEmployees, updateEmployee } from '../controllers/employee.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

export const employeeRoutes = Router()

employeeRoutes.use(requireAuth, requireRole('admin'))
employeeRoutes.get('/', listEmployees)
employeeRoutes.post('/', createEmployee)
employeeRoutes.patch('/:id', updateEmployee)
