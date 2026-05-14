import { useMemo, useState, type FormEvent } from 'react'
import { createEmployee } from '../api/employeeApi'
import type {
  Employee,
  LeaveRequest,
  PayrollRecord,
  PerformanceRecord,
  TrainingItem,
  UserAccount,
} from '../types'

interface AdminDashboardProps {
  employees: Employee[]
  leaveRequests: LeaveRequest[]
  payrollRecords: PayrollRecord[]
  performanceRecords: PerformanceRecord[]
  trainings: TrainingItem[]
  accounts: UserAccount[]
  activeTab: 'dashboard' | 'employees' | 'users' | 'leaves' | 'payroll' | 'performance' | 'training'
  onLeaveDecision: (leaveId: string, status: 'Approved' | 'Rejected') => void
  onEmployeeCreated: (employee: Employee) => void
  onEmployeeUpdated: (employeeId: string, patch: Partial<Employee>) => void
  onEmployeeDeleted: (employeeId: string) => void
  onPayrollSaved: (record: PayrollRecord) => void
  onPayrollDeleted: (recordId: string) => void
  onPerformanceSaved: (record: PerformanceRecord) => void
  onPerformanceDeleted: (recordId: string) => void
  onTrainingSaved: (item: TrainingItem) => void
  onTrainingDeleted: (trainingId: string) => void
  onAccountSaved: (account: UserAccount) => void
  onAccountDeleted: (accountId: string) => void
  onAccountToggled: (accountId: string, active: boolean) => void
}

const emptyEmployee = {
  firstName: '',
  lastName: '',
  department: '',
  role: '',
  hireDate: '',
  status: 'Active' as const,
}

type EmployeeFormState = {
  firstName: string
  lastName: string
  department: string
  role: string
  hireDate: string
  status: Employee['status']
}

