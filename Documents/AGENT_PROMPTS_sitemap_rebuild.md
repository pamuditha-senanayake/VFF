# VFF IMS — Sitemap & Role-Flow Rebuild: 5 Sequential Agent Prompts

Execute these one at a time, in order. Each prompt is self-contained: paste it
into a fresh coding-agent session, let it finish and verify, commit, then move
to the next. Do not skip ahead — every step depends on the one before it.

---

## STEP 1 of 5 — Role Model Foundation & Permission Matrix

```
CONTEXT
This is the VFF IMS monorepo: Next.js frontend in `frontend/`, FastAPI backend
in `backend/`. The SRS (Documents/SRS_v1.docx) defines the role model as:
Admin (role_id 1), Director (role_id 2), HR Officer (role_id 3),
Finance Officer (role_id 4), Staff (role_id 5).

CURRENT PROBLEMS
- `frontend/src/types/index.ts` defines `UserRole = 'Admin' | 'Director'` only,
  but `frontend/src/components/layout/sidebar.tsx` hard-codes role strings like
  'Finance Officer', 'HR Officer', 'Operations Lead', 'General Staff',
  'System Administrator' that don't exist in the type — role checks silently
  never match.
- There is no single source of truth for "which role can do what".
- Backend routes in `backend/app/api/hr.py`, `finance.py`, `inventory.py` have
  ZERO authentication or role checks — any request succeeds.
- There is no `frontend/src/middleware.ts`; route protection is only a
  client-side useEffect redirect in
  `frontend/src/components/layout/protected-route.tsx`.

TASK
1. Create ONE canonical permission matrix as data, used by both apps:
   - `frontend/src/lib/permissions.ts`: export the `UserRole` union
     ('Admin' | 'Director' | 'HR Officer' | 'Finance Officer' | 'Staff'),
     a `Permission` union (e.g. 'hr:manage', 'hr:attendance:self',
     'hr:attendance:manage', 'payroll:generate', 'payroll:approve',
     'finance:read', 'finance:write', 'inventory:read', 'inventory:issue',
     'programs:read', 'programs:manage', 'admin:users', 'audit:read'),
     and a `ROLE_PERMISSIONS: Record<UserRole, Permission[]>` matrix.
   - `backend/app/core/permissions.py`: mirror the same roles/permissions as
     Python enums + dict. Add a comment in both files pointing at each other
     saying they must stay in sync.
2. Matrix contents (from the SRS):
   - Admin: everything.
   - Director: read-only finance + dashboards, payroll:approve,
     programs:read, inventory:read, audit:read. Directors do NOT enter
     transactions.
   - HR Officer: hr:manage, hr:attendance:manage, hr:attendance:self,
     payroll:generate (initiate, not approve).
   - Finance Officer: finance:read, finance:write, payroll:generate,
     inventory:read.
   - Staff: hr:attendance:self, programs:read (own assignments),
     inventory:issue only if assigned; plus profile/settings/support.
3. Backend enforcement: create a FastAPI dependency
   `require_permission(permission)` in `backend/app/core/security.py` (or
   extend the existing auth module) that decodes the Supabase JWT from the
   Authorization header, resolves the user's role, and raises 403 if the role
   lacks the permission. Apply it to EVERY route in hr.py, finance.py,
   inventory.py with the matching permission. Auth routes stay public.
4. Frontend enforcement: create `frontend/src/middleware.ts` that reads the
   session and blocks dashboard routes for unauthenticated users
   (server-side, before render). Keep ProtectedRoute as the in-app layer but
   refactor it to check permissions (not raw role names) via a
   `hasPermission(user, permission)` helper from permissions.ts.
5. Update `frontend/src/types/index.ts` to re-export UserRole from
   permissions.ts so there is exactly one definition.
6. Fix every place that references the old/phantom role strings (grep for
   'Operations Lead', 'General Staff', 'System Administrator', 'HR Lead') and
   map them onto the five canonical roles.

DO NOT change any page layouts, navigation structure, or add new pages in
this step. Foundation only.

VERIFY BEFORE FINISHING
- `npm run build` passes in frontend/ with zero type errors.
- Backend starts (`cd backend && source venv/bin/activate && PYTHONPATH=. python3 app/main.py`).
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/hr/employees`
  WITHOUT a token returns 401/403, not 200.
