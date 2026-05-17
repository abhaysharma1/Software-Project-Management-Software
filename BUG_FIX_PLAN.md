# SPMS Bug & Glitch Fix Plan

**Generated:** 2026-05-17  
**Tests:** 153/153 passing (all clear)  
**TypeScript:** 1 deprecation warning (baseUrl in TS 6)  
**ESLint:** Fails to run (config issue)

---

## Phase 1: Critical Bugs (Data Integrity & Security) ✅ COMPLETED

### 1. `fetchContributorCount` returns 0 for 1-contributor repos ✅
- **File:** `src/lib/github.ts:54-61`
- **Fix applied:** Parse response body JSON when no `Link` header is present. Returns `body.length` (0 or 1) instead of defaulting to 0.
- **Commit:** Phase 1

### 2. No Prisma transactions — partial updates cause data inconsistency ✅
- **Files:** `src/services/submission.service.ts`, `src/services/group.service.ts`, `src/services/comment.service.ts`
- **Fix applied:** Wrapped all multi-table write operations in `prisma.$transaction()`:
  - `submitMilestone` — submission create + milestone update + activity log + notification
  - `gradeSubmission` — submission update + milestone update + activity log + notification + project completion
  - `joinGroupByCode` — add member + notification
  - `requestJoinGroup` — create join request + notification
  - `approveJoinRequest` — update request + add member + notification
  - `rejectJoinRequest` — update request + notification
  - `addComment` — create comment + notification + activity log
  - Also added missing `pushEvent` calls to `joinGroupByCode`
- **Commit:** Phase 1

### 3. Email failure orphans verification tokens ✅
- **File:** `src/services/auth.service.ts:38-42`
- **Fix applied:** Wrapped `sendPasswordResetEmail()` in try/catch. On failure, the created token is deleted and a user-friendly error is thrown instead of leaving orphaned tokens.
- **Commit:** Phase 1

### 4. `gradeSubmission` has zero authorization checks ✅
- **File:** `src/services/submission.service.ts:58-107`
- **Fix applied:** Added defense-in-depth authorization:
  1. Rejects non-TEACHER/ADMIN callers
  2. For TEACHER callers, verifies they are the class teacher of the project
  3. ADMIN can grade any project
- **Note:** `submitMilestone` TEACHER/ADMIN elevation (Phase 3 issue) still pending.
- **Commit:** Phase 1

### 5. SSE memory leak from stale client connections ✅
- **Files:** `src/lib/sse.ts`, `src/app/api/notifications/stream/route.ts`
- **Fix applied:**
  - Added `lastActivity` timestamp tracking per client entry
  - `pushEvent` now prunes dead connections during normal operation
  - Added `pruneStaleClients()` with a 120s inactivity threshold, running on a 60s interval
  - Stream route now listens for `close` event in addition to `abort`
- **Commit:** Phase 1

---

## Phase 2: High-Impact Functional Bugs

### 6. Classes search input is completely non-functional
- **File:** `src/components/features/classes/classes-page-content.tsx:157`
- **Problem:** The `<Input>` has `placeholder="Search classes..."` but no `value` binding, no `onChange` handler, and no backing `useState`. It's a decorative element — users can type but nothing happens.
- **Fix:** Add `const [search, setSearch] = useState("")`, bind `value` and `onChange` to the input, and implement client-side filtering.

### 7. `fetchUsers()` called without `reset=true` after CRUD mutations
- **File:** `src/app/(dashboard)/admin/users/page.tsx:120,152,166,181`
- **Problem:** `handleAdd`, `handleEdit`, `handleDelete`, and `toggleSuspend` all call `fetchUsers()` with the default `reset=false`. This means they **append** data using the existing `nextCursor` instead of refreshing from scratch. After a delete, the deleted user remains visible.
- **Fix:** Change all four calls to `fetchUsers(true)`.

### 8. `addComment` permanently disables the comment form on API error
- **File:** `src/components/features/projects/teacher-project-detail.tsx:68`
- **Problem:** When `!res.ok`, the function returns early with `setSubmitting(null)` never called. The submit button and textarea remain permanently disabled (`submitting === "comment"`).
- **Fix:** Add `setSubmitting(null);` before the `return` on line 68.

