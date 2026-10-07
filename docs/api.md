# API reference

Every route the backend serves is written down here with an example request and response, so the website and the iOS app can be built against it.

The base URL for local development is `http://localhost:3000`. Every request and response body is JSON (`application/json`). Routes that take a body say so in their **Request** part; routes that take none say "No body".

Dynamic path segments keep the name of their Next.js folder, for example `/api/tasks/[id]`.

When a route is added, removed, or changed, update this file in the same pull request. `src/app/api/api-doc.test.ts` reads the route files under `src/app/api` and fails when they disagree with this file, so the doc cannot drift silently.

## Routes

### `GET /api/health`

Reports whether the app can reach its PostgreSQL database. Clients can use it as a readiness probe before calling any other route.

- **Method**: `GET`
- **Path**: `/api/health`

**Request**

No body.

```bash
curl http://localhost:3000/api/health
```

**Response**

`200` — the database answered the query:

```json
{
  "status": "ok"
}
```

`503` — the database is unreachable:

```json
{
  "status": "error"
}
```

---

### `POST /api/auth/signup`

Creates a student account, then creates a session token for that account.

- **Method**: `POST`
- **Path**: `/api/auth/signup`

**Request**

JSON body with:

- `email` (string)
- `password` (string, minimum 8 characters)

```bash
curl -i -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"correct-horse"}'
```

**Response**

`201` — account and session created:

```json
{
  "token": "opaque-bearer-token",
  "expiresAt": "2026-11-06T18:00:00.000Z",
  "user": {
    "id": 1,
    "email": "student@example.com"
  }
}
```

`400` — malformed body, invalid email, or password shorter than 8 characters:

```json
{
  "error": "Invalid body"
}
```

`409` — email already registered:

```json
{
  "error": "Email already registered"
}
```

---

### `POST /api/auth/login`

Authenticates an existing account and returns a new session token.

- **Method**: `POST`
- **Path**: `/api/auth/login`

**Request**

JSON body with:

- `email` (string)
- `password` (string, minimum 8 characters)

```bash
curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"correct-horse"}'
```

**Response**

`200` — credentials valid:

```json
{
  "token": "opaque-bearer-token",
  "expiresAt": "2026-11-06T18:00:00.000Z",
  "user": {
    "id": 1,
    "email": "student@example.com"
  }
}
```

`400` — malformed body, invalid email, or password shorter than 8 characters:

```json
{
  "error": "Invalid body"
}
```

`401` — email/password pair is not valid:

```json
{
  "error": "Invalid email or password"
}
```

---

### `POST /api/auth/refresh`

Rotates the current session: deletes the row for the presented token and creates a fresh session with a new token and expiry.

- **Method**: `POST`
- **Path**: `/api/auth/refresh`

**Request**

No body. Send an `Authorization` header with the bearer token from sign up, log in, or a previous refresh. The presented token is invalidated by the response.

```bash
curl -i -X POST http://localhost:3000/api/auth/refresh \
  -H "Authorization: ******"
```

**Response**

`200` — session rotated:

```json
{
  "token": "new-opaque-bearer-token",
  "expiresAt": "2026-11-06T18:00:00.000Z",
  "user": {
    "id": 1,
    "email": "student@example.com"
  }
}
```

`401` — token missing, malformed, invalid, or expired:

```json
{
  "error": "Unauthorized"
}
```

---

### `GET /api/auth/me`

Returns the currently authenticated user from the bearer token in `Authorization`.

- **Method**: `GET`
- **Path**: `/api/auth/me`

**Request**

No body. Send an `Authorization` header with the bearer token from sign up or log in.

```bash
curl -i http://localhost:3000/api/auth/me \
  -H "Authorization: ******"
```

**Response**

`200` — token valid and session active:

```json
{
  "id": 1,
  "email": "student@example.com"
}
```

`401` — token missing, malformed, invalid, or expired:

```json
{
  "error": "Unauthorized"
}
```

---

When you add a route, copy the section above and fill in the new route: keep the section heading in the same `METHOD /path` backticked form, and give it a **Method** line, a **Path** line, a **Request** part, and a **Response** part with a JSON example for every status code it returns.