- Grep confirms no remaining references to phantom role strings.
```

---

## STEP 2 of 5 — Information Architecture: Role-Scoped Sitemap & Navigation

```
CONTEXT
VFF IMS monorepo (Next.js in `frontend/`, FastAPI in `backend/`). Step 1 is
already done: there is a canonical permission matrix in
`frontend/src/lib/permissions.ts` with roles Admin, Director, HR Officer,
Finance Officer, Staff, and `hasPermission()` helper. Backend routes now
enforce permissions.

CURRENT PROBLEMS
- The sitemap is one flat list served identically to everyone:
  /dashboard, /hr, /finance, /inventory, /programs, /admin, /profile,
  /settings, /support (see `frontend/src/app/(dashboard)/`).
- The sidebar (`frontend/src/components/layout/sidebar.tsx`) hard-codes nav
  items with inline role arrays.
- Every role lands on the same /dashboard after login; Staff and officers see
  a page built for admins or nothing useful at all.

TASK
1. Design the new sitemap around each role's primary job:
   - `/dashboard` becomes a ROLE-AWARE landing that renders a different
     composition per role (do the routing/skeleton now; rich content comes in
     Step 4):
       Admin → system overview, Director → financial/impact overview,
       HR Officer → attendance & payroll status, Finance Officer → ledger
       workbench summary, Staff → "My Day" (clock in/out card, my recent
       attendance, my program assignments).
   - Reorganize module routes into task-oriented sub-routes (Next.js nested
     routes with their own page.tsx, extracting existing tab/section content
     where it exists rather than rewriting it):
       /hr/employees, /hr/attendance (management view), /hr/payroll
       /finance/overview, /finance/ledger, /finance/receivables,
       /finance/payables, /finance/reports
       /inventory/stock, /inventory/issue, /inventory/returns
       /programs (list) and /programs/[id] (detail with costs) if a detail
       view doesn't exist yet
       /me/attendance (self-service — placeholder page this step, built out
       in Step 3)
   - Keep old top-level routes working via redirects to the new canonical
     locations (next.config.ts redirects or thin redirect pages).
2. Drive navigation from ONE config: create
   `frontend/src/lib/navigation.ts` exporting a nav tree where every item
   declares `requiredPermission` (from permissions.ts), not role arrays.
   Sidebar renders by filtering this config with hasPermission(). Delete the
   inline `sections` array from sidebar.tsx.
3. The sidebar must show ONLY what the current role can act on. A Staff user
   should see: My Day, My Attendance, Programs (read), Profile/Settings/
   Support — and nothing else. Verify each role's rendered nav against the
   permission matrix.
4. Add breadcrumbs to the dashboard layout
   (`frontend/src/app/(dashboard)/layout.tsx`) reflecting the new hierarchy.
5. Wrap each new route section with permission checks (ProtectedRoute with
   the matching permission), so URL-typing a forbidden route redirects to an
   `/unauthorized` page (create a simple one) instead of silently bouncing to
   /dashboard.

DO NOT build the attendance clock-in feature or dashboard analytics content
in this step — structure and navigation only. Placeholder cards with clear
headings are fine where content doesn't exist yet.

VERIFY BEFORE FINISHING
- `npm run build` passes.
- Manually (or via a script) render/visit the app as each of the 5 roles and
  confirm: sidebar items match the permission matrix exactly; landing page
  differs per role; forbidden URLs show /unauthorized.
- All old URLs (/hr, /finance, /inventory) still resolve via redirect.
```

---

## STEP 3 of 5 — Attendance Self-Service & the Attendance→Payroll Pipeline

```
CONTEXT
VFF IMS monorepo. Steps 1–2 are done: permission matrix exists
(`frontend/src/lib/permissions.ts`, `backend/app/core/permissions.py`),
backend routes enforce permissions, sitemap is role-scoped with
/me/attendance as a placeholder and /hr/attendance + /hr/payroll as
management routes.

CURRENT PROBLEMS
- The SRS (FR-REQ-5.3, FR-REQ-5.4) requires: clock-in/clock-out captured by
  button click (not manual text entry), records auto-lock on clock-out,
  locked attendance is the mandatory input to payroll, and payroll is blocked
  if attendance isn't locked.
- Backend `backend/app/api/hr.py` has attendance endpoints (GET/POST
  /attendance, POST /attendance/lock, payroll generate) but they are
  admin-shaped: no "my attendance" concept, no clock-in/out semantics.
