# SPMS — Development Roadmap

> Current state: ~85% feature completion. Phases 1 & 2 complete — all broken/incomplete features fixed, architectural layers (validators/repositories/services/actions) built, feature components for analytics/milestones/GitHub created. Phase 3+ items remain.

---

## Phase 1: Fix Broken & Incomplete Features (Critical) ✅ COMPLETED

These features were documented as working but were broken or non-functional.

### 1. Password Reset Flow ✅

- **Created** `src/app/api/auth/forgot-password/route.ts` — generates crypto reset token, stores via `VerificationToken` model, sends email via Nodemailer
- **Created** `src/app/api/auth/reset-password/route.ts` — validates token, bcrypt-hashes new password, deletes token
- **Created** `src/app/reset-password/page.tsx` — password reset form with token validation, password confirmation, success redirect
- **Created** `src/lib/email.ts` — Nodemailer transport (Gmail SMTP in production, Ethereal test accounts in dev)
- **Installed** `nodemailer` + `@types/nodemailer`
- **Updated** `auth.config.ts` — added `reset-password` to public auth page allowlist

### 2. File Upload UI ✅

- **Created** `src/app/api/uploadthing/core.ts` — UploadThing v7 file router (images, PDFs, docs; 4MB limit; auth middleware)
- **Created** `src/app/api/uploadthing/route.ts` — UploadThing Next.js route handler
- **Created** `src/lib/uploadthing.ts` — type-safe `UploadButton` + `generateReactHelpers`
- **Created** `src/app/api/files/route.ts` — persists `FileAttachment` records linked to project
- **Created** upload UI in `student-project-detail.tsx` — UploadThing button in milestone submission form, file list display, auto-attach on submit
- **Updated** student project detail page query to include `attachments`

### 3. Notification System ✅

- **Created** `src/app/api/notifications/route.ts` — `GET` (list/unread count), `PATCH` (mark all read)
- **Created** `src/app/api/notifications/[id]/route.ts` — `PATCH` (mark one read), `DELETE`
- **Fixed** `navbar.tsx` — replaced hardcoded `"3"` badge with live unread count, polls every 30s
- **Rewrote** `notifications/page.tsx` — fully interactive: mark all read, per-item mark read, per-item delete, click-through links

### 4. User Management (Admin) ✅

- **Created** `src/app/api/admin/users/route.ts` — `GET` with `?search` + `?role` filters, `POST` create user
- **Created** `src/app/api/admin/users/[id]/route.ts` — `PATCH` (update fields/password/suspend), `DELETE`
- **Rewrote** `admin/users/page.tsx` — functional search bar, role filter dropdown, "Add User" dialog, per-user action menu (Edit/Suspend/Delete), inline edit dialog with all fields

---

## Phase 2: Complete Scaffolded Empty Directories (High Priority) ✅ COMPLETED

### Add the Missing Architectural Layers ✅

| Directory | Purpose | What Was Built |
|-----------|---------|---------------|
| `src/validators/` | Centralized Zod schemas | `common.ts`, `user.ts`, `auth.ts`, `class.ts`, `group.ts`, `project.ts`, `file.ts`, `milestone.ts`, `submission.ts`, `comment.ts` — all inline schemas extracted |
| `src/repositories/` | Data access layer | `user.repository.ts`, `class.repository.ts`, `group.repository.ts`, `project.repository.ts`, `milestone.repository.ts`, `submission.repository.ts`, `comment.repository.ts`, `notification.repository.ts`, `file.repository.ts`, `activity-log.repository.ts`, `base.repository.ts` |
| `src/services/` | Business logic | `auth.service.ts`, `user.service.ts`, `class.service.ts`, `group.service.ts`, `project.service.ts`, `milestone.service.ts`, `submission.service.ts`, `comment.service.ts`, `notification.service.ts`, `file.service.ts` — each encapsulates domain orchestration |
| `src/actions/` | Server Actions | `create-project.ts`, `create-milestone.ts`, `submit-milestone.ts` — replace simple write operations |

