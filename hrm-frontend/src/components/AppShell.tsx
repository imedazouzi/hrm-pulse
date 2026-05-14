import type { PropsWithChildren } from 'react'
import type { Route, Tab } from '../types'
import { Sidebar } from './Sidebar'
import type { SessionUser } from '../types'

interface AppShellProps extends PropsWithChildren {
  user: SessionUser
  currentRoute: Route
  currentTab: Tab
  onNavigate: (route: Route, tab?: Tab) => void
  onLogout: () => void
}

export function AppShell({ user, currentRoute, currentTab, onNavigate, onLogout, children }: AppShellProps) {
  return (
    <div className="layout">
      <Sidebar user={user} currentRoute={currentRoute} currentTab={currentTab} onNavigate={onNavigate} onLogout={onLogout} />
      <main className="content">{children}</main>
    </div>
  )
}