- Frontend has NO way for a normal employee to record attendance at all —
  it only exists inside the HR admin page.

TASK
1. Backend — add self-service endpoints in hr.py (with permission
   'hr:attendance:self'):
   - POST /api/hr/attendance/clock-in → creates today's record for the
     authenticated user's employee profile (server timestamp, UTC in DB).
     Reject if already clocked in today or no linked employee profile.
   - POST /api/hr/attendance/clock-out → sets clock_out, computes
     worked_hours, sets is_locked=true in the same update (per SRS the
     record becomes immutable on clock-out). Reject if not clocked in or
     already locked.
   - GET /api/hr/attendance/me?month=&year= → the caller's own history only.
   Ensure the users↔employee_profiles link exists; if the schema lacks it,
   add the linking column/migration in `backend/db` and document it.
2. Backend — harden the pipeline rules that already partially exist:
   - PATCH/PUT on a locked attendance record → 403 with a clear message.
   - POST /api/hr/payroll/generate must refuse (422 with actionable message
     listing offending dates/employees) if any attendance record in the
     period is unlocked, and refuse duplicate generation for the same period.
   - Add POST /api/hr/attendance/lock-day (permission
     'hr:attendance:manage') for HR to bulk-lock a date (covers
     forgot-to-clock-out cases; mark those records 'Incomplete').
3. Frontend — build /me/attendance:
   - A large Clock In / Clock Out card showing current state (not clocked
     in / clocked in at HH:MM / completed + locked), driven by a
     useAttendance hook (TanStack Query, follow the patterns in
     `frontend/src/hooks/useHR.ts` and `frontend/src/services/hr.service.ts`).
   - Below it, "My attendance this month": date, in, out, hours, status
     (locked padlock / incomplete). Times displayed in local time (UTC+5:30),
     stored UTC.
   - Put the same Clock In/Out card on the Staff "My Day" dashboard landing.
4. Frontend — upgrade /hr/attendance (HR Officer/Admin):
   - Day view with all employees' records, lock indicators, an Incomplete
     filter, and a "Lock day" action with confirmation dialog.
5. Frontend — upgrade /hr/payroll:
   - Period selector → "Check readiness" state that surfaces the backend's
     unlocked-attendance blockers as a checklist → Generate (HR/Finance) →
     Approve/Finalize visible only to Director/Admin
     (permission 'payroll:approve'). Finalized payroll renders read-only.

VERIFY BEFORE FINISHING
- Full cycle works end-to-end with a Staff test user: clock in → clock out →
  record shows locked → HR sees it in /hr/attendance → payroll readiness
  passes for that employee.
- Payroll generation with an unlocked/incomplete record is rejected with the
  explanatory message.
- A Staff JWT cannot call GET /api/hr/attendance (all-employees) or
  /api/hr/employees — 403.
- `npm run build` passes; backend boots clean.
```

---

## STEP 4 of 5 — Role-Specific Dashboards & Module Workbenches

```
CONTEXT
VFF IMS monorepo. Steps 1–3 are done: permission matrix + enforcement,
role-scoped sitemap with per-role landing skeletons, working attendance
self-service and attendance→payroll pipeline.

CURRENT PROBLEM
The per-role landing pages are skeletons, and module pages are still
one-size-fits-all data dumps. Each role needs a workspace shaped around its
actual daily job (SRS section 2.2 "User Characteristics" is the source of
truth for what each role does).

TASK
Build the role-specific content. Reuse existing components
(`frontend/src/components/finance/`, `FinanceSummary.tsx`, existing hooks/
services) — compose, don't duplicate. Fetch real data via the existing API;
no hard-coded numbers.

1. Director landing (read-only, strategic — per SRS they approve payroll but
   never enter transactions):
   - Available Cash vs Outstanding Receivables (visually distinct, cash
     highlighted, LKR formatted), receivables aging (0-30/31-60/61+),
     monthly cash-flow trend, program cost summaries / cost-per-animal where
     the API provides it, low-liquidity warning indicator, pending payroll
     approvals with a one-click path to the approval screen.
   - No create/edit buttons anywhere on Director views.
2. HR Officer landing: today's attendance completion (x of y clocked in,
   incomplete count), quick links to lock day / employees / payroll
   readiness, payroll-cycle status card.
