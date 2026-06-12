# Logging Strategy — Recipe AI

---

## Principles

- **Log the why, not the what.** Record the context needed to diagnose a problem — not a transcript of normal operation.
- **Never log PII or secrets.** No email addresses, form values, tokens, passwords, or API keys in any log entry.
- **Structured over plaintext.** All log entries are JSON objects so they can be queried, filtered, and alerted on by the log aggregation service.
- **Levels are a contract.** `error` means human action may be required. `warn` means something degraded but recovered. `info` is normal significant events. `debug` is off in production.
- **Logs complement, not replace, monitoring.** Metrics and uptime checks catch outages. Logs explain them.

---

## 1. Log Levels

| Level | When to use | Production |
|---|---|---|
| `error` | Unexpected failure; investigation or human action likely required | On |
| `warn` | Degraded behaviour that recovered, or a condition worth watching | On |
| `info` | Normal significant lifecycle events (server start, DB connected, job complete) | On |
| `debug` | Verbose detail useful during local development | Off |

In production, only `error`, `warn`, and `info` are emitted. `debug` is compiled out or suppressed by the log level setting in the environment variable `LOG_LEVEL`.

---

## 2. Log Entry Schema

Every log entry is a flat JSON object with a mandatory base set of fields. Additional fields are appended per log category.

### Base Fields (all entries)

| Field | Type | Value |
|---|---|---|
| `timestamp` | string | ISO 8601, UTC — `2026-06-12T08:30:00.000Z` |
| `level` | string | `error` / `warn` / `info` / `debug` |
| `service` | string | `recipe-ai` — constant; useful when log drain feeds multiple services |
| `environment` | string | `production` / `staging` / `development` |
| `message` | string | Human-readable description of the event |

### Never Included in Any Log Entry

| Field | Reason |
|---|---|
| User email or name | PII |
| Form field values | PII / potentially sensitive |
| Raw query parameters | May contain search terms entered by users |
| Session tokens or cookies | Security |
| MongoDB URI | Security |
| Cloudinary API secret | Security |
| Anthropic API key | Security |
| Google Maps API key | Security |
| Stack traces on `warn` / `info` | Noise; reserved for `error` only |

---

## 3. Error Logs

Logged whenever an unhandled or explicitly caught exception occurs in a server-side context.

### What to Log

| Field | Value |
|---|---|
| `level` | `error` |
| `message` | Short description of what failed |
| `errorName` | Exception class name — `MongoNetworkError`, `ZodError`, `TypeError`, etc. |
| `errorMessage` | `error.message` — the raw exception message |
| `stack` | Full stack trace |
| `path` | Request path — `/api/dishes/pho-bo-ha-noi` |
| `method` | HTTP method — `GET`, `POST`, `PATCH`, `DELETE` |
| `statusCode` | HTTP response code that was (or would be) returned |
| `requestId` | Unique ID per request (generated at middleware level) for correlation |

### What Not to Log

- Request headers (may contain auth tokens)
- Request body (may contain form input)
- Response body

### Examples of Logged Errors

| Scenario | `errorName` | `level` |
|---|---|---|
| Uncaught exception in a Server Component | `Error` | `error` |
| MongoDB connection drops mid-request | `MongoNetworkError` | `error` |
| Cloudinary upload fails with 5xx | `CloudinaryError` | `error` |
| Claude API returns non-200 | `AnthropicAPIError` | `error` |
| Google Maps returns `REQUEST_DENIED` | `MapsRequestDeniedError` | `error` |
| Zod validation throws in a route handler | `ZodError` | `warn` |
| Mongoose duplicate key on save | `MongoServerError` | `warn` |

---

## 4. API Logs

Logged on every inbound request to `/api/*` route handlers.

### What to Log

**Request log** (logged at the start of every API request):

| Field | Value |
|---|---|
| `level` | `info` |
| `message` | `api.request` |
| `path` | `/api/dishes` |
| `method` | `POST` |
| `requestId` | Unique ID for this request |
| `userAgent` | Browser or bot identifier (no PII) |

**Response log** (logged after the handler returns):

| Field | Value |
|---|---|
| `level` | `info` (success) / `warn` (4xx) / `error` (5xx) |
| `message` | `api.response` |
| `path` | `/api/dishes` |
| `method` | `POST` |
| `statusCode` | `201`, `400`, `500`, etc. |
| `durationMs` | Time from request received to response sent |
| `requestId` | Same ID as the request log — enables correlation |

### What Not to Log

- Request body contents
- Response body contents
- Authentication headers
- Cookie values

### Log Level by Status Code

