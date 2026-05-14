import type { Employee } from '../types'

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

export async function getEmployees(): Promise<Employee[]> {
  const response = await fetch(`${API_BASE}/employees`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    console.warn('Failed to fetch employees from backend, using local data')
    return []
  }

  return response.json() as Promise<Employee[]>
}

export async function createEmployee(payload: Pick<Employee, 'firstName' | 'lastName'>) {
  try {
    const response = await fetch(`${API_BASE}/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend response error:', errorText)
      throw new Error(errorText || 'Failed to create employee')
    }

    const data = await response.json()
    // Convert UUID object to string if needed
    return {
      ...data,
      id: typeof data.id === 'string' ? data.id : JSON.stringify(data.id),
    } as { id: string; firstName: string; lastName: string }
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Network error'
    console.error('Employee creation failed:', msg)
    throw error
  }
}