export function AdminDashboard({
  employees,
  leaveRequests,
  payrollRecords,
  performanceRecords,
  trainings,
  accounts,
  activeTab,
  onLeaveDecision,
  onEmployeeCreated,
  onEmployeeUpdated,
  onEmployeeDeleted,
  onPayrollSaved,
  onPayrollDeleted,
  onPerformanceSaved,
  onPerformanceDeleted,
  onTrainingSaved,
  onTrainingDeleted,
  onAccountSaved,
  onAccountDeleted,
  onAccountToggled,
}: AdminDashboardProps) {
  const [employeeId, setEmployeeId] = useState<string | null>(null)
  const [employeeForm, setEmployeeForm] = useState<EmployeeFormState>(emptyEmployee)
  const [apiMessage, setApiMessage] = useState('')
  const [payrollForm, setPayrollForm] = useState({ employeeName: '', month: '2026-05', baseSalary: 0, bonus: 0, deductions: 0 })
  const [performanceForm, setPerformanceForm] = useState({ employeeName: '', cycle: 'Q2-2026', score: 80, objective: '' })
  const [trainingForm, setTrainingForm] = useState({ title: '', progress: 0, dueDate: '' })
  const [accountId, setAccountId] = useState<string | null>(null)
  const [accountForm, setAccountForm] = useState({
    fullName: 'Nouveau compte',
    department: 'Human Resources',
    role: 'user' as 'admin' | 'user',
    password: '123456',
    active: true,
  })

  const pendingLeaves = leaveRequests.filter((item) => item.status === 'Pending').length
  const activeEmployees = employees.filter((item) => item.status === 'Active').length
  const totalNetPayroll = payrollRecords.reduce((sum, record) => sum + record.netPay, 0)

  const departmentStats = useMemo(() => {
    const entries = new Map<string, number>()
    for (const employee of employees) {
      entries.set(employee.department, (entries.get(employee.department) || 0) + 1)
    }
    return Array.from(entries.entries()).sort((a, b) => b[1] - a[1])
  }, [employees])

  async function submitEmployee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setApiMessage(employeeId ? 'Mise à jour en cours...' : 'Création en cours...')

    const payload = {
      firstName: employeeForm.firstName,
      lastName: employeeForm.lastName,
    }

    try {
      let resolvedId = employeeId

      if (!resolvedId) {
        const created = await createEmployee(payload)
        resolvedId = created.id
        onEmployeeCreated({
          id: created.id,
          firstName: created.firstName,
          lastName: created.lastName,
          department: employeeForm.department || 'Non attribué',
          role: employeeForm.role || 'Nouveau',
          hireDate: employeeForm.hireDate || new Date().toISOString().slice(0, 10),
          status: employeeForm.status,
        })
        setApiMessage(`Employé créé: ${created.firstName} ${created.lastName}`)
      } else {
        onEmployeeUpdated(resolvedId, {
          ...employeeForm,
          department: employeeForm.department || 'Non attribué',
          role: employeeForm.role || 'Employé',
          hireDate: employeeForm.hireDate || new Date().toISOString().slice(0, 10),
        })
        setApiMessage(`Employé mis à jour: ${employeeForm.firstName} ${employeeForm.lastName}`)
      }

      setEmployeeId(null)
      setEmployeeForm(emptyEmployee)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur API inconnue'
      setApiMessage(`Erreur backend: ${errorMessage}`)
    }
  }

  function editEmployee(employee: Employee) {
    setEmployeeId(employee.id || null)
    setEmployeeForm({
      firstName: employee.firstName,
      lastName: employee.lastName,
      department: employee.department,
      role: employee.role,
      hireDate: employee.hireDate,
      status: employee.status,
    })
  }

  function submitPayroll(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const netPay = payrollForm.baseSalary + payrollForm.bonus - payrollForm.deductions
    onPayrollSaved({
      id: `${payrollForm.employeeName}-${payrollForm.month}`,
      employeeName: payrollForm.employeeName,
      month: payrollForm.month,
      baseSalary: payrollForm.baseSalary,
      bonus: payrollForm.bonus,
      deductions: payrollForm.deductions,
      netPay,
    })
    setPayrollForm({ employeeName: '', month: '2026-05', baseSalary: 0, bonus: 0, deductions: 0 })
  }

  function submitPerformance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onPerformanceSaved({
      id: `${performanceForm.employeeName}-${performanceForm.cycle}`,
      employeeName: performanceForm.employeeName,
      cycle: performanceForm.cycle,
      score: performanceForm.score,
      objective: performanceForm.objective,
    })
    setPerformanceForm({ employeeName: '', cycle: 'Q2-2026', score: 80, objective: '' })
  }

  function submitTraining(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onTrainingSaved({
      id: `${trainingForm.title}-${trainingForm.dueDate}`,
      title: trainingForm.title,
      progress: trainingForm.progress,
      dueDate: trainingForm.dueDate,
    })
    setTrainingForm({ title: '', progress: 0, dueDate: '' })
  }

  function submitAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    onAccountSaved({
      id: accountId || crypto.randomUUID(),
      fullName: accountForm.fullName,
      department: accountForm.department,
      role: accountForm.role,
      password: accountForm.password,
      active: accountForm.active,
    })

    setAccountId(null)
    setAccountForm({ fullName: 'Nouveau compte', department: 'Human Resources', role: 'user', password: '123456', active: true })
  }

  function editAccount(account: UserAccount) {
    setAccountId(account.id)
    setAccountForm({
      fullName: account.fullName,
      department: account.department,
      role: account.role,
      password: account.password,
      active: account.active,
    })
  }

  return (
    <section className="panel-grid">
      <header className="hero-panel">
        <p className="eyebrow">Espace administrateur</p>
        <h2>Gestion du personnel, de la paie et des performances</h2>
        <div className="kpi-row">
          <article>
            <strong>{employees.length}</strong>
            <span>Total employés</span>
          </article>
          <article>
            <strong>{activeEmployees}</strong>
            <span>Employés actifs</span>
          </article>
          <article>
            <strong>{pendingLeaves}</strong>
            <span>Congés en attente</span>
          </article>
          <article>
            <strong>{totalNetPayroll} EUR</strong>
            <span>Paie nette totale</span>
          </article>
        </div>
      </header>

      {activeTab === 'dashboard' && (
        <section className="card wide-card">
          <h3>Accueil admin</h3>
          <p className="hint">Choisissez une section dans le menu de gauche pour ouvrir les employés, les congés, la paie, la performance ou la formation.</p>
        </section>
      )}

      {activeTab === 'employees' && (
        <section className="card wide-card">
          <h3>Gestion des employés</h3>
          <form className="stack-form" onSubmit={submitEmployee}>
            <div className="inline-form four-cols">
              <input value={employeeForm.firstName} onChange={(event) => setEmployeeForm((previous) => ({ ...previous, firstName: event.target.value }))} placeholder="Prénom" required />
              <input value={employeeForm.lastName} onChange={(event) => setEmployeeForm((previous) => ({ ...previous, lastName: event.target.value }))} placeholder="Nom" required />
              <input value={employeeForm.department} onChange={(event) => setEmployeeForm((previous) => ({ ...previous, department: event.target.value }))} placeholder="Département" />
              <input value={employeeForm.role} onChange={(event) => setEmployeeForm((previous) => ({ ...previous, role: event.target.value }))} placeholder="Poste" />
            </div>
            <div className="inline-form four-cols">
              <input type="date" value={employeeForm.hireDate} onChange={(event) => setEmployeeForm((previous) => ({ ...previous, hireDate: event.target.value }))} />
              <select value={employeeForm.status} onChange={(event) => setEmployeeForm((previous) => ({ ...previous, status: event.target.value as Employee['status'] }))}>
                <option value="Active">Actif</option>
                <option value="On Leave">En congé</option>
                <option value="Inactive">Inactif</option>
              </select>
              <button type="submit">{employeeId ? 'Mettre à jour' : 'Créer un employé'}</button>
              <button type="button" className="ghost-btn" onClick={() => { setEmployeeId(null); setEmployeeForm(emptyEmployee) }}>Réinitialiser</button>
            </div>
          </form>
          {apiMessage && <p className="hint">{apiMessage}</p>}
          <div className="table-like">
            {employees.map((employee) => (
              <article className="list-item" key={employee.id}>
                <div>
                  <strong>{employee.firstName} {employee.lastName}</strong>
                  <p>{employee.role} · {employee.department} · {employee.status}</p>
                </div>
                <div className="actions">
                  <button type="button" onClick={() => editEmployee(employee)}>Modifier</button>
                  <button type="button" className="danger" onClick={() => employee.id && onEmployeeDeleted(employee.id)}>Supprimer</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'users' && (
        <section className="card wide-card">
          <h3>Comptes utilisateurs</h3>
          <form className="stack-form" onSubmit={submitAccount}>
            <div className="inline-form four-cols">
              <input value={accountForm.fullName} onChange={(event) => setAccountForm((previous) => ({ ...previous, fullName: event.target.value }))} placeholder="Nom complet" required />
              <input value={accountForm.department} onChange={(event) => setAccountForm((previous) => ({ ...previous, department: event.target.value }))} placeholder="Département" required />
              <input value={accountForm.password} onChange={(event) => setAccountForm((previous) => ({ ...previous, password: event.target.value }))} placeholder="Mot de passe" required />
              <select value={accountForm.role} onChange={(event) => setAccountForm((previous) => ({ ...previous, role: event.target.value as 'admin' | 'user' }))}>
                <option value="admin">Admin</option>
                <option value="user">Employé</option>
              </select>
            </div>
            <div className="inline-form four-cols">
              <label className="toggle-label">
                <input type="checkbox" checked={accountForm.active} onChange={(event) => setAccountForm((previous) => ({ ...previous, active: event.target.checked }))} />
                Compte actif
              </label>
              <button type="submit">{accountId ? 'Mettre à jour' : 'Créer le compte'}</button>
              <button type="button" className="ghost-btn" onClick={() => { setAccountId(null); setAccountForm({ fullName: 'Nouveau compte', department: 'Human Resources', role: 'user', password: '123456', active: true }) }}>Réinitialiser</button>
            </div>
          </form>

          <div className="table-like">
            {accounts.map((account) => (
              <article className="list-item" key={account.id}>
                <div>
                  <strong>{account.fullName}</strong>
                  <p>{account.department} · {account.role === 'admin' ? 'Admin' : 'Employé'} · {account.active ? 'Actif' : 'Désactivé'}</p>
                </div>
                <div className="actions">
                  <span className={`badge ${account.active ? 'badge-admin' : 'badge-user'}`}>{account.active ? 'Actif' : 'Inactif'}</span>
                  <button type="button" onClick={() => editAccount(account)}>Modifier</button>
                  <button type="button" onClick={() => onAccountToggled(account.id, !account.active)}>{account.active ? 'Désactiver' : 'Activer'}</button>
                  <button type="button" className="danger" onClick={() => onAccountDeleted(account.id)}>Supprimer</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'leaves' && (
        <section className="card">
          <h3>Demandes de congé</h3>
          <div className="list">
            {leaveRequests.map((leave) => (
              <article className="list-item" key={leave.id}>
                <div>
                  <strong>{leave.employeeName}</strong>
                  <p>{leave.leaveType} · {leave.startDate} au {leave.endDate}</p>
                </div>
                <div className="actions">
                  <span className={`badge status-${leave.status.toLowerCase()}`}>{leave.status}</span>
                  {leave.status === 'Pending' && (
                    <>
                      <button type="button" onClick={() => onLeaveDecision(leave.id, 'Approved')}>Approuver</button>
                      <button type="button" className="danger" onClick={() => onLeaveDecision(leave.id, 'Rejected')}>Rejeter</button>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'payroll' && (
        <section className="card">
          <h3>Paie</h3>
          <form className="stack-form" onSubmit={submitPayroll}>
            <div className="inline-form four-cols">
              <input value={payrollForm.employeeName} onChange={(event) => setPayrollForm((previous) => ({ ...previous, employeeName: event.target.value }))} placeholder="Nom de l'employé" required />
              <input value={payrollForm.month} onChange={(event) => setPayrollForm((previous) => ({ ...previous, month: event.target.value }))} placeholder="Mois" required />
              <input type="number" value={payrollForm.baseSalary} onChange={(event) => setPayrollForm((previous) => ({ ...previous, baseSalary: Number(event.target.value) }))} placeholder="Salaire de base" />
              <input type="number" value={payrollForm.bonus} onChange={(event) => setPayrollForm((previous) => ({ ...previous, bonus: Number(event.target.value) }))} placeholder="Prime" />
            </div>
            <div className="inline-form four-cols">
              <input type="number" value={payrollForm.deductions} onChange={(event) => setPayrollForm((previous) => ({ ...previous, deductions: Number(event.target.value) }))} placeholder="Retenues" />
              <div className="ghost-box">Net: {payrollForm.baseSalary + payrollForm.bonus - payrollForm.deductions}</div>
              <button type="submit">Enregistrer</button>
            </div>
          </form>
          <div className="table-like">
            {payrollRecords.map((record) => (
              <article className="list-item" key={record.id}>
                <div>
                  <strong>{record.employeeName}</strong>
                  <p>{record.month} · Base {record.baseSalary} · Prime {record.bonus} · Retenues {record.deductions}</p>
                </div>
                <div className="actions">
                  <span className="badge">Net {record.netPay}</span>
                  <button type="button" className="danger" onClick={() => onPayrollDeleted(record.id)}>Supprimer</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'performance' && (
        <section className="card">
          <h3>Performance</h3>
          <form className="stack-form" onSubmit={submitPerformance}>
            <div className="inline-form four-cols">
              <input value={performanceForm.employeeName} onChange={(event) => setPerformanceForm((previous) => ({ ...previous, employeeName: event.target.value }))} placeholder="Nom de l'employé" required />
              <input value={performanceForm.cycle} onChange={(event) => setPerformanceForm((previous) => ({ ...previous, cycle: event.target.value }))} placeholder="Cycle" />
              <input type="number" value={performanceForm.score} onChange={(event) => setPerformanceForm((previous) => ({ ...previous, score: Number(event.target.value) }))} placeholder="Score" />
              <input value={performanceForm.objective} onChange={(event) => setPerformanceForm((previous) => ({ ...previous, objective: event.target.value }))} placeholder="Objectif" required />
            </div>
            <button type="submit">Enregistrer</button>
          </form>
          <div className="table-like">
            {performanceRecords.map((record) => (
              <article className="list-item" key={record.id}>
                <div>
                  <strong>{record.employeeName}</strong>
                  <p>{record.cycle} · Score {record.score} · {record.objective}</p>
                </div>
                <div className="actions">
                  <span className="badge status-approved">Enregistré</span>
                  <button type="button" className="danger" onClick={() => onPerformanceDeleted(record.id)}>Supprimer</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'training' && (
        <section className="card">
          <h3>Formation</h3>
          <form className="stack-form" onSubmit={submitTraining}>
            <div className="inline-form four-cols">
              <input value={trainingForm.title} onChange={(event) => setTrainingForm((previous) => ({ ...previous, title: event.target.value }))} placeholder="Titre de la formation" required />
              <input type="number" value={trainingForm.progress} onChange={(event) => setTrainingForm((previous) => ({ ...previous, progress: Number(event.target.value) }))} placeholder="Progression %" />
              <input type="date" value={trainingForm.dueDate} onChange={(event) => setTrainingForm((previous) => ({ ...previous, dueDate: event.target.value }))} required />
              <button type="submit">Enregistrer</button>
            </div>
          </form>
          <div className="list">
            {trainings.map((training) => (
              <article className="list-item" key={training.id}>
                <div>
                  <strong>{training.title}</strong>
                  <p>Échéance : {training.dueDate}</p>
                </div>
                <div className="actions">
                  <span className="badge">{training.progress}%</span>
                  <button type="button" className="danger" onClick={() => onTrainingDeleted(training.id)}>Supprimer</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'dashboard' && (
        <section className="card">
          <h3>Répartition par département</h3>
          <div className="bar-list">
            {departmentStats.map(([department, count]) => (
              <div key={department}>
                <div className="bar-label">
                  <span>{department}</span>
                  <span>{count}</span>
                </div>
                <div className="bar-track">
                  <div style={{ width: `${Math.min(100, count * 25)}%` }} className="bar-fill" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </section>
  )
}