### Build the Empty Feature Components ✅

| Dir | What Was Built |
|-----|---------------|
| `components/features/analytics/` | `ProjectStatusChart` (PieChart), `MilestoneCompletionChart` (LineChart), `GradingDistributionChart` (BarChart), `EnrollmentChart` (AreaChart) — wired into admin & teacher analytics pages |
| `components/features/github/` | `CommitActivityFeed`, `ContributorStats`, `RepoStatusBadge` — extracted from `teacher-project-detail.tsx` |
| `components/features/milestones/` | `MilestoneList` (with inline grading form), `MilestoneCreateForm` (dialog) — extracted from `teacher-project-detail.tsx` |

---

## Phase 3: Add Missing Core Features (Medium Priority)

### Real-time Collaboration

- Add **Server-Sent Events** (SSE) or WebSocket endpoint for live notifications
- Push updates when: a submission is graded, a comment is added, a milestone status changes
- Important for academic use case — students expect instant feedback

### Data Pagination & Filtering

Currently all list endpoints return **unpaginated results**. Add:

- **Cursor-based pagination** to: `/api/projects`, `/api/comments`, notifications, activity logs, audit logs
- **Search/filter queries** to all list endpoints (by status, class, date range, search term)
- **Sort parameters** (by createdAt, dueDate, status, title)

### Three.js / 3D Elements

- Three.js is in `package.json` but completely unused
- Likely intended for landing page — consider a 3D globe showing universities, or a 3D network visualization of projects
- Subtle 3D background on landing hero, or 3D data viz on analytics page

### Recharts Integration

- Recharts is installed but **no charts exist anywhere**
- Add to admin/teacher analytics pages:
  - Project status distribution (PieChart)
  - Milestone completion over time (LineChart)
  - Submission grading distribution (BarChart)
  - Class enrollment trends (AreaChart)

### GitHub Sync (Automated)

- Currently GitHub data is only seeded, never synced from real repos
- Build a background sync that:
  - Fetches commits via GitHub API for linked repos
  - Updates `commitCount24h`, `commitCount7d`, `lastCommitSha`
  - Could run via cron job, GitHub webhook receiver, or a queue worker

### Student Group Self-Service

- Students can view groups but cannot create or join them
- Add: "Create Group" button, "Join Group" with invite codes, "Leave Group" flow
- Group join requests with teacher approval

---

## Phase 4: Quality & Infrastructure (Foundational)

### Testing (Zero tests exist)

Add a testing stack:

- **Vitest** for unit tests on validators, repositories, services
- **Playwright** for E2E tests on critical flows:
  - Login → create project → submit milestone → grade
  - Admin user management
  - Password reset flow
- Test seed data dedicated to isolation (separate from `prisma/seed.ts`)

### CI/CD Pipeline

- **GitHub Actions** workflow:
  - `lint` + `typecheck` on every PR
  - `test` (unit + integration with test DB)
  - `build` to catch compilation errors
  - Deploy to production on merge to `main`

### Dockerize

- Create `Dockerfile` using Next.js `output: "standalone"`
- Create `docker-compose.yml` with PostgreSQL + app for local production-like testing
- Multi-stage build for minimal image size

### Monitoring & Observability

- Add **Sentry** for error tracking
- Add structured logging with **Pino** (replace `console.log` in seed.ts, API routes)
- Add OpenTelemetry for tracing Next.js → Prisma → PostgreSQL

---

## Phase 5: Production Polish (Nice-to-Have)

