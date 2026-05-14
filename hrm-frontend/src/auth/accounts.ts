import { defaultUsers } from '../data/mockData'
import type { UserAccount } from '../types'

const ACCOUNTS_KEY = 'hrm_user_accounts'

export function getAccounts(): UserAccount[] {
  const raw = localStorage.getItem(ACCOUNTS_KEY)
  if (!raw) {
    return defaultUsers
  }

  try {
    const parsed = JSON.parse(raw) as UserAccount[]
    return parsed.length ? parsed : defaultUsers
  } catch {
    return defaultUsers
  }
}

export function saveAccounts(accounts: UserAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}