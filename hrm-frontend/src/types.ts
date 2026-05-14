export type Role = 'admin' | 'user'
export type Route = 'login' | 'admin' | 'user'
export type Tab = 'dashboard' | 'employees' | 'users' | 'leaves' | 'payroll' | 'performance' | 'training'

export interface SessionUser {
  id: string
  fullName: string
  role: Role
  department: string
}

export interface Credentials extends SessionUser {
  password: string
}

export interface UserAccount extends Credentials {
  active: boolean
}

export interface Employee {
  id?: string
  firstName: string
  lastName: string
  department: string
  role: string
  hireDate: string
  status: 'Active' | 'On Leave' | 'Inactive'
}

export interface LeaveRequest {
  id: string
  employeeName: string
  leaveType: 'Annual' | 'Sick' | 'Maternity' | 'Training'
  startDate: string
  endDate: string
  status: 'Pending' | 'Approved' | 'Rejected'
}

export interface PayrollLine {
  id: string
  label: string
  amount: number
}

export interface PayrollRecord {
  id: string
  employeeName: string
  month: string
  baseSalary: number
  bonus: number
  deductions: number
  netPay: number
}

export interface PerformanceMetric {
  label: string
  score: number
  target: number
}

export interface TrainingItem {
  id: string
  title: string
  progress: number
  dueDate: string
}

export interface PerformanceRecord {
  id: string
  employeeName: string
  cycle: string
  score: number
  objective: string
}
