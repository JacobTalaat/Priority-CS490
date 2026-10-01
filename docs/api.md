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

When you add a route, copy the section above and fill in the new route: keep the section heading in the same `METHOD /path` backticked form, and give it a **Method** line, a **Path** line, a **Request** part, and a **Response** part with a JSON example for every status code it returns.
