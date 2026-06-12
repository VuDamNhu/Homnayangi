# Error Handling Strategy — Recipe AI

---

## Principles

- **Fail visibly at boundaries, silently in internals.** A broken nutrition panel must not crash the dish detail page.
- **Never expose stack traces, internal paths, or database details to the client.** All raw errors are logged server-side only.
- **Degrade gracefully.** Every non-critical feature has a fallback state — skeleton, empty state, or hidden — so the rest of the page remains usable.
- **Log enough to diagnose, not enough to retain PII.** No user input values in logs.

---

## 1. HTTP Error Pages

### 1.1 — 404 Not Found

**Triggers:**
- A dish or category slug that does not exist in MongoDB
- A dish that exists but is unpublished (treated as 404, not 403)
- Any URL that matches no route in the app

**User experience:**
- A branded, friendly page with the site header and footer intact
- Short message: the dish or page was not found
- A prominent CTA: "Go back to home" and a secondary CTA "Get a random dish"
- No technical details, no error codes visible to the user

**Implementation:**
- `app/not-found.tsx` — global fallback for unmatched routes
- Inside Server Components, call `notFound()` from `next/navigation` when a slug lookup returns `null`
- Dish detail and category pages call `notFound()` rather than rendering an empty page

**Logging:**
- 404s caused by slug lookups are not logged — they are normal user behaviour (mistyped URL, old bookmark)
- 404s on API routes that should never be reached are logged at `warn` level with the requested path

**Recovery:**
- No recovery needed — 404 is a terminal state for that request
- Old dish slugs that were renamed trigger a 301 redirect before the 404 is reached (handled via `previousSlugs[]` check)

---

### 1.2 — 500 Internal Server Error

**Triggers:**
- Unhandled exception in a Server Component or Route Handler
- MongoDB connection failure during a request
- Unexpected null dereference in data transformation

**User experience:**
- A branded error page with header and footer intact
- Short message: "Something went wrong on our end. We've been notified."
- A CTA: "Try again" (reloads the page) and "Go to home"
- No stack trace, no error message, no internal path

**Implementation:**
- `app/error.tsx` — catches errors thrown from Server Components within the nearest `<Suspense>` or layout boundary
- `app/global-error.tsx` — catches errors that escape all layout boundaries, including errors in the root layout itself; this replaces the entire HTML document so it includes its own `<html>` and `<body>`

**Logging:**
- Logged at `error` level with: timestamp, route path, error message, error name, stack trace
- No request body or query parameter values in the log entry
- In production, forwarded to the logging service (see §7)

**Recovery:**
- The "Try again" button triggers a client-side reload
- If the error is transient (momentary DB timeout), the reload succeeds
- If the error is persistent, the page renders the error boundary again — the user is not stuck in a blank screen

---

## 2. Database Errors

**Error types:**

| Error | Cause |
|---|---|
| Connection timeout | MongoDB Atlas unreachable, network issue |
| Query timeout | Slow query exceeds the configured timeout threshold |
| Validation error | Document fails Mongoose schema validation before save |
| Duplicate key error | Unique index violation (e.g. duplicate slug) |
| Cast error | Invalid ObjectId passed to a query |

**User experience:**
- Connection and query timeout during a page render → triggers the `error.tsx` boundary → user sees the 500 page
- Validation or duplicate key error during a form submission (admin) → API route returns `400` or `409` with a human-readable message → admin CMS form shows an inline field error
- Cast error (bad ID in URL) → API route returns `400` → admin sees "Invalid request"

**Logging:**
- All database errors are logged at `error` level
- Log includes: error type, collection name, operation (find / insert / update), and sanitised query filter (object keys only, no values)
- Connection failures log the Atlas cluster hostname only — no credentials

**Recovery:**

| Error | Recovery strategy |
|---|---|
| Connection timeout | The MongoDB connection uses a singleton with automatic reconnection. The next request will retry the connection. No manual intervention needed for transient outages. |
| Query timeout | Increase the index coverage or add a compound index. Logged queries that exceed 500 ms are flagged in logs for review. |
| Validation error | Fix the data in the form and resubmit. The API response includes the field name that failed. |
| Duplicate key | The API response returns `409 Conflict` with a message identifying the duplicate field (e.g. "A dish with this slug already exists"). |
| Cast error | A middleware function in the route handler catches Mongoose `CastError` and returns `400 Bad Request` before the error propagates. |

---

## 3. API Errors

All Route Handlers return a consistent error response shape:

```
{
  "success": false,
  "error": {
    "code": "DISH_NOT_FOUND",
    "message": "No dish found with that slug."
  }
}
```

