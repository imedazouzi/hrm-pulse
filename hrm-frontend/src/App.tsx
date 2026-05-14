import { useEffect, useMemo, useState } from 'react'
import { getSession, clearSession, saveSession } from './auth/session'
import { getAccounts, saveAccounts } from './auth/accounts'
import { AppShell } from './components/AppShell'
import {
  seedEmployees,
  seedLeaveRequests,
  seedPayrollRecords,
  seedPerformanceRecords,
  seedTrainings,
} from './data/mockData'
import { AdminDashboard } from './pages/AdminDashboard'
import { LoginPage } from './pages/LoginPage'
import { UserDashboard } from './pages/UserDashboard'
import type {
  Employee,
  LeaveRequest,
  PayrollRecord,
  PerformanceRecord,
  SessionUser,
  TrainingItem,
  UserAccount,
} from './types'

type Route = 'login' | 'admin' | 'user'
type Tab = 'dashboard' | 'employees' | 'users' | 'leaves' | 'payroll' | 'performance' | 'training'
const adminTabs: Tab[] = ['dashboard', 'employees', 'users', 'leaves', 'payroll', 'performance', 'training']
const userTabs: Tab[] = ['dashboard', 'leaves', 'payroll', 'performance', 'training']

function readLocation() {
  const hash = window.location.hash || '#/login'
  const [routePart, queryPart = ''] = hash.replace(/^#\/?/, '').split('?')
  const route = (routePart || 'login') as Route
  const params = new URLSearchParams(queryPart)
  const tab = (params.get('tab') || 'dashboard') as Tab

  return { hash, route, tab }
}

function App() {
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(() => getSession())
  const [employees, setEmployees] = useState<Employee[]>(seedEmployees)
  const [accounts, setAccounts] = useState<UserAccount[]>(() => getAccounts())
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(seedLeaveRequests)
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(seedPayrollRecords)
  const [performanceRecords, setPerformanceRecords] = useState<PerformanceRecord[]>(seedPerformanceRecords)
  const [trainings, setTrainings] = useState<TrainingItem[]>(seedTrainings)
  const [locationState, setLocationState] = useState(() => readLocation())

  useEffect(() => {
    const handler = () => setLocationState(readLocation())
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  useEffect(() => {
    saveAccounts(accounts)
  }, [accounts])

  useEffect(() => {
    if (!sessionUser) {
      return
    }

    const matched = accounts.find((account) => account.id === sessionUser.id)
    if (!matched || !matched.active) {
      clearSession()
      setSessionUser(null)
      window.location.hash = '#/login'
    }
  }, [accounts, sessionUser])

  useEffect(() => {
    if (!sessionUser) {
      window.location.hash = '#/login'
      return
    }

    if (sessionUser.role === 'admin') {
      if (locationState.route !== 'admin') {
        window.location.hash = '#/admin?tab=dashboard'
      }
    } else if (sessionUser.role === 'user' && locationState.route !== 'user') {
      window.location.hash = '#/user?tab=dashboard'
    }
  }, [locationState.route, sessionUser])

  const myLeaves = useMemo(() => {
    if (!sessionUser) {
      return []
    }
    return leaveRequests.filter((item) => item.employeeName === sessionUser.fullName)
  }, [leaveRequests, sessionUser])

  function login(user: SessionUser) {
    saveSession(user)
    setSessionUser(user)
    window.location.hash = user.role === 'admin' ? '#/admin?tab=dashboard' : '#/user?tab=dashboard'
  }

  function logout() {
    clearSession()
    setSessionUser(null)
    window.location.hash = '#/login'
  }

  function onLeaveDecision(leaveId: string, status: 'Approved' | 'Rejected') {
    setLeaveRequests((previous) =>
      previous.map((item) => (item.id === leaveId ? { ...item, status } : item)),
    )
  }

  function onLeaveRequest(leaveType: LeaveRequest['leaveType'], startDate: string, endDate: string) {
    if (!sessionUser) {
      return
    }

    const leave: LeaveRequest = {
      id: crypto.randomUUID(),
      employeeName: sessionUser.fullName,
      leaveType,
      startDate,
      endDate,
      status: 'Pending',
    }

    setLeaveRequests((previous) => [leave, ...previous])
  }

  function onEmployeeUpdated(employeeId: string, patch: Partial<Employee>) {
    setEmployees((previous) =>
      previous.map((employee) => (employee.id === employeeId ? { ...employee, ...patch } : employee)),
    )
  }

  function onEmployeeDeleted(employeeId: string) {
    setEmployees((previous) => previous.filter((employee) => employee.id !== employeeId))
  }

  function onPayrollSaved(record: PayrollRecord) {
    setPayrollRecords((previous) => {
      const exists = previous.some((item) => item.id === record.id)
      return exists ? previous.map((item) => (item.id === record.id ? record : item)) : [record, ...previous]
    })
  }

  function onPayrollDeleted(recordId: string) {
    setPayrollRecords((previous) => previous.filter((record) => record.id !== recordId))
  }

  function onPerformanceSaved(record: PerformanceRecord) {
    setPerformanceRecords((previous) => {
      const exists = previous.some((item) => item.id === record.id)
      return exists ? previous.map((item) => (item.id === record.id ? record : item)) : [record, ...previous]
    })
  }

  function onPerformanceDeleted(recordId: string) {
    setPerformanceRecords((previous) => previous.filter((record) => record.id !== recordId))
  }

  function onTrainingSaved(item: TrainingItem) {
    setTrainings((previous) => {
      const exists = previous.some((training) => training.id === item.id)
      return exists ? previous.map((training) => (training.id === item.id ? item : training)) : [item, ...previous]
    })
  }

  function onTrainingDeleted(trainingId: string) {
    setTrainings((previous) => previous.filter((training) => training.id !== trainingId))
  }

  function onEmployeeCreated(employee: Employee) {
    setEmployees((previous) => [employee, ...previous])
  }

  function onAccountSaved(account: UserAccount) {
    setAccounts((previous) => {
      const exists = previous.some((item) => item.id === account.id)
      return exists ? previous.map((item) => (item.id === account.id ? account : item)) : [account, ...previous]
    })
  }

  function onAccountDeleted(accountId: string) {
    setAccounts((previous) => previous.filter((account) => account.id !== accountId))
  }

  function onAccountToggled(accountId: string, active: boolean) {
    setAccounts((previous) => previous.map((account) => (account.id === accountId ? { ...account, active } : account)))
  }

  if (!sessionUser) {
    return <LoginPage onLogin={login} users={accounts} />
  }

  const isAdmin = sessionUser.role === 'admin'
  const currentTab = isAdmin
    ? (adminTabs.includes(locationState.tab) ? locationState.tab : 'dashboard')
    : (userTabs.includes(locationState.tab) ? locationState.tab : 'dashboard')

  return (
    <AppShell
      user={sessionUser}
      onLogout={logout}
      currentRoute={locationState.route}
      currentTab={currentTab}
      onNavigate={(nextRoute, nextTab) => {
        const tab = nextTab || 'dashboard'
        window.location.hash = `#/${nextRoute}?tab=${tab}`
      }}
    >
      {isAdmin ? (
        <AdminDashboard
          employees={employees}
          leaveRequests={leaveRequests}
          payrollRecords={payrollRecords}
          performanceRecords={performanceRecords}
          trainings={trainings}
          accounts={accounts}
          activeTab={currentTab}
          onLeaveDecision={onLeaveDecision}
          onEmployeeCreated={onEmployeeCreated}
          onEmployeeUpdated={onEmployeeUpdated}
          onEmployeeDeleted={onEmployeeDeleted}
          onPayrollSaved={onPayrollSaved}
          onPayrollDeleted={onPayrollDeleted}
          onPerformanceSaved={onPerformanceSaved}
          onPerformanceDeleted={onPerformanceDeleted}
          onTrainingSaved={onTrainingSaved}
          onTrainingDeleted={onTrainingDeleted}
          onAccountSaved={onAccountSaved}
          onAccountDeleted={onAccountDeleted}
          onAccountToggled={onAccountToggled}
        />
      ) : (
        <UserDashboard
          user={sessionUser}
          leaveRequests={myLeaves}
          activeTab={currentTab}
          onLeaveRequest={onLeaveRequest}
        />
      )}
    </AppShell>
  )
}

export default App
