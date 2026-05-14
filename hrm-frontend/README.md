# HRM Frontend (React)

Frontend multi-users for Project 6 HRM with:

- Role switch login (Admin RH / Employee)
- Admin dashboard (employee creation linked to backend, leave approvals, metrics)
- Employee dashboard (leave requests, payroll snapshot, performance and training progress)
- Responsive UI for desktop/tablet/mobile

## Stack

- React + TypeScript + Vite
- CSS custom theme
- Hash-based navigation (`#/login`, `#/admin`, `#/user`)

## Backend Link

The frontend calls your Spring Boot backend endpoint:

- `POST /api/employees`

By default, Vite dev server proxies `/api` to `http://localhost:8081` (see `vite.config.ts`).

## Run

```bash
cd hrm-frontend
npm install
npm run dev
```

Open:

- `http://localhost:5173`

## Build

```bash
npm run build
npm run preview
```

## Quick Test Accounts

- Admin: `Amina Rahmani` / role `admin`
- User: `Yassine Benali` / role `user`

You can also type any custom name and department.

## Notes

- Auth/roles are mock session-based for speed (localStorage).
- Employee creation is truly sent to backend.
- Other modules (payroll, training, performance) are scaffolded UI with local mock data to accelerate delivery.