### HTTP Status Code Map

| Situation | Status code |
|---|---|
| Resource not found | `404` |
| Invalid input / failed validation | `400` |
| Duplicate resource | `409` |
| Unauthenticated (admin routes) | `401` |
| Authenticated but wrong role | `403` |
| External dependency failure (Claude, Maps) | `502 Bad Gateway` |
| Unexpected server error | `500` |

### Error Code Registry

| Code | Meaning |
|---|---|
| `DISH_NOT_FOUND` | Dish lookup by slug or ID returned null |
| `RECIPE_NOT_FOUND` | Recipe lookup returned null |
| `CATEGORY_NOT_FOUND` | Category lookup returned null |
| `DUPLICATE_SLUG` | Slug already exists in the collection |
| `VALIDATION_FAILED` | Zod schema validation failed; details included |
| `UNAUTHENTICATED` | Request has no valid session |
| `UPLOAD_FAILED` | Cloudinary upload did not complete |
| `AI_UNAVAILABLE` | Claude API did not return a usable response |
| `MAPS_UNAVAILABLE` | Google Maps Places API call failed |
| `INTERNAL_ERROR` | Catch-all for unexpected failures |

**User experience (admin CMS):**
- `400` / `409` → inline form error under the relevant field
- `401` → redirect to `/admin/login`
- `403` → toast notification: "You do not have permission to perform this action"
- `500` / `502` → toast notification: "Something went wrong. Please try again."

**User experience (public site):**
- API errors on public pages are caught by the component and rendered as an empty state or skeleton, not as a page crash
- The dish detail page failing to load recipes shows "Recipes unavailable right now" rather than an error page

**Logging:**
- `400` and `404` — logged at `info` or not at all (normal traffic)
- `409` — logged at `warn`
- `500` and `502` — logged at `error` with full context

---

## 4. Image Upload Errors

**Error types:**

| Error | Cause |
|---|---|
| File too large | Raw upload exceeds the 10 MB limit |
| Invalid file type | File is not JPEG, PNG, or WebP |
| Cloudinary API failure | Network timeout or Cloudinary service issue |
| Signing failure | Server-side signing step fails unexpectedly |

**User experience (admin CMS):**
- File validation (size, type) runs client-side immediately on file selection — the admin sees an inline error before the upload is even attempted
- If Cloudinary upload fails after the file is sent, the admin sees a toast: "Image upload failed. Please try again."
- The form is not submitted if the image upload did not succeed — `publicId` is only written to the form state after Cloudinary confirms success
- A progress indicator shows during upload; it is replaced by the image preview on success or an error message on failure

**Logging:**
- Client-side validation failures are not logged
- Cloudinary API failures are logged at `error` level with: timestamp, upload preset used, file size, HTTP status from Cloudinary, Cloudinary error message
- Signing failures are logged at `error` level with the route path and error message

**Recovery:**
- Retry: the admin can re-attempt the upload immediately from the same form
- If Cloudinary is experiencing an outage, the form can still be saved without an image (image field is optional on most record types) and the image added later once the service recovers

---

## 5. External API Errors

### 5.1 Claude API (AI Nutrition Parsing)

**Error types:**

| Error | Cause |
|---|---|
| Rate limit (`429`) | Too many requests in the rate window |
| Service unavailable (`529` / `503`) | Anthropic API outage |
| Malformed response | Claude returned a response that cannot be parsed into the expected JSON schema |
| Timeout | Request exceeded the configured timeout (30 s) |

**User experience:**
- Nutrition parsing is admin-triggered — not automatic on page load
- If the call fails, the admin sees a toast: "Nutrition parsing failed. Please try again in a moment."
- The dish detail page on the public site shows the nutrition panel only if nutrition data exists in MongoDB. If it does not exist, the panel is hidden entirely — no error is shown to the visitor.

**Logging:**
- All Claude API errors logged at `error` level with: HTTP status, error type, model used, token count if available
- Malformed responses logged with the raw response body (truncated to 500 chars) to aid prompt debugging

**Recovery:**
- Rate limit → retry after the window resets (logged with the retry-after header value)
- Malformed response → admin can retry; if the problem persists, the prompt in `lib/ai/claude.ts` is the fix target
- Outage → no immediate recovery; admin retries when service is restored

---

### 5.2 Google Maps Places API (Nearby Restaurants)

**Error types:**

