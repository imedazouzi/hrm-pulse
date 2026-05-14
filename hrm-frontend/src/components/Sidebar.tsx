import type { SessionUser } from '../types'
import type { Route, Tab } from '../types'

interface SidebarProps {
  user: SessionUser
  currentRoute: Route
  currentTab: Tab
  onNavigate: (route: Route, tab?: Tab) => void
  onLogout: () => void
}

export function Sidebar({ user, currentRoute, currentTab, onNavigate, onLogout }: SidebarProps) {
  const isAdmin = user.role === 'admin'

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>HRM Pulse</h1>
        <p className="sidebar-subtitle">Gestion des ressources humaines</p>
      </div>

      <nav className="sidebar-nav">
        {isAdmin ? (
          <>
            <h3 className="nav-section-title">Espace admin</h3>
            <button className={`nav-item ${currentRoute === 'admin' && currentTab === 'dashboard' ? 'active' : ''}`} onClick={() => onNavigate('admin', 'dashboard')}>
              Tableau de bord
            </button>
            <button className={`nav-item ${currentRoute === 'admin' && currentTab === 'employees' ? 'active' : ''}`} onClick={() => onNavigate('admin', 'employees')}>
              Employés
            </button>
            <button className={`nav-item ${currentRoute === 'admin' && currentTab === 'users' ? 'active' : ''}`} onClick={() => onNavigate('admin', 'users')}>
              Comptes utilisateurs
            </button>
            <button className={`nav-item ${currentRoute === 'admin' && currentTab === 'leaves' ? 'active' : ''}`} onClick={() => onNavigate('admin', 'leaves')}>
              Demandes de congé
            </button>
            <button className={`nav-item ${currentRoute === 'admin' && currentTab === 'payroll' ? 'active' : ''}`} onClick={() => onNavigate('admin', 'payroll')}>
              Paie
            </button>
            <button className={`nav-item ${currentRoute === 'admin' && currentTab === 'performance' ? 'active' : ''}`} onClick={() => onNavigate('admin', 'performance')}>
              Performance
            </button>
            <button className={`nav-item ${currentRoute === 'admin' && currentTab === 'training' ? 'active' : ''}`} onClick={() => onNavigate('admin', 'training')}>
              Formation
            </button>
          </>
        ) : (
          <>
            <h3 className="nav-section-title">Mon espace RH</h3>
            <button className={`nav-item ${currentRoute === 'user' && currentTab === 'dashboard' ? 'active' : ''}`} onClick={() => onNavigate('user', 'dashboard')}>
              Tableau de bord
            </button>
            <button className={`nav-item ${currentRoute === 'user' && currentTab === 'leaves' ? 'active' : ''}`} onClick={() => onNavigate('user', 'leaves')}>
              Mes congés
            </button>
            <button className={`nav-item ${currentRoute === 'user' && currentTab === 'payroll' ? 'active' : ''}`} onClick={() => onNavigate('user', 'payroll')}>
              Ma paie
            </button>
            <button className={`nav-item ${currentRoute === 'user' && currentTab === 'performance' ? 'active' : ''}`} onClick={() => onNavigate('user', 'performance')}>
              Performance
            </button>
            <button className={`nav-item ${currentRoute === 'user' && currentTab === 'training' ? 'active' : ''}`} onClick={() => onNavigate('user', 'training')}>
              Formation
            </button>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="session-card">
          <p className="session-name">{user.fullName}</p>
          <small>{user.department}</small>
          <span className={`badge badge-${user.role}`}>{user.role.toUpperCase()}</span>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
