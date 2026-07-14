# From "It Works" to Professional: How to Fix a Broken Sitemap & Role Flow
### A 5-step end-to-end method, taught on your own app (VFF IMS)

This is a learning document, not a task list. It explains *why* professional
products feel different, using the exact defects found in your codebase as the
teaching material. Master this process and you can walk into any app with
"pages exist but users can't work" and fix it systematically — that skill,
not any framework, is what separates the top 1%.

---

## The core insight before the steps

Amateur apps are organized around **data** ("here's the HR table, here's the
finance table"). Professional apps are organized around **people doing jobs**
("it's 8am, a field vet opens the app — what must be one tap away?").

Your app has this exact disease. Look at the evidence:

- `/hr`, `/finance`, `/inventory` — pages named after database tables, each a
  dump of everything in that table.
- Every role lands on the same `/dashboard`.
- Attendance — the single most frequent action in the whole system, done by
  every employee every day, and the legally-required input to payroll — has
  **no page at all**. It's buried inside an admin screen.

The fix is never "add more pages." It is: re-derive the sitemap from roles
and their jobs, then enforce it at every layer. That's the 5 steps.

---

## STEP 1 — Audit: build the Role × Job × Reality table

**Principle:** You cannot fix what you haven't precisely named. "The sitemap
is poor" is a feeling; professionals convert feelings into a defect table.

**The method:**
1. **List the real roles from the source of truth** — not from the code.
   Your SRS section 2.2 names them and, crucially, describes *behavior*:
   Director "does not enter transactions but approves payroll"; HR Officer
   "maintains attendance feeding payroll"; Staff exist mainly to clock in.
2. **For each role, write its top 3 daily jobs** (jobs-to-be-done, phrased
   as verbs: "record my attendance", "check if we can pay salaries",
   "issue vaccines to the Galle program").
3. **Walk the actual app as each role** and record: Can they do the job?
   In how many clicks? Do they see things they shouldn't?

**What this audit found in your app (learn to spot these patterns):**

| Defect pattern | Your instance | Why it's lethal |
|---|---|---|
| **Type/reality drift** | `UserRole = 'Admin' \| 'Director'` but sidebar checks `'Finance Officer'`, `'Operations Lead'`… | Role checks against nonexistent strings *silently never match*. The system lies about having RBAC. |
| **Decorative security** | RBAC is only a client-side `useEffect` redirect; zero checks on any FastAPI route | Anyone with `curl` has full admin access. UI-only security is theater. |
| **Missing primary workflow** | No clock-in/out anywhere, yet payroll *requires* locked attendance | The system's most important data pipeline has no entry point. |
| **Single sitemap for all roles** | Everyone gets the same nav and landing | Staff see an admin tool; the product feels "not for me" to 80% of users. |

**The deliverable of this step is one artifact:** a permission matrix —
roles × capabilities, as a table. Everything downstream (nav, routes, API
guards, tests) must be generated from or checked against this one table.
Top-1% habit: *one source of truth, referenced everywhere, duplicated
nowhere.*

---

## STEP 2 — Design the Information Architecture (before touching code)

**Principle:** A sitemap is a theory of your users' attention. Design it
top-down from the matrix, not bottom-up from what pages already exist.

**The method:**
1. **One landing per role.** The first screen after login should answer that
   role's daily question: Staff → "am I clocked in?"; Director → "can we
   cover payroll this month?"; HR → "has everyone clocked in today?". If two
   roles share an identical landing, you probably don't have two roles.
2. **Name routes after tasks, not tables.** `/hr` → `/hr/employees`,
   `/hr/attendance`, `/hr/payroll`. `/finance` → `/finance/ledger`,
   `/finance/receivables`, `/finance/payables`, `/finance/reports`. The URL
   itself becomes documentation of what users can do.
3. **Separate "me" from "manage".** Self-service (`/me/attendance`) and
   administration (`/hr/attendance`) are different jobs for different roles
   that happen to touch the same table. Splitting them is what makes the
   Staff experience possible at all — this single move fixes your biggest
   gap.
4. **Depth rule:** the primary job of each role ≤ 1 click from landing;
   anything ≤ 3 clicks. Your Staff clock-in should be *zero* clicks — a card
   on their landing page.
5. **Navigation as data.** The sidebar must render from one config file
   where each item declares the *permission* it needs (not hard-coded role
   arrays scattered in a component). When nav is data, "does each role see
   the right menu?" becomes a snapshot test instead of a prayer.

**Anti-pattern to unlearn:** gating nav items by role name
(`roles: ['Admin', 'Director']`) — this is what rotted in your sidebar.
Gate by *capability* (`requiredPermission: 'finance:read'`). Roles change;
capabilities are stable; and one permission can be granted to a new role
later without touching twenty components.

---

## STEP 3 — Enforce access at every layer (defense in depth)

**Principle:** Every boundary a request crosses must independently re-check
authorization. Professionals assume every outer layer has already failed.

The four layers, and what each catches:

1. **Edge/middleware** (Next.js `middleware.ts`) — blocks unauthenticated
   users before any page renders. Cheap, coarse. *Your app: missing.*
2. **UI layer** — hide or disable actions the user can't take. This is UX,
   not security: its job is to prevent confusion, never to prevent attack.
   *Your app: exists (ProtectedRoute) but checks phantom role strings.*
3. **API layer** (FastAPI dependency) — decode the JWT, resolve the role,
   check the permission on *every* route. This is the real security
   boundary; if only one layer could exist, it's this one. *Your app:
   completely absent — the critical hole.*
4. **Data layer** — database constraints for the invariants that must
   survive even buggy application code: locked attendance rows reject
   updates, audit log denies UPDATE/DELETE (your SRS specifies exactly
   this).

**The professional pattern:** write `require_permission('payroll:generate')`
*once* as a reusable dependency/middleware, then declare it per route. If
adding a check to a route takes more than one line, developers will skip it
under deadline pressure — ergonomics of the secure path is a design problem,
not a discipline problem.

**Test insight that puts you ahead of most seniors:** the permission matrix
is *executable*. Iterate matrix × routes in a test: allowed → 2xx, forbidden
→ 403, anonymous → 401, and fail any route with no declared permission.
Now RBAC can never silently rot again — which is precisely how your
phantom-role bug happened.

---

## STEP 4 — Build workflows, not screens (the attendance case study)

**Principle:** Users don't experience pages; they experience *flows* —
sequences of states moving toward an outcome. Design the state machine
first, then render each state.

Your attendance→payroll pipeline is the perfect teaching case because the
SRS defines it as a strict state machine:

```
not clocked in → clocked in → clocked out (auto-LOCKED) →
  [all records locked] → payroll generated → payroll APPROVED (read-only)
```

Lessons this flow teaches:

1. **Find the load-bearing workflow.** Every system has one flow that
   everything else depends on. Here: no attendance → no payroll → no
   salaries → nobody uses the system. Fix that flow first; polish is
   worthless while it's broken.
2. **Make invalid states unrepresentable.** Clock-out and lock happen in
   the *same* database update — there is no moment where a completed record
   is editable. Payroll *refuses* to run on unlocked data rather than
   warning about it. Professionals encode rules as hard gates, not tooltips.
3. **Blockers must be actionable.** "Cannot generate payroll" is amateur.
   "Cannot generate: 3 unlocked records — Kamal (Jul 2), Nimal (Jul 5,
   incomplete)…" with a link to fix each is professional. Same backend
   check, wildly different user outcome.