| Error | Cause |
|---|---|
| `ZERO_RESULTS` | No restaurants found near the coordinates |
| `REQUEST_DENIED` | Invalid API key or billing issue |
| `OVER_QUERY_LIMIT` | Daily quota exceeded |
| Network timeout | Request to Google servers timed out |
| Geolocation denied | User blocked the browser location prompt |

**User experience:**
- Geolocation denied → the "Nearby restaurants" section shows: "Enable location access in your browser to see restaurants near you." No error, no crash.
- `ZERO_RESULTS` → section shows: "No restaurants found nearby." with a suggestion to search manually on Google Maps
- `REQUEST_DENIED` / `OVER_QUERY_LIMIT` → section is hidden entirely; the rest of the dish detail page is unaffected
- Network timeout → section shows a retry button

**Logging:**
- `ZERO_RESULTS` — not logged (normal outcome)
- `REQUEST_DENIED` — logged at `error` level immediately; triggers an alert (billing or key issue requires human action)
- `OVER_QUERY_LIMIT` — logged at `warn` level with the current date; review quota allocation
- Timeout — logged at `warn` level with the coordinates and timeout duration

**Recovery:**
- `REQUEST_DENIED` → fix the API key or billing in Google Cloud Console; no code change required
- `OVER_QUERY_LIMIT` → increase quota in Google Cloud Console or add request caching (cache results per dish per day)
- Timeout → implement a 5-second timeout with a single automatic retry before showing the error state

---

## 6. Client-Side Errors

**Error types:**

| Error | Cause |
|---|---|
| `localStorage` unavailable | Private browsing mode or storage quota exceeded |
| Hydration mismatch | Server/client HTML differs (usually from date/time rendering) |
| Unhandled promise rejection | Fetch in a `useEffect` not wrapped in try/catch |

**User experience:**
- `localStorage` failure → favorites silently fall back to an in-memory array for the session; no error shown
- Hydration mismatch → Next.js suppresses the warning in production; the component re-renders from client state
- Unhandled rejection → caught by the nearest `error.tsx` boundary; user sees the error page for that section

**Logging:**
- Client-side errors are not sent to the server log by default at the current scale (10 000 users)
- If a browser error tracking service is added in Sprint 10, it would capture uncaught exceptions in the client bundle

---

## 7. Logging Strategy

### Log Levels

| Level | When to use |
|---|---|
| `error` | Unexpected failure requiring investigation or human action |
| `warn` | Degraded state that is recoverable but worth monitoring |
| `info` | Normal significant events (server start, DB connected) |
| `debug` | Verbose detail useful during development only; off in production |

### Log Entry Fields

Every server-side log entry includes:

| Field | Value |
|---|---|
| `timestamp` | ISO 8601, UTC |
| `level` | `error`, `warn`, `info`, `debug` |
| `message` | Human-readable description |
| `path` | Request path (e.g. `/api/dishes/pho-bo-ha-noi`) |
| `method` | HTTP method |
| `errorName` | Error class name (e.g. `MongoNetworkError`) |
| `stack` | Stack trace — `error` level only |

**Never included in logs:**
- User-submitted form values
- Raw query parameter values
- Authentication tokens or session data
- MongoDB credentials or API keys

### Log Output

| Environment | Output |
|---|---|
| Development | Console (stdout), formatted for readability |
| Production | Vercel log drain → external log aggregation service (e.g. Axiom, Logtail, or Datadog) |

Vercel captures stdout and stderr from all serverless function invocations automatically. A log drain forwards these to the external service for retention, search, and alerting.

---

## 8. Error Handling Summary

| Error scenario | User sees | Logged | Recovery |
|---|---|---|---|
| Unknown URL | Branded 404 page with CTAs | No | Redirect if old slug |
| Server crash | Branded 500 page with retry CTA | Yes — error | Retry / fix deploy |
| DB connection timeout | 500 page | Yes — error | Auto-reconnect |
| DB validation failure | Inline form error (admin) | Yes — warn | Fix input and resubmit |
| Duplicate slug | Inline conflict message (admin) | Yes — warn | Change slug |
| API 400 | Inline form error or toast | No | Fix input |
| API 401 | Redirect to login | No | Log in |
| Image too large | Inline file picker error | No | Compress and retry |
| Cloudinary upload fail | Toast with retry | Yes — error | Retry |
| Claude API fail | Toast (admin) / hidden panel (public) | Yes — error | Retry |
| Maps ZERO_RESULTS | "No restaurants found" message | No | None needed |
| Maps REQUEST_DENIED | Section hidden silently | Yes — error | Fix API key/billing |
| Geolocation denied | Prompt to enable location | No | User action |
| localStorage fail | In-memory fallback, no message | No | None needed |
