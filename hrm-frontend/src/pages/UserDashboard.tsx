import { useMemo, useState, type FormEvent } from 'react'
import { seedPayroll, seedPerformance, seedTrainings } from '../data/mockData'
import type { LeaveRequest, SessionUser } from '../types'

interface UserDashboardProps {
  user: SessionUser
  leaveRequests: LeaveRequest[]
  activeTab: 'dashboard' | 'employees' | 'users' | 'leaves' | 'payroll' | 'performance' | 'training'
  onLeaveRequest: (leaveType: LeaveRequest['leaveType'], startDate: string, endDate: string) => void
}

export function UserDashboard({ user, leaveRequests, activeTab, onLeaveRequest }: UserDashboardProps) {
  const [leaveType, setLeaveType] = useState<LeaveRequest['leaveType']>('Annual')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const payrollTotal = useMemo(
    () => seedPayroll.reduce((sum, line) => sum + line.amount, 0),
    [],
  )

  function submitLeave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onLeaveRequest(leaveType, startDate, endDate)
    setStartDate('')
    setEndDate('')
  }

  return (
    <section className="panel-grid">
      <header className="hero-panel user-tone">
        <p className="eyebrow">Espace employé</p>
        <h2>Bienvenue {user.fullName}</h2>
        <div className="kpi-row">
          <article>
            <strong>18</strong>
            <span>Jours de congé restants</span>
          </article>
          <article>
            <strong>{payrollTotal} EUR</strong>
            <span>Salaire net du mois</span>
          </article>
          <article>
            <strong>{seedTrainings.length}</strong>
            <span>Formations actives</span>
          </article>
        </div>
      </header>

      {activeTab === 'dashboard' && (
        <section className="card">
          <h3>Résumé personnel</h3>
          <p className="hint">Utilisez le menu de gauche pour ouvrir vos congés, votre paie, votre performance ou vos formations.</p>
        </section>
      )}

      {activeTab === 'leaves' && (
        <section className="card">
          <h3>Demander un congé</h3>
          <form className="inline-form" onSubmit={submitLeave}>
            <select value={leaveType} onChange={(event) => setLeaveType(event.target.value as LeaveRequest['leaveType'])}>
              <option value="Annual">Annuel</option>
              <option value="Sick">Maladie</option>
              <option value="Maternity">Maternité</option>
              <option value="Training">Formation</option>
            </select>
            <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} required />
            <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} required />
            <button type="submit">Envoyer</button>
          </form>
          <h3 style={{ marginTop: '18px' }}>Historique de congés</h3>
          <div className="list">
            {leaveRequests.map((leave) => (
              <article className="list-item" key={leave.id}>
                <div>
                  <strong>{leave.leaveType}</strong>
                  <p>{leave.startDate} au {leave.endDate}</p>
                </div>
                <span className={`badge status-${leave.status.toLowerCase()}`}>{leave.status}</span>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'performance' && (
        <section className="card">
          <h3>Performance</h3>
          <div className="bar-list">
            {seedPerformance.map((metric) => (
              <div key={metric.label}>
                <div className="bar-label">
                  <span>{metric.label}</span>
                  <span>{metric.score}% / objectif {metric.target}%</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill warm" style={{ width: `${metric.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'payroll' && (
        <section className="card">
          <h3>Ma paie</h3>
          <div className="list">
            {seedPayroll.map((line) => (
              <article className="list-item" key={line.id}>
                <div>
                  <strong>{line.label}</strong>
                  <p>Montant : {line.amount} EUR</p>
                </div>
                <span className="badge">Paiement</span>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'training' && (
        <section className="card">
          <h3>Formations</h3>
          <div className="list">
            {seedTrainings.map((training) => (
              <article className="list-item" key={training.id}>
                <div>
                  <strong>{training.title}</strong>
                  <p>Échéance : {training.dueDate}</p>
                </div>
                <span className="badge">{training.progress}%</span>
              </article>
            ))}
          </div>
        </section>
      )}
    </section>
  )
}