4. **Time is a domain problem.** Store UTC, display Asia/Colombo, timestamp
   on the server (a client clock is user input, and attendance is money).
   Handle the guaranteed edge case — forgot to clock out — with an explicit
   'Incomplete' state and an HR resolution flow, because the worst answer
   is a record stuck forever in limbo.
5. **Approval ≠ creation.** HR/Finance *generate* payroll; Director
   *approves* it; after approval it's immutable. Segregation of duties is
   why real organizations trust software with money.

---

## STEP 5 — Verify like a professional, then keep it professional

**Principle:** "Done" is a claim; verification is the evidence. The last 10%
— consistency, empty states, honest error messages — is 90% of what reads
as "professional."

**The method:**
1. **Role-based walkthroughs.** One scripted end-to-end journey per role
   (login → landing → primary job → done), executed against the running
   app, every release. Five roles, five scripts. If a step needs
   explanation to a new user, it fails.
2. **Consistency sweep.** Users detect inconsistency subliminally and read
   it as "unfinished": one money formatter (LKR, integer-safe), one
   date/time util, one page-header pattern, one confirmation-dialog pattern
   for irreversible actions. Sameness is a feature.
3. **Design the unhappy paths.** Empty states with a next action ("No
   transactions yet — record one"), loading skeletons, error states with
   retry, a styled 403 page. Blank white rectangles are how prototypes
   announce themselves.
4. **Demo seed data.** One seeded user per role with known credentials.
   If showing off role separation takes more than 60 seconds, it won't be
   shown, reviewed, or maintained.
5. **Turn the audit into regression tests.** The matrix test from Step 3
   and the nav snapshots from Step 2 run in CI forever. Professional isn't
   a state you reach; it's a state you *enforce*.

---

## The mental model to keep (top-1% habits distilled)

1. **One source of truth, executable.** The permission matrix drives nav,
   route guards, API checks, and tests. Drift becomes impossible instead of
   forbidden.
2. **Organize by jobs, not tables.** URL structure = user's mental model of
   their work, not your ER diagram.
3. **UI hints, API enforces, DB guarantees.** Repeat until reflexive.
4. **State machines before screens.** Every serious feature is a set of
   states and legal transitions; screens are just projections of states.
5. **The last mile is the product.** Two apps with identical features are
   separated entirely by empty states, error messages, consistency, and
   flows that don't dead-end.
6. **Verification is part of building.** A feature without its test and its
   walkthrough script isn't finished; it's abandoned at 90%.

Where to go deeper: *Information Architecture* (Rosenfeld & Morville) for
Step 2; OWASP's Broken Access Control material for Step 3 — it is the #1
web vulnerability category, and your pre-fix app is a textbook specimen;
*Domain-Driven Design* (Evans) for Step 4's state thinking; Nielsen's 10
usability heuristics as the checklist behind Step 5.