### 9. Notification link uses sender's role, not recipient's
- **File:** `src/services/comment.service.ts:26`
- **Problem:** `const link = \`/${userRole === "TEACHER" || userRole === "ADMIN" ? "teacher" : "student"}/projects/${project.id}\`` — this constructs the link based on the **commenter's** role. If a TEACHER comments on a student's project, the notification sent to the student has a `/teacher/...` link, which breaks navigation for the student.
- **Fix:** Look up the recipient's role and use it for the link. Or use a role-agnostic path with server-side redirect.

### 10. Four `group.service.ts` notification calls missing `link` field
- **File:** `src/services/group.service.ts:58,84,100,115`
- **Problem:** `notificationRepository.create()` calls in `joinGroupByCode`, `requestJoinGroup`, `approveJoinRequest`, and `rejectJoinRequest` do not include a `link` property. Users clicking these notifications go nowhere.
- **Fix:** Add appropriate `link` to each notification (e.g., `/student/groups`, `/teacher/groups`, `/student/projects/{id}` depending on context).

### 11. `class.service.ts` returns zero classes for STUDENT role
- **File:** `src/services/class.service.ts:21`
- **Problem:** `const where = role === "ADMIN" ? undefined : { teacherId: userId }` — for non-ADMIN roles (including STUDENT), it filters by `teacherId: userId`. Students are never teachers, so they see zero classes.
- **Fix:** Add STUDENT handling: `const where = role === "ADMIN" ? undefined : role === "STUDENT" ? { members: { some: { userId } } } : { teacherId: userId }`.

### 12. Sidebar: Dashboard link highlighted on ALL sub-pages
- **File:** `src/components/layouts/sidebar.tsx:228`
- **Problem:** `const isActive = pathname === item.href || pathname.startsWith(item.href + "/")` — for dashboard links (`/admin`, `/teacher`, `/student`), the `startsWith` check makes them active on every sub-page. The Dashboard nav item is always highlighted.
- **Fix:** For dashboard-level items, use exact matching (same-depth check). E.g., check that `pathname.split("/").length === item.href.split("/").length` for the `startsWith` match.

### 13. ESLint configuration broken
- **File:** `package.json` script + missing/minformed ESLint config
- **Problem:** `npm run lint` fails with: `Invalid project directory provided, no such directory: D:\Projects\opencode test\spms\lint`. This suggests ESLint is trying to find a `lint/` directory instead of linting the project root.
- **Fix:** Check `eslint.config.js` (or `.eslintrc.*`) for misconfiguration. The `next lint` command should be run from the project root. Verify the eslint config extends `next/core-web-vitals` correctly.

### 14. TypeScript 6 `baseUrl` deprecation
- **File:** `tsconfig.json:30`
- **Problem:** `"baseUrl": "."` is deprecated in TypeScript 6 and will be removed in TypeScript 7. The `paths` mapping already exists (`"@/*": ["./src/*"]`) which handles the typical use case.
- **Fix:** Add `"ignoreDeprecations": "6.0"` to silence the error, or refactor to remove `baseUrl` and adjust `paths` if needed.

---

## Phase 3: Medium-Impact Bugs

### 15. Login session fetch race condition
- **File:** `src/app/login/page.tsx:43-45`
- **Problem:** Immediately after `signIn("credentials", { redirect: false })`, the code calls `fetch("/api/auth/session")`. The session cookie may not be fully established yet, causing a null/empty session response and silent fallthrough.
- **Fix:** Use `useSession` from `next-auth/react` which reactively subscribes to session state. Or add a retry loop with a short delay.

### 16. Silent role fallthrough to `/student`
- **File:** `src/app/login/page.tsx:48-51`
- **Problem:** If `session?.user?.role` is `undefined` (race condition, malformed session), the `else` branch redirects to `/student` by default. An unauthenticated or misidentified user lands on the student dashboard.
- **Fix:** Validate `role` is a recognized value before redirecting. Redirect to error or back to login if unrecognized.

### 17. Email enumeration via forgot-password API
- **File:** `src/services/auth.service.ts:31-33` + `src/app/api/auth/forgot-password/route.ts`
- **Problem:** Returns "No account found with that email" (400) for unknown emails vs `{ success: true }` (200) for known emails. Attackers can enumerate registered emails.
- **Fix:** Always return HTTP 200 with a generic message. Log the specific error server-side.

### 18. Email enumeration via register API
- **File:** `src/services/auth.service.ts:11-12` + `src/app/api/auth/register/route.ts`
- **Problem:** Returns "Email already registered" (400) for existing emails. Attackers can enumerate registered emails.
- **Fix:** Return a generic "Registration failed" message regardless of cause. Log the specific reason server-side.

