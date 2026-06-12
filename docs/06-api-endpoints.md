# 6. Key API Endpoints

All endpoints are prefixed with `/api`. Authentication via NextAuth.js session cookie.

---

## Courses

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/courses` | List user's courses (filtered by enrollment/teaching) |
| `POST` | `/api/courses` | Create course (teacher only) |
| `GET` | `/api/courses/:id` | Get course details with enrollment count |
| `PATCH` | `/api/courses/:id` | Update course metadata (teacher only) |
| `DELETE` | `/api/courses/:id` | Archive course (teacher only) |
| `POST` | `/api/courses/join` | Join course via code (student) |

**Query params for `GET /api/courses`**:
- `role` — filter by `teacher` or `student`
- `archived` — include archived courses (`?archived=true`)

---

## Stream (Posts)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/courses/:id/stream` | Paginated stream posts (cursor-based) |
| `POST` | `/api/courses/:id/posts` | Create post (teacher only) |
| `PATCH` | `/api/posts/:id` | Edit post (author only) |
| `DELETE` | `/api/posts/:id` | Delete post (author or teacher) |
| `PATCH` | `/api/posts/:id/pin` | Toggle pin (teacher only) |

**Query params for `GET .../stream`**:
- `cursor` — opaque cursor for pagination
- `limit` — page size (default 20, max 50)
- `type` — filter by `ANNOUNCEMENT`, `ASSIGNMENT`, `MATERIAL`

---

## Comments

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/posts/:id/comments` | List comments for a post |
| `POST` | `/api/posts/:id/comments` | Add comment (any enrolled user) |
| `DELETE` | `/api/comments/:id` | Delete comment (author or teacher) |

**Response shape (comments list)**:
```json
{
  "comments": [
    {
      "id": "cm1abc",
      "content": "Great question!",
      "author": { "id": "usr1", "name": "Dr. Chen", "image": null },
      "createdAt": "2026-06-12T14:30:00Z"
    }
  ]
}
```

---

## Assignments

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/courses/:id/assignments` | List assignments with submission status |
| `POST` | `/api/courses/:id/assignments` | Create assignment (teacher only) |
| `GET` | `/api/assignments/:id` | Get assignment detail with rubric |
| `PATCH` | `/api/assignments/:id` | Update assignment (teacher only) |
| `DELETE` | `/api/assignments/:id` | Delete assignment (teacher only) |

---

## Submissions

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/assignments/:id/submissions` | All submissions for an assignment (teacher) |
| `GET` | `/api/assignments/:id/my-submission` | Current user's submission (student) |
| `POST` | `/api/assignments/:id/submit` | Submit / update submission (student) |
| `PATCH` | `/api/submissions/:id/grade` | Grade a submission (teacher) |
| `POST` | `/api/submissions/:id/return` | Return with feedback (teacher) |

---

## Users & Enrollment

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/courses/:id/roster` | List enrolled users with roles |
| `DELETE` | `/api/courses/:id/enrollments/:userId` | Remove student (teacher only) |
| `GET` | `/api/users/me` | Current user profile |
| `PATCH` | `/api/users/me` | Update profile |

---

## GraphQL Alternative

For the stream view specifically, a GraphQL endpoint at `/api/graphql` reduces over-fetching:

```graphql
query StreamPage($courseId: ID!, $cursor: String) {
  course(id: $courseId) {
    name
    section
    teacher { name image }
    posts(first: 20, after: $cursor) {
      edges {
        node {
          id
          content
          type
          createdAt
          author { name image }
          comments {
            id
            content
            author { name image }
            createdAt
          }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
  upcomingWork(courseId: $courseId) {
    id
    title
    dueDate
    points
  }
}
```

---

## Real-time (WebSocket)

| Event | Direction | Description |
|---|---|---|
| `post:created` | Server → Client | New post in subscribed course stream |
| `comment:created` | Server → Client | New comment on a post |
| `submission:graded` | Server → Client | Grade published for a submission |

Uses Supabase Realtime channels scoped to `course:{courseId}`.