3. Finance Officer landing: quick-entry shortcut to /finance/ledger, unsettled
   payables/receivables due soon, recent transactions, payroll generation
   status.
4. Staff "My Day": clock in/out card (from Step 3), my hours this month, my
   program assignments, support link.
5. Admin landing: user counts by role, recent audit-relevant events if
   available, links into each module, system health (backend reachable).
6. Module workbench polish:
   - /finance/ledger: entry form with inline validation + confirmation dialog
     before submit (SRS EI-REQ-7.2.3), transaction type + category + optional
     program link.
   - /finance/receivables and /payables: status columns
     (Open/Partially Settled/Settled/Overdue), aging, "confirm payment" flow
     gated by 'finance:write'.
   - /inventory/issue: program-linked issuance with stock check feedback;
     /inventory/returns referencing the original issuance.
7. Every list/dashboard needs proper loading skeletons, error states with
   retry, and designed empty states ("No transactions this month — record
   one" with the action button, permission-gated).

DO NOT redesign the visual theme; use the existing Tailwind/shadcn design
system and match current styling. Keep all business calculations
(aging buckets, totals) on the backend — frontend renders what the API
returns; add small aggregate endpoints where missing.

VERIFY BEFORE FINISHING
- Log in as each of the 5 roles: each sees its own landing with live data,
  and no dead links or action buttons the role can't use.
- Director UI contains zero mutation controls; API also rejects Director
  writes (belt and braces).
- `npm run build` passes with no type errors.
```

---

## STEP 5 of 5 — Full-System Audit, Consistency Pass & Role-Based Acceptance Tests

```
CONTEXT
VFF IMS monorepo. Steps 1–4 are done: permission matrix enforced on both
ends, role-scoped sitemap, attendance→payroll pipeline, role-specific
dashboards and workbenches. This final step is verification and polish — the
difference between "works" and "professional".

TASK
1. Permission audit (automated, kept in the repo):
   - Write a test suite `backend/tests/test_rbac_matrix.py` that iterates the
     permission matrix × every API route and asserts: allowed role → 2xx/
     validation error, forbidden role → 403, no token → 401. Every route must
     be covered; fail the suite if a route has no explicit permission.
   - Write `frontend/` tests asserting the navigation config filtered per
     role matches an expected snapshot per role (5 snapshots).
2. Seed script: `backend/scripts/seed_demo_users.py` creating one user per
   role (admin@vff.test, director@vff.test, hr@vff.test, finance@vff.test,
   staff@vff.test, shared known password) plus linked employee profiles and
   a little sample data, so anyone can demo every role. Document credentials
   in README.
3. Flow acceptance checks — script or documented checklist executed now, and
   fix everything it catches:
   - Staff: login → lands on My Day → clock in → clock out → sees locked row.
   - HR: login → sees completion stats → locks day → payroll readiness green.
   - Finance: login → enter ledger transaction → dashboard totals update.
   - Director: login → sees cash vs receivables → approves payroll →
     payroll read-only afterwards.
   - Admin: login → registers a user → assigns role → that user's nav is
     correct on first login.
4. Consistency sweep across all pages:
   - Uniform page headers (title + breadcrumb + primary action top-right),
     uniform table styling, uniform LKR money formatting (one shared
     formatter, always from integer-safe values), uniform date/time
     formatting (one shared util, Asia/Colombo display), uniform
     toast/confirmation patterns for destructive or finalizing actions.
   - Kill dead code: unused routes, the phantom-role remnants, unused
     components, stray files (e.g. backend/e2e_register_dump.html,
     page_dump.html if unused).
5. Professional finishing:
   - /unauthorized, 404, and error.tsx pages styled consistently.
   - Page <title> metadata per route ("Attendance — VFF IMS").
   - Sidebar active-state correctness for nested routes.
   - Update README.md with the new sitemap (a per-role route table) and the
     demo credentials.

VERIFY BEFORE FINISHING
- Both test suites pass and are wired into package.json / pyproject scripts.
- Run the 5 role flows above against the live dev servers and state the
  result of each honestly.
- `npm run build` + `npm run lint` clean; backend boots clean.
```

---

### How to use these prompts
1. One prompt per session, in order; commit after each green verification.
2. If a step's verification fails, make the agent fix it before moving on —
   never carry debt into the next step.
3. After Step 5, tag the release. The verification lists double as your
   regression checklist for future changes.