### 19. Registration missing password confirmation
- **File:** `src/app/register/page.tsx` + `src/validators/user.ts`
- **Problem:** Only a single password field with no confirmation. Users can mistype and lock themselves out of their new account.
- **Fix:** Add a password confirmation field to the form and a `refine` check in the Zod schema.

### 20. Missing Suspense boundary for `useSearchParams`
- **File:** `src/app/reset-password/page.tsx:17`
- **Problem:** Calls `useSearchParams()` without a wrapping `<Suspense>` boundary. Next.js will throw during static generation or client rendering.
- **Fix:** Wrap the component in `<Suspense>` (same pattern as `login/page.tsx`).

### 21. Six GET handlers missing try/catch on `paginationSchema.parse()`
- **Files:** `classes/route.ts:36`, `projects/route.ts:33`, `groups/route.ts:34`, `comments/route.ts:38`, `notifications/route.ts:18`, `admin/users/route.ts:16`
- **Problem:** Invalid query params (e.g., `?limit=abc`) cause an unhandled `ZodError` → generic 500 instead of proper 400 response.
- **Fix:** Wrap `paginationSchema.parse()` in try/catch, return 400 on validation failure.

### 22. Five dynamic routes have `await params` outside try/catch
- **Files:** `groups/[id]/leave/route.ts:10`, `groups/[id]/request-join/route.ts:10`, `groups/[id]/requests/route.ts:9`, `milestones/[id]/route.ts:34`, `groups/requests/[id]/route.ts:15`
- **Problem:** If `params` fails to resolve, the error is completely unhandled (outside any try block).
- **Fix:** Move `await params` inside the try block.

### 23. Inconsistent HTTP status codes (401 vs 403) for role failures
- **Files:** `classes/route.ts:9`, `milestones/route.ts:9`, `milestones/[id]/route.ts:30`, `submissions/route.ts:29`, `groups/requests/[id]/route.ts:10` — return 401
- **Files:** `admin/users/route.ts:9,24`, `admin/users/[id]/route.ts:9,32` — return 403
- **Fix:** Unify to 403 Forbidden for authenticated users lacking permissions (401 is for missing/invalid auth).

### 24. Milestones missing `orderBy: { order: "asc" }`
- **File:** `src/repositories/milestone.repository.ts:10`
- **Problem:** `findManyByProject` returns milestones in arbitrary order (likely insertion order), but milestones have an `order` field.
- **Fix:** Add `orderBy: { order: "asc" }` to the query.

### 25. `notification.repository.ts` always limits to 50 items
- **File:** `src/repositories/notification.repository.ts:11`
- **Problem:** `take: pagination?.limit ?? 50` — when `pagination` is undefined, the fallback is `50`, not "all". Inconsistent with other repositories that use `...(pagination ? buildPaginationArgs(pagination) : {})`.
- **Fix:** Use the same pattern as other repositories: conditionally apply pagination args.

### 26. `github.service.ts` silently swallows sync errors
- **File:** `src/services/github.service.ts:49-51,67-69`
- **Problem:** `catch { results.push(repo) }` — when a repo sync fails, the original stale data is pushed into results with no indication of failure. The caller can't distinguish success from failure.
- **Fix:** Include an error flag or status in the result, or emit an error log. At minimum, log the error.

### 27. Submission/comment notifications missing `link`
- **File:** `src/services/submission.service.ts:45-52`
- **Problem:** Notification created on milestone submission doesn't include a `link` field, so the recipient can't navigate to the relevant page.
- **Fix:** Add `link: \`/${recipientRole}/projects/${projectId}\`` to the notification.

### 28. `createGroup`/`leaveGroup` send no notification
- **File:** `src/services/group.service.ts:10,69`
- **Problem:** When a group is created or a member leaves, no notification is sent to the class teacher or group members.
- **Fix:** Add appropriate notification creation to both methods.

---

## Phase 4: Low-Impact & Code Quality

### 29. No input trimming (email/name fields)
- **Files:** `login/page.tsx`, `register/page.tsx`, `forgot-password/page.tsx`
- **Fix:** Trim email and name inputs client-side or in validators/services.

### 30. Reset token leaked in URL query parameter
- **File:** `src/lib/email.ts:32`
- **Problem:** `${resetUrl}?token=${token}` — token visible in browser history, server logs, referrer headers.
- **Fix:** Use POST-based flow or URL fragment (`#token=...`).

