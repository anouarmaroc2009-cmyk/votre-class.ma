import type { AppData, User, ClassData, Post, Comment, Enrollment, Role } from './types';

const STORAGE_KEY = 'flowclass_data';

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function makeCode(): string {
  return Math.random().toString(36).slice(2, 7).toUpperCase();
}

const SEED: AppData = {
  users: [],
  classes: [],
  enrollments: [],
  posts: [],
};

function get(): AppData {
  if (typeof window === 'undefined') return { users: [], classes: [], enrollments: [], posts: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { users: [], classes: [], enrollments: [], posts: [] };
    return JSON.parse(raw);
  } catch {
    return { users: [], classes: [], enrollments: [], posts: [] };
  }
}

function save(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function findUserByEmail(email: string): User | undefined {
  return get().users.find((u) => u.email === email);
}

export function findUserById(id: string): User | undefined {
  return get().users.find((u) => u.id === id);
}

export function createUser(email: string, name: string, role: Role): User {
  const data = get();
  const user: User = { id: uid(), email, name, role };
  data.users.push(user);
  save(data);
  return user;
}

export function listUserClasses(userId: string) {
  const data = get();
  const myEnrollments = data.enrollments.filter((e) => e.userId === userId);
  return myEnrollments.map((e) => {
    const cls = data.classes.find((c) => c.id === e.classId)!;
    const teacher = data.users.find((u) => u.id === cls.teacherId);
    const studentCount = data.enrollments.filter(
      (en) => en.classId === cls.id && en.role === 'student'
    ).length;
    return { ...cls, teacher: teacher || null, studentCount, myRole: e.role };
  });
}

export function createClass(name: string, section: string, teacherId: string): ClassData {
  const data = get();
  const cls: ClassData = {
    id: uid(),
    name,
    section,
    code: makeCode(),
    teacherId,
    coverColor: ['#4F46E5', '#7C3AED', '#DB2777', '#059669', '#D97706'][Math.floor(Math.random() * 5)],
    createdAt: new Date().toISOString(),
  };
  data.classes.push(cls);
  data.enrollments.push({ userId: teacherId, classId: cls.id, role: 'teacher' });
  save(data);
  return cls;
}

export function joinClass(code: string, userId: string): ClassData | null {
  const data = get();
  const cls = data.classes.find((c) => c.code === code);
  if (!cls) return null;
  const already = data.enrollments.find((e) => e.userId === userId && e.classId === cls.id);
  if (already) return cls;
  data.enrollments.push({ userId, classId: cls.id, role: 'student' });
  save(data);
  return cls;
}

export function getClass(id: string): ClassData | undefined {
  return get().classes.find((c) => c.id === id);
}

export function getClassPosts(classId: string): Post[] {
  return get().posts
    .filter((p) => p.classId === classId)
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

export function createPost(
  content: string,
  authorId: string,
  classId: string,
  type: Post['type'] = 'announcement'
): Post {
  const data = get();
  const post: Post = {
    id: uid(),
    content,
    type,
    pinned: false,
    authorId,
    classId,
    comments: [],
    createdAt: new Date().toISOString(),
  };
  data.posts.push(post);
  save(data);
  return post;
}

export function addComment(postId: string, content: string, authorId: string): Comment {
  const data = get();
  const comment: Comment = {
    id: uid(),
    content,
    authorId,
    createdAt: new Date().toISOString(),
  };
  const post = data.posts.find((p) => p.id === postId);
  if (post) post.comments.push(comment);
  save(data);
  return comment;
}

export function getClassRoster(classId: string) {
  const data = get();
  return data.enrollments
    .filter((e) => e.classId === classId)
    .map((e) => {
      const user = data.users.find((u) => u.id === e.userId)!;
      return { ...user, role: e.role };
    });
}

export function getClassByCode(code: string): ClassData | undefined {
  return get().classes.find((c) => c.code === code);
}

export function isEnrolled(userId: string, classId: string): boolean {
  return get().enrollments.some((e) => e.userId === userId && e.classId === classId);
}

export function findUserByEmailExact(email: string): User | undefined {
  return get().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function addStudentToClass(email: string, classId: string): { success: boolean; error?: string } {
  const data = get();
  const user = data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return { success: false, error: 'No user found with that email. They need to sign in first.' };
  if (user.role === 'teacher') return { success: false, error: 'Cannot add a teacher as a student.' };
  const already = data.enrollments.some((e) => e.userId === user.id && e.classId === classId);
  if (already) return { success: false, error: 'Already enrolled.' };
  data.enrollments.push({ userId: user.id, classId, role: 'student' });
  save(data);
  return { success: true };
}
