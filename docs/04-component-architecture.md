# 4. Component Architecture & Animation Strategy

## Frontend Component Tree

```
<AppShell>
  ├── <NavigationHeader />           // Fixed top nav, burger→X animation
  │     ├── <Logo />
  │     ├── <NavLinks />             // Desktop nav items
  │     ├── <UserMenu />             // Avatar dropdown
  │     └── <MobileMenu />           // AnimatePresence slide-down
  │
  ├── <main>
  │     ├── <ClassBanner />          // Hero card with parallax hover
  │     │
  │     └── <div className="feed-layout">
  │           ├── <StreamFeed />     // Left column (main)
  │           │     ├── <NewPostForm />
  │           │     │     └── <motion.div layout>  // Expandable form
  │           │     │
  │           │     └── <AnimatePresence>
  │           │           └── <PostCard />  // Each post
  │           │                 ├── <PostHeader />
  │           │                 ├── <PostContent />
  │           │                 ├── <AttachmentPill />
  │           │                 ├── <PostActions />  // Like/Comment buttons
  │           │                 └── <AnimatePresence>
  │           │                       └── <CommentSection />
  │           │                             ├── <CommentItem />  // Per comment
  │           │                             └── <CommentInput />
  │           │
  │           └── <aside>
  │                 └── <UpcomingWidget />  // Sticky sidebar
  │                       └── <AssignmentItem />  // Animated checklist items
  │
  └── <footer />
```

---

## Animation Strategy

### 1. Skeleton Loaders
- **Behavior**: Shimmer effect using CSS gradient animation (`background-position` loop)
- **Entry**: Fade in with `opacity: 0 → 1` over 300ms
- **Exit (content loaded)**: Skeleton items exit with `y: -10, opacity: 0`, staggered
- **Framer Motion**: `<AnimatePresence mode="wait">` to sequence skeleton → content

### 2. Class Banner Hover
- **Behavior**: Subtle scale-up (`1.01x`) with increased shadow on hover
- **Spring config**: `stiffness: 300, damping: 20` — bouncy but tight
- **Overlay**: Gradient shimmer sweeps across on hover using CSS `translateX` on a pseudo-element

### 3. Stream Post Cards
- **Mount**: Staggered entry — `y: 20, opacity: 0 → y: 0, opacity: 1` with 50ms delay per card
- **Removal**: `scale: 0.95, opacity: 0, y: -20` exit animation
- **Hover**: `y: -2, boxShadow` elevation via `whileHover`
- **Layout shift**: Parent `motion.div layout` ensures smooth reflow when posts are added/removed

### 4. Comment Section Accordion
- **Expand**: `height: 0 → auto` with spring physics (`stiffness: 400, damping: 30`)
- **Content opacity**: Fades in (`0 → 1`) during expansion
- **Individual comments**: Slide in from left (`x: -10 → 0`) with stagger
- **Exit**: Reverse — comments slide out, section collapses

### 5. Success / Celebratory Micro-animations
- **"Turn In" button**: 
  1. Button shrinks slightly (`scale: 0.95`)
  2. Confetti burst from button center (CSS particles via `@keyframes`)
  3. Button morphs to a green checkmark (icon transition + background color shift)
- **Checkbox toggle**: Spring-based scale bounce (`scale: 1 → 1.2 → 1`) with color transition
- **Like button**: Heart icon scales up with spring, fills with color

### 6. Page Transitions
- **Route change**: Shared layout persists; page content fades in with slight upward drift
- **Between courses**: Slide transition (new content slides in from right, old slides out left)

### 7. Burger → X Menu
- Middle bar fades out
- Top bar rotates `45deg` and moves to center
- Bottom bar rotates `-45deg` and moves to center
- Smooth spring animation on all bars simultaneously

---

## Accessibility & UX Notes
- All animated elements have `prefers-reduced-motion` media query fallbacks
- Buttons have visible focus rings (`focus-visible:ring-2`)
- Color assignments use dots/text in addition to color for accessibility
- Comments use `aria-live="polite"` for screen reader updates