### 31. Error messages leak internal details
- **Files:** All route catch blocks
- **Problem:** `return NextResponse.json({ error: error.message }, { status: 400 })` — exposes raw error messages to client.
- **Fix:** Use whitelist of known messages; return generic "Internal server error" (500) for unexpected errors.

### 32. No rate limiting on any auth endpoint
- **Files:** All auth routes (login, register, forgot-password, reset-password)
- **Fix:** Implement rate limiting (token bucket or sliding window).

### 33. Login ignores `callbackUrl`
- **File:** `login/page.tsx:48-51`
- **Problem:** Always redirects based on role, ignoring any original destination URL.
- **Fix:** Check for `callbackUrl` search parameter and use it as redirect target.

### 34. Duplicate session/JWT configuration
- **Files:** `auth.config.ts:8-11` and `auth.ts:44-50`
- **Problem:** Both files define `session.maxAge` and `session.strategy`. `auth.ts` overrides `auth.config.ts` values. If one is updated but not the other, values diverge.
- **Fix:** Remove session/JWT config from one file. Keep in `auth.config.ts` (config) and remove from `auth.ts` (instance).

### 35. `completedAt` set on REJECTED milestones
- **File:** `src/services/milestone.service.ts:44-46`
- **Problem:** `if (input.status === "APPROVED" || input.status === "REJECTED") { updateData.completedAt = new Date() }` — a rejected milestone is semantically not "completed."
- **Fix:** Only set `completedAt` for APPROVED status.

### 36. `formatDate` throws on invalid input
- **File:** `src/lib/utils.ts:13`
- **Problem:** `new Date(date)` produces Invalid Date for null/undefined/bad input, causing `Intl.DateTimeFormat.format()` to throw RangeError.
- **Fix:** Add guard: `if (!date) return ""` or wrap in try/catch.

### 37. Unused import: `signOut` in sidebar
- **File:** `src/components/layouts/sidebar.tsx:25`
- **Fix:** Remove unused import.

### 38. `githubRepository`/`githubService` not in barrel exports
- **Files:** `src/repositories/index.ts`, `src/services/index.ts`
- **Fix:** Add missing exports.

### 39. `deleteMilestone` has no authorization
- **File:** `src/services/milestone.service.ts:73-76`
- **Problem:** Any authenticated user can delete any milestone.
- **Fix:** Add same authorization check as `createMilestone` (teacher/class ownership).

### 40. `getUnreadCount` type mismatch
- **File:** `src/services/notification.service.ts:14`
- **Problem:** `isRead: false` may not match `Prisma.NotificationWhereInput` types.
- **Fix:** Explicitly type or satisfy Prisma's type expectations.

### 41. `joinGroupByCode` doesn't check class group membership
- **File:** `src/services/group.service.ts:47-67`
- **Problem:** User can join multiple groups within the same class via different invite codes.
- **Fix:** Add check: user must not already be in a group for that class.

### 42. `approveJoinRequest` race condition
- **File:** `src/services/group.service.ts:96-110`
- **Problem:** Doesn't check if group is full or user already a member between request creation and approval.
- **Fix:** Add validation before approving.

### 43. `Record<string, unknown>` + `as Prisma.XCreateInput` casts
- **Files:** All repository files
- **Problem:** Bypasses all TypeScript type safety. Misspelled field names or wrong types only caught at runtime.
- **Fix:** Use proper Prisma-generated types in repository method signatures.

### 44. `markRead` updates state without checking API response
- **File:** `notifications/page.tsx:92-95`
- **Problem:** Optimistic update with no rollback — if API fails, notification visually appears read but isn't.
- **Fix:** Check `res.ok` before updating state.

### 45. Redundant `setLoading(false)` call
- **File:** `student-projects-content.tsx:82,87`
- **Fix:** Remove the redundant call in the try block (line 82) — `finally` block handles it.

---

## Implementation Order

```
Phase 1 (Critical) ──► Phase 2 (High) ──► Phase 3 (Medium) ──► Phase 4 (Low)
```

**Verification gates between phases:**
- `npm run typecheck` — must pass with no errors
- `npm test` — all 153 tests must pass (update mocks/tests as needed)
- Manual smoke test of affected features

**Risk notes:**
- Adding Prisma transactions may require test mock updates (transactions need `$transaction` mock)
- Authorization changes in `gradeSubmission` may break existing teacher workflows — verify with test accounts
- SSE fix requires stream format to remain compatible with existing frontend EventSource consumers