| Status range | Log level |
|---|---|
| 2xx | `info` |
| 3xx | `info` |
| 4xx | `warn` |
| 5xx | `error` |

### High-frequency Routes

`GET /api/dishes/random` and `GET /api/search` may be called very frequently. To avoid log volume explosion, these routes log at `debug` level in production (effectively suppressed), unless they return a non-2xx status.

---

## 5. Database Logs

Logged at the MongoDB connection layer and on significant query events.

### What to Log

**Connection lifecycle:**

| Event | Level | Fields |
|---|---|---|
| MongoDB connection established | `info` | `message: db.connected`, `host` (hostname only, no credentials), `durationMs` |
| MongoDB connection lost | `error` | `message: db.disconnected`, `host`, `reason` |
| Reconnection attempt | `warn` | `message: db.reconnecting`, `attempt` (attempt number), `host` |
| Reconnection succeeded | `info` | `message: db.reconnected`, `host`, `durationMs` |

**Slow queries:**

Any query exceeding 500 ms is logged at `warn` level.

| Field | Value |
|---|---|
| `level` | `warn` |
| `message` | `db.slowQuery` |
| `collection` | Collection name — `dishes`, `recipes`, etc. |
| `operation` | `find`, `findOne`, `insertOne`, `updateOne`, `deleteOne`, `aggregate` |
| `filterKeys` | Array of filter key names only — e.g. `["slug", "published"]` — never values |
| `durationMs` | Query duration |

**Write errors:**

| Event | Level | Fields |
|---|---|---|
| Validation error on save | `warn` | `message: db.validationError`, `collection`, `fields` (array of failing field names only) |
| Duplicate key error | `warn` | `message: db.duplicateKey`, `collection`, `index` (index name) |
| Write operation failed | `error` | `message: db.writeFailed`, `collection`, `operation`, `errorMessage` |

### What Not to Log

- Query filter values (may contain user-submitted data)
- Document contents
- MongoDB connection string

---

## 6. AI Logs

Logged on every call to the Claude API for nutrition parsing or description generation.

### What to Log

**Request log:**

| Field | Value |
|---|---|
| `level` | `info` |
| `message` | `ai.request` |
| `feature` | `nutrition_parsing` / `description_generation` |
| `model` | Model ID used — e.g. `claude-sonnet-4-6` |
| `inputTokens` | Estimated input token count |
| `requestId` | Correlates with the parent API request log |
| `dishId` | MongoDB ObjectId of the dish being processed |

**Response log:**

| Field | Value |
|---|---|
| `level` | `info` (success) / `error` (failure) |
| `message` | `ai.response` |
| `feature` | Same as request |
| `model` | Model ID |
| `inputTokens` | Actual input tokens billed |
| `outputTokens` | Actual output tokens billed |
| `durationMs` | End-to-end latency of the API call |
| `statusCode` | HTTP status from Anthropic API |
| `parsedOk` | `true` / `false` — whether the response parsed into the expected schema |

**Parse failure log** (when the response is valid JSON but does not match the schema):

| Field | Value |
|---|---|
| `level` | `error` |
| `message` | `ai.parseFailed` |
| `feature` | Feature name |
| `rawResponseSnippet` | First 300 characters of the raw response — for prompt debugging |
| `validationErrors` | Array of schema field names that failed |

### What Not to Log

- The full prompt text (may include dish description content)
- The full raw response body (beyond the snippet in `ai.parseFailed`)
- API key or model pricing

### Token Monitoring

All `inputTokens` and `outputTokens` values are aggregated weekly. If the weekly token spend trends above a threshold (set per billing budget), a `warn` alert fires before the hard limit is reached.

---

## 7. Admin Activity Logs

An audit trail of all write operations performed by admin users through the CMS. This is a separate log category from error and API logs — it records *intent*, not just *outcome*.

### What to Log

Every admin write action creates an audit entry:

| Field | Value |
|---|---|
| `level` | `info` |
| `message` | `admin.action` |
| `action` | Verb — `create`, `update`, `delete`, `publish`, `unpublish`, `activate`, `deactivate` |
| `resource` | Resource type — `dish`, `recipe`, `category`, `ingredient`, `banner`, `user` |
| `resourceId` | MongoDB ObjectId of the affected document |
| `resourceSlug` | Human-readable identifier where available (dish slug, category slug) |
| `adminId` | MongoDB ObjectId of the admin who performed the action |
| `changedFields` | Array of field names that changed on `update` — e.g. `["name", "description"]` — never the values |
| `timestamp` | ISO 8601, UTC |
| `requestId` | Correlates with the API request log for the same action |

### Covered Actions

