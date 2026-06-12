# 3. Database Schema — Prisma (PostgreSQL)

## Entity Relationship Overview

```
User ──< Enrollment >── Course
  │                        │
  │                        ├──< Post >──< Comment
  │                        │
  └──< Submission >─── Assignment
```

---

## Prisma Schema

```prisma
enum Role {
  TEACHER
  STUDENT
  ADMIN
}

enum PostType {
  ANNOUNCEMENT
  ASSIGNMENT
  MATERIAL
}

model User {
  id            String       @id @default(cuid())
  name          String
  email         String       @unique
  emailVerified DateTime?
  image         String?
  role          Role         @default(STUDENT)
  bio           String?

  courses       Enrollment[]
  posts         Post[]
  comments      Comment[]
  submissions   Submission[]
  assignments   Assignment[]  @relation("TeacherAssignments")

  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
}

model Course {
  id            String       @id @default(cuid())
  name          String
  section       String?
  subject       String?
  room          String?
  coverColor    String       @default("#4F46E5")
  description   String?
  code          String       @unique // join code
  archived      Boolean      @default(false)

  teacherId     String
  teacher       User         @relation(fields: [teacherId], references: [id])
  enrollments   Enrollment[]
  posts         Post[]
  assignments   Assignment[]

  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
}

model Enrollment {
  id            String       @id @default(cuid())
  role          Role         @default(STUDENT)

  userId        String
  user          User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  courseId      String
  course        Course       @relation(fields: [courseId], references: [id], onDelete: Cascade)

  createdAt     DateTime     @default(now())

  @@unique([userId, courseId])
}

model Assignment {
  id            String       @id @default(cuid())
  title         String
  description   String
  points        Int          @default(100)
  dueDate       DateTime?
  instructions  String?
  attachments   Json?        // [{name, url, type}]
  rubric        Json?        // [{criterion, points}]

  courseId      String
  course        Course       @relation(fields: [courseId], references: [id], onDelete: Cascade)
  teacherId     String
  teacher       User         @relation("TeacherAssignments", fields: [teacherId], references: [id])

  posts         Post[]       // an assignment can have an associated stream post
  submissions   Submission[]

  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
}

model Submission {
  id            String       @id @default(cuid())
  content       String?
  attachments   Json?        // [{name, url, type}]
  grade         Int?
  feedback      String?
  status        String       @default("ASSIGNED") // ASSIGNED | TURNED_IN | GRADED | RETURNED
  submittedAt   DateTime?
  gradedAt      DateTime?

  assignmentId  String
  assignment    Assignment   @relation(fields: [assignmentId], references: [id], onDelete: Cascade)
  studentId     String
  student       User         @relation(fields: [studentId], references: [id])

  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  @@unique([assignmentId, studentId])
}

model Post {
  id            String       @id @default(cuid())
  content       String
  type          PostType     @default(ANNOUNCEMENT)
  attachments   Json?        // [{name, url, type}]
  pinned        Boolean      @default(false)

  courseId      String
  course        Course       @relation(fields: [courseId], references: [id], onDelete: Cascade)
  authorId      String
  author        User         @relation(fields: [authorId], references: [id])

  comments      Comment[]
  assignmentId  String?      // link to assignment if type=ASSIGNMENT
  assignment    Assignment?  @relation(fields: [assignmentId], references: [id])

  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
}

model Comment {
  id            String       @id @default(cuid())
  content       String

  postId        String
  post          Post         @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorId      String
  author        User         @relation(fields: [authorId], references: [id])

  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
}
```

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| **JSONB for attachments/rubrics** | Schemaless flexibility; attachments vary per assignment |
| **Submission status enum** | Enables workflow: Assigned → Turned In → Graded → Returned |
| **Posts separate from Assignments** | A post can be a standalone announcement; assignments optionally link to a post |
| **Composite unique on Enrollment** | Prevents duplicate enrollments |
| **Cascade deletes** | Deleting a course removes all associated posts, comments, assignments |
