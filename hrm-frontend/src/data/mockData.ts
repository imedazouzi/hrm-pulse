import type {
  Employee,
  LeaveRequest,
  PayrollLine,
  PayrollRecord,
  PerformanceMetric,
  PerformanceRecord,
  TrainingItem,
  UserAccount,
} from '../types'

export const defaultUsers: UserAccount[] = [
  {
    id: 'admin-01',
    fullName: 'Imed Azouzi',
    role: 'admin',
    department: 'Human Resources',
    password: '123456',
    active: true,
  },
  {
    id: 'user-14',
    fullName: 'Yassine Benali',
    role: 'user',
    department: 'Engineering',
    password: '123456',
    active: true,
  },
]

export const seedEmployees: Employee[] = [
  {
    id: 'emp-100',
    firstName: 'Amina',
    lastName: 'Rahmani',
    department: 'Human Resources',
    role: 'HR Manager',
    hireDate: '2020-03-12',
    status: 'Active',
  },
  {
    id: 'emp-101',
    firstName: 'Yassine',
    lastName: 'Benali',
    department: 'Engineering',
    role: 'Software Engineer',
    hireDate: '2022-08-01',
    status: 'Active',
  },
  {
    id: 'emp-102',
    firstName: 'Nora',
    lastName: 'Lahlou',
    department: 'Finance',
    role: 'Payroll Specialist',
    hireDate: '2021-01-20',
    status: 'On Leave',
  },
]

export const seedLeaveRequests: LeaveRequest[] = [
  {
    id: 'lv-01',
    employeeName: 'Yassine Benali',
    leaveType: 'Annual',
    startDate: '2026-06-10',
    endDate: '2026-06-15',
    status: 'Pending',
  },
  {
    id: 'lv-02',
    employeeName: 'Nora Lahlou',
    leaveType: 'Sick',
    startDate: '2026-05-08',
    endDate: '2026-05-12',
    status: 'Approved',
  },
  {
    id: 'lv-03',
    employeeName: 'Imed Azouzi',
    leaveType: 'Training',
    startDate: '2026-06-18',
    endDate: '2026-06-19',
    status: 'Pending',
  },
]

export const seedPayroll: PayrollLine[] = [
  { id: 'pay-1', label: 'Base Salary', amount: 1800 },
  { id: 'pay-2', label: 'Bonus', amount: 300 },
  { id: 'pay-3', label: 'Tax', amount: -290 },
  { id: 'pay-4', label: 'Social Security', amount: -140 },
]

export const seedPerformance: PerformanceMetric[] = [
  { label: 'Technical Skills', score: 84, target: 90 },
  { label: 'Team Work', score: 92, target: 90 },
  { label: 'Delivery Discipline', score: 78, target: 85 },
  { label: 'Communication', score: 88, target: 85 },
]

export const seedTrainings: TrainingItem[] = [
  { id: 'tr-1', title: 'Leadership for Engineers', progress: 60, dueDate: '2026-06-01' },
  { id: 'tr-2', title: 'Advanced Spring Security', progress: 40, dueDate: '2026-06-21' },
  { id: 'tr-3', title: 'Data Privacy (GDPR)', progress: 85, dueDate: '2026-05-30' },
]

export const seedPayrollRecords: PayrollRecord[] = [
  {
    id: 'pr-1',
    employeeName: 'Yassine Benali',
    month: '2026-05',
    baseSalary: 2200,
    bonus: 200,
    deductions: 310,
    netPay: 2090,
  },
  {
    id: 'pr-2',
    employeeName: 'Nora Lahlou',
    month: '2026-05',
    baseSalary: 2400,
    bonus: 350,
    deductions: 420,
    netPay: 2330,
  },
]

export const seedPerformanceRecords: PerformanceRecord[] = [
  {
    id: 'pe-1',
    employeeName: 'Yassine Benali',
    cycle: 'Q2-2026',
    score: 86,
    objective: 'Improve delivery speed',
  },
  {
    id: 'pe-2',
    employeeName: 'Nora Lahlou',
    cycle: 'Q2-2026',
    score: 91,
    objective: 'Automate salary reports',
  },
]
