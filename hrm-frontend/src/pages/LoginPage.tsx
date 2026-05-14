import { useMemo, useState, type FormEvent } from 'react'
import type { Role, SessionUser, UserAccount } from '../types'

interface LoginPageProps {
  onLogin: (user: SessionUser) => void
  users: UserAccount[]
}

export function LoginPage({ onLogin, users }: LoginPageProps) {
  const [fullName, setFullName] = useState('Imed Azouzi')
  const [department, setDepartment] = useState('Human Resources')
  const [password, setPassword] = useState('123456')
  const [role, setRole] = useState<Role>('admin')

  const usersForRole = useMemo(
    () => users.filter((candidate) => candidate.role === role && candidate.active),
    [role, users],
  )

  function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const knownUser = usersForRole.find(
      (candidate) => candidate.fullName === fullName && candidate.password === password,
    )

    if (!knownUser) {
      alert('Identifiants invalides ou compte désactivé.')
      return
    }

    const user: SessionUser = knownUser || {
      id: crypto.randomUUID(),
      fullName,
      role,
      department,
    }

    onLogin(user)
  }

  return (
    <div className="auth-wrap">
      <section className="auth-card">
        <p className="eyebrow">Project 6 - HRM Multi Users</p>
        <h2>Connect to Your Workspace</h2>
        <p className="auth-hint">
          Quick access: choose a role and sign in. Admin gets full management, user gets personal HR dashboard.
        </p>

        <form className="auth-form" onSubmit={submitLogin}>
          <label>
            Role
            <select value={role} onChange={(event) => setRole(event.target.value as Role)}>
              <option value="admin">Admin RH</option>
              <option value="user">Employee</option>
            </select>
          </label>

          <label>
            Full Name
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Ex: Imed Azouzi"
              required
            />
          </label>

          <label>
            Password
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="123456"
              required
            />
          </label>

          <label>
            Department
            <input
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              placeholder="Ex: Engineering"
              required
            />
          </label>

          <button type="submit">Open Dashboard</button>
        </form>
      </section>
    </div>
  )
}
