# AI Interview Admin

Angular 20 enterprise admin panel for InterviewAI.

## Setup

```bash
npm install
npm start
```

## Architecture

```
src/app/
├── core/
│   ├── constants/
│   │   ├── app-icons.ts       # Central icon registry (AppIcons.*)
│   │   └── navigation.ts      # Sidebar nav config
│   └── models/
├── shared/
│   ├── ui/                    # Reusable UI components
│   │   ├── button/            # app-button
│   │   ├── dropdown/          # app-dropdown
│   │   ├── pagination/        # app-pagination
│   │   ├── icon/              # app-icon
│   │   └── kpi-card/
│   └── data/
├── layouts/
│   ├── admin-sidebar/         # Fixed left sidebar (standalone)
│   └── admin-shell/           # Topbar + router-outlet wrapper
└── features/
    ├── dashboard/
    │   ├── dashboard.routes.ts
    │   └── pages/
    └── users/
        ├── users.routes.ts
        └── pages/
    └── interviews/
        ├── interviews.routes.ts
        └── pages/
```

## Routing

Feature routes live in their own files and are lazy-loaded from `app.routes.ts`:

- `features/dashboard/dashboard.routes.ts` → `/dashboard`
- `features/users/users.routes.ts` → `/users`
- `features/interviews/interviews.routes.ts` → `/interviews`

## Reusable button

```html
<app-button variant="primary" [icon]="icons.add" iconColor="#ffffff">
  Add User
</app-button>

<app-button variant="outline" [icon]="icons.download">Export CSV</app-button>
<app-button variant="icon" [icon]="icons.edit" ariaLabel="Edit" />
```

Variants: `primary` | `outline` | `icon` | `ghost` | `white` | `white-outline` | `soft`

## Reusable pagination

```html
<app-pagination
  [currentPage]="currentPage"
  [pageSize]="10"
  [totalItems]="1284"
  itemLabel="users"
  [pages]="[1, 2, 3]"
  navMode="text"
  (pageChange)="currentPage = $event"
/>
```

- `navMode="text"` — Previous / Next labels
- `navMode="icon"` — chevron buttons (interviews style)

## Reusable dropdown

```html
<app-dropdown
  [options]="statusOptions"
  [(value)]="statusFilter"
  ariaLabel="Filter by status"
/>
```

Options use `{ label, value }` from `shared/data/filter-options.data.ts`.

## Icons

All icons are defined once in `core/constants/app-icons.ts`:

```typescript
import { AppIcons } from './core/constants/app-icons';

// In component
readonly icons = AppIcons;

// In template
<app-icon [icon]="icons.bell" [size]="18" />
```

## Styling

- `src/styles/global.css` — typography tokens & semantic classes
- `src/styles/admin-shell.css` — layout primitives
- `layouts/admin-sidebar/admin-sidebar.css` — fixed sidebar styles