| Action | Resource | Trigger |
|---|---|---|
| `create` | dish, recipe, category, ingredient, banner, user | POST to admin API |
| `update` | dish, recipe, category, ingredient, banner, user | PATCH to admin API |
| `delete` | dish, recipe, category, ingredient, banner, user | DELETE to admin API |
| `publish` | dish | Status toggle to `published: true` |
| `unpublish` | dish | Status toggle to `published: false` |
| `activate` | banner, user | Status toggle |
| `deactivate` | banner, user | Status toggle |
| `trigger` | ai_nutrition, ai_description | Admin triggers AI feature |

### What Not to Log

- The content of updated fields (description text, image URLs, etc.)
- Admin passwords (never logged anywhere)
- Login and logout events (handled by NextAuth — separate session log)

### Retention

Admin activity logs are retained for **12 months** regardless of the general retention policy, for accountability and audit purposes.

---

## 8. Retention Strategy

| Log category | Retention period | Justification |
|---|---|---|
| Error logs | 30 days | Sufficient for post-incident investigation at this scale |
| API request/response logs | 14 days | High volume; useful for debugging recent issues only |
| Database logs | 30 days | Covers most incident timelines |
| AI logs | 60 days | Needed for cost tracking and prompt iteration review |
| Admin activity logs | 12 months | Audit trail; accountability |

After retention expires, logs are deleted automatically by the log aggregation service. No manual archiving.

At ~10 000 users, log volume is modest. If the product scales past 100 000 users, API request logs should be sampled (e.g. 10% of 2xx requests) to control storage cost while retaining 100% of non-2xx logs.

---

## 9. Monitoring & Alerting

Monitoring is layered: uptime checks catch outages, log-based alerts catch application errors, and dashboards provide situational awareness.

### 9.1 Uptime Monitoring

| Target | Check frequency | Alert on |
|---|---|---|
| `https://recipeai.vn/` | Every 1 minute | Response time > 3 s or status ≠ 200 |
| `https://recipeai.vn/api/dishes/random` | Every 5 minutes | Status ≠ 200 |
| MongoDB Atlas | Native Atlas monitoring | Cluster CPU > 80%, connections > 80% of limit |

### 9.2 Log-based Alerts

Alerts are configured in the log aggregation service and fire to a designated channel (Slack, email, or PagerDuty).

| Alert | Condition | Severity |
|---|---|---|
| High error rate | More than 10 `error`-level entries in any 5-minute window | Critical |
| DB disconnection | Any `db.disconnected` event | Critical |
| Maps API key denied | Any `MapsRequestDeniedError` log entry | High |
| Slow query spike | More than 5 `db.slowQuery` entries in 10 minutes | Medium |
| AI parse failures | More than 3 `ai.parseFailed` entries in 1 hour | Medium |
| AI token budget | Weekly token total exceeds 80% of budget threshold | Low |
| 5xx API spike | More than 20 `statusCode: 5xx` entries in 5 minutes | High |

### 9.3 Dashboards

The log aggregation service hosts the following live dashboards:

| Dashboard | Key metrics |
|---|---|
| **Operations** | Error rate over time, API p50/p95/p99 latency, DB connection status |
| **AI Usage** | Daily token count (input + output), parse success rate, avg latency per feature |
| **Admin Activity** | Actions per day by resource type, most active admin account |
| **Content** | Dishes and recipes created/updated per week |

### 9.4 On-Call Escalation

At the current scale (~10 000 users), a single on-call contact is sufficient.

| Severity | Response time | Channel |
|---|---|---|
| Critical (DB down, site down) | 15 minutes | Direct message + phone |
| High (key API failure, 5xx spike) | 1 hour | Slack channel |
| Medium (slow queries, parse failures) | Next business day | Slack channel |
| Low (budget warnings) | Next business day | Email |

---

## 10. Log Infrastructure

| Environment | Log output | Storage |
|---|---|---|
| Development | Console stdout, pretty-printed | Not stored |
| Staging | Vercel log drain → log aggregation service | 7-day retention |
| Production | Vercel log drain → log aggregation service | Per §8 retention policy |

### Recommended Log Aggregation Services

| Service | Notes |
|---|---|
| Axiom | Native Vercel integration; free tier generous for this scale |
| Logtail (Better Stack) | Simple setup, affordable; good dashboard tooling |
| Datadog | More powerful but overkill at 10 000 users; reconsider at scale |

Vercel automatically captures all `console.log` / `console.error` output from serverless function invocations and routes it to the configured log drain. No custom transport is required in the application code itself — the logger writes to stdout and Vercel handles the rest.