| Feature | Why |
|---------|-----|
| **Email notifications** via Resend | Notify students when graded, notify teachers when submitted |
| **Dark mode polish** | Theme toggle works but custom components may not handle dark mode consistently |
| **Keyboard shortcuts** | USAGE.md documents Cmd+K for command palette, but no shortcut reference page exists |
| **TanStack Table** | Dependency exists but unused — apply to admin users table and teacher projects list for sortable/filterable/selectable columns |
| **Loading states** | Skeleton loaders exist but aren't consistently applied to all pages |
| **Accessibility audit** | Run axe-core or Lighthouse to check contrast, ARIA labels, focus management, keyboard nav |
| **Internationalization (i18n)** | If targeting international universities, add next-intl or similar |
| **Rate limiting** | Protect API routes from abuse using a token bucket stored in Redis |
| **Audit log viewer** | Admin logs page is basic — add filtering by action type, entity, date range |

---

## Suggested Implementation Order

```
Week 1-2:  Fix password reset + UploadThing wiring + notification badge
Week 3-4:  Build validators/ + repositories/ + services/ layers (refactor API routes)
Week 5-6:  Build analytics/ + milestones/ + github/ feature components
Week 7:    Pagination on all list endpoints + search/filter
Week 8:    Real-time notifications (SSE) + notification center page
Week 9:    Student group self-service + admin user CRUD
Week 10:   Testing setup + CI/CD pipeline
Week 11:   Docker + Recharts charts + Three.js elements
Week 12:   Monitoring + accessibility + polish
```

### Highest Value Per Effort

1. **Fix password reset** — one afternoon, unblocks a broken documented flow
2. **Build validators/repositories/services layers** — architectural foundation for everything else
3. **Add pagination** — critical before real users hit the app
4. **Wire up UploadThing + notifications** — two features users will immediately notice and benefit from

---

## Reference: Current Project State

### What's Built (Complete)
- Authentication (credentials-based, JWT, 1-year sessions, role-based middleware)
- Landing page (12 sections with GSAP/Lenis/Framer Motion animations)
- Database schema (14 models with full relations and indexes)
- Seed script (admin, 2 teachers, 20 students, 3 classes, 5 projects, milestones, comments)
- Core API routes (auth, classes, projects, groups, milestones, submissions, comments, admin — 18 route files)
- Password reset flow (Nodemailer, forgot-password/reset-password API + page)
- File upload (UploadThing v7, file attachment API, upload UI in student project detail)
- Notification system (API routes, interactive notifications page, live unread badge)
- Admin user CRUD (search, create, edit, suspend/unsuspend, delete)
- Role-based dashboards (admin dashboard with stats, teacher dashboard with overview, student dashboard with projects)
- Project detail pages (student: milestones + submit + comments + file upload; teacher: milestones + grade + activity + GitHub)
- Sidebar (collapsible, role-filtered) and Navbar
- shadcn/ui component library (20+ primitives)
- Animation utilities (GSAP provider, Lenis provider, Framer Motion presets)
- **Architectural layers**: `src/validators/` (10 files), `src/repositories/` (11 files), `src/services/` (10 files), `src/actions/` (3 files)
- **Analytics charts**: `ProjectStatusChart` (PieChart), `MilestoneCompletionChart` (LineChart), `GradingDistributionChart` (BarChart), `EnrollmentChart` (AreaChart) — wired into admin & teacher analytics pages
- **Milestone components**: `MilestoneList`, `MilestoneCreateForm` — extracted from `teacher-project-detail.tsx`
- **GitHub components**: `CommitActivityFeed`, `ContributorStats`, `RepoStatusBadge`

### What's Still Scaffolded But Empty
- `public/` — Static assets directory

### What's Broken or Missing Entirely
- ~~Password reset flow~~ ✅
- ~~File upload UI~~ ✅
- ~~Real-time notification delivery~~ (notification center page ✅, real-time delivery pending)
- ~~Admin user CRUD~~ ✅
- ~~Architectural layers (validators/repositories/services/actions)~~ ✅
- ~~Charts (Recharts)~~ ✅
- ~~Analytics / Milestones / GitHub feature components~~ ✅
- Student group self-service (create/join/leave)
- Tests (zero)
- CI/CD (zero)
- Dockerfile
- GitHub auto-sync
- Three.js components (unused)
