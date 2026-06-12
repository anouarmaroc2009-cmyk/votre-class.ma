# 2. Tech Stack Recommendations

## Philosophy
Every library choice is made with **animation fluidity**, **developer ergonomics**, and **production reliability** in mind.

---

## Frontend

| Layer | Choice | Why |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | SSR for SEO, server components for perf, RSC streaming |
| **Language** | TypeScript (strict mode) | Type safety across API ↔ DB ↔ UI boundary |
| **Styling** | Tailwind CSS v3 | Utility-first, zero-runtime CSS, easy dark mode |
| **Animation** | **Framer Motion v11** | Declarative spring physics, `AnimatePresence`, layout animations |
| **Icons** | lucide-react | Tree-shakeable, consistent 24px grid, MIT license |
| **State** | React Context + `useReducer` | Sufficient for course-scoped state; no Redux overhead |
| **Form** | React Hook Form + Zod | Performant uncontrolled forms + schema validation |

### Why Framer Motion over GSAP?
- **React-native**: GSAP requires refs and manual cleanup; Framer Motion uses declarative props
- **Layout animations**: Framer Motion's `layout` prop auto-animates reflow — critical for list reordering and accordions
- **AnimatePresence**: Built-in exit animations when components unmount
- **Spring physics**: Natural-feeling motion without easing-curve guesswork

---

## Backend

| Layer | Choice | Why |
|---|---|---|
| **API** | Next.js Route Handlers + tRPC | End-to-end typesafe APIs, no codegen |
| **ORM** | Prisma | Auto-generated types, migrations, great DX |
| **Database** | PostgreSQL 16 | ACID compliance, JSONB for flexible metadata |
| **Auth** | NextAuth.js v5 | Multi-provider, session management, edge-ready |
| **File Storage** | S3-compatible (AWS / Cloudflare R2) | Presigned URLs for direct upload, CDN delivery |
| **Real-time** | Supabase Realtime or WebSockets | Live comment updates, submission notifications |

---

## DevOps & Deployment

| Tool | Purpose |
|---|---|
| **Vercel** | Hosting (edge functions, ISR, analytics) |
| **Docker** | Local dev parity, CI reproducibility |
| **GitHub Actions** | CI/CD — lint, typecheck, test, deploy |
| **Sentry** | Error tracking with replay for UX bugs |

---

## Animation Performance Checklist
- Use `will-change: transform` sparingly (Framer Motion adds it internally)
- Prefer `transform` and `opacity` for animations (GPU-composited)
- Set `layoutDependency` to avoid unnecessary layout animations
- Use `initial={false}` on `AnimatePresence` to skip mount animations on initial render
