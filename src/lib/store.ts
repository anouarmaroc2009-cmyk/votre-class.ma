import type {
  AppData, User, School, Subject, ClassData, TimetableSlot,
  InviteLink, ParentStudentMapping, Post, Comment, Role,
} from './types';

const STORAGE_KEY = 'flowclass_data';

function uid(): string { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
function makeCode(): string { return Math.random().toString(36).slice(2, 7).toUpperCase(); }

function get(): AppData {
  if (typeof window === 'undefined') return empty();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty();
    return JSON.parse(raw);
  } catch { return empty(); }
}

function empty(): AppData {
  return {
    users: [], schools: [], subjects: [], classes: [],
    enrollments: [], timetableSlots: [], inviteLinks: [],
    parentMappings: [], posts: [],
  };
}

function save(data: AppData) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

// ─── Users ───
export function findUserByEmail(email: string): User | undefined {
  return get().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}
export function findUserById(id: string): User | undefined {
  return get().users.find((u) => u.id === id);
}
export function createUser(email: string, name: string, role: Role, schoolId?: string): User {
  const data = get();
  const user: User = { id: uid(), email, name, role, schoolId };
  data.users.push(user);
  save(data);
  return user;
}
export function getAllUsers(): User[] { return get().users; }

// ─── Schools ───
export function createSchool(name: string, adminId: string): School {
  const data = get();
  const school: School = { id: uid(), name, adminId, createdAt: new Date().toISOString() };
  data.schools.push(school);
  save(data);
  return school;
}
export function getSchool(id: string): School | undefined { return get().schools.find((s) => s.id === id); }
export function listSchools(): School[] { return get().schools; }

// ─── Subjects ───
export function createSubject(name: string, code: string, schoolId: string): Subject {
  const data = get();
  const subj: Subject = { id: uid(), name, code, schoolId };
  data.subjects.push(subj);
  save(data);
  return subj;
}
export function listSubjects(schoolId: string): Subject[] {
  return get().subjects.filter((s) => s.schoolId === schoolId);
}

// ─── Classes ───
export function createClass(
  name: string, section: string, teacherId: string,
  subjectId?: string, schoolId?: string,
): ClassData {
  const data = get();
  const cls: ClassData = {
    id: uid(), name, section, code: makeCode(), teacherId,
    subjectId, schoolId,
    coverColor: ['#4F46E5','#7C3AED','#DB2777','#059669','#D97706'][Math.floor(Math.random()*5)],
    createdAt: new Date().toISOString(),
  };
  data.classes.push(cls);
  data.enrollments.push({ userId: teacherId, classId: cls.id, role: 'teacher' });
  // Generate invite links
  data.inviteLinks.push({ id: uid(), code: cls.code, classId: cls.id, role: 'student', usedCount: 0, createdAt: new Date().toISOString() });
  data.inviteLinks.push({ id: uid(), code: makeCode(), classId: cls.id, role: 'parent', usedCount: 0, createdAt: new Date().toISOString() });
  save(data);
  return cls;
}

export function getClass(id: string): ClassData | undefined { return get().classes.find((c) => c.id === id); }
export function getClassByCode(code: string): ClassData | undefined {
  return get().classes.find((c) => c.code === code);
}

export function listUserClasses(userId: string) {
  const data = get();
  return data.enrollments.filter((e) => e.userId === userId).map((e) => {
    const cls = data.classes.find((c) => c.id === e.classId)!;
    const teacher = data.users.find((u) => u.id === cls.teacherId);
    const studentCount = data.enrollments.filter((en) => en.classId === cls.id && en.role === 'student').length;
    return { ...cls, teacher: teacher || null, studentCount, myRole: e.role };
  });
}

// ─── Timetable ───
export function addTimetableSlot(slot: Omit<TimetableSlot, 'id'>): TimetableSlot {
  const data = get();
  const s: TimetableSlot = { id: uid(), ...slot };
  data.timetableSlots.push(s);
  save(data);
  return s;
}

export function getTimetableForClass(classId: string): TimetableSlot[] {
  return get().timetableSlots.filter((s) => s.classId === classId);
}

export function getTimetableForUser(userId: string): (TimetableSlot & { className: string; subjectName: string })[] {
  const data = get();
  const classIds = data.enrollments.filter((e) => e.userId === userId).map((e) => e.classId);
  const slots = data.timetableSlots.filter((s) => classIds.includes(s.classId));
  return slots.map((s) => {
    const cls = data.classes.find((c) => c.id === s.classId);
    const subj = data.subjects.find((sb) => sb.id === s.subjectId);
    return { ...s, className: cls?.name || '', subjectName: subj?.name || '' };
  });
}

export function getTodayTimetable(userId: string) {
  const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'] as const;
  const today = days[new Date().getDay()];
  const all = getTimetableForUser(userId);
  return all.filter((s) => s.dayOfWeek === today).sort((a, b) => a.startTime.localeCompare(b.startTime));
}

// ─── Enrollments ───
export function isEnrolled(userId: string, classId: string): boolean {
  return get().enrollments.some((e) => e.userId === userId && e.classId === classId);
}

export function joinClass(code: string, userId: string): ClassData | null {
  const data = get();
  const cls = data.classes.find((c) => c.code === code);
  if (!cls) return null;
  if (data.enrollments.some((e) => e.userId === userId && e.classId === cls.id)) return cls;
  data.enrollments.push({ userId, classId: cls.id, role: 'student' });
  save(data);
  return cls;
}

export function enrollUser(userId: string, classId: string, role: Role): boolean {
  const data = get();
  if (data.enrollments.some((e) => e.userId === userId && e.classId === classId)) return false;
  data.enrollments.push({ userId, classId, role });
  save(data);
  return true;
}

export function addStudentToClass(email: string, classId: string): { success: boolean; error?: string } {
  const data = get();
  const user = data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return { success: false, error: 'No user found with that email. They need to sign in first.' };
  if (user.role === 'teacher') return { success: false, error: 'Cannot add a teacher as a student.' };
  if (data.enrollments.some((e) => e.userId === user.id && e.classId === classId)) return { success: false, error: 'Already enrolled.' };
  data.enrollments.push({ userId: user.id, classId, role: 'student' });
  save(data);
  return { success: true };
}

export function getClassRoster(classId: string) {
  const data = get();
  return data.enrollments.filter((e) => e.classId === classId).map((e) => {
    const user = data.users.find((u) => u.id === e.userId)!;
    return { ...user, role: e.role };
  });
}

// ─── Invite Links ───
export function getInviteLink(code: string): InviteLink | undefined {
  return get().inviteLinks.find((l) => l.code === code);
}

export function getClassInviteLinks(classId: string): InviteLink[] {
  return get().inviteLinks.filter((l) => l.classId === classId);
}

// ─── Parent Mapping ───
export function mapParentToStudent(parentId: string, studentId: string): boolean {
  const data = get();
  if (data.parentMappings.some((m) => m.parentId === parentId && m.studentId === studentId)) return false;
  data.parentMappings.push({ id: uid(), parentId, studentId });
  save(data);
  return true;
}

export function getStudentForParent(parentId: string): User | undefined {
  const data = get();
  const map = data.parentMappings.find((m) => m.parentId === parentId);
  if (!map) return undefined;
  return data.users.find((u) => u.id === map.studentId);
}

export function getParentsForStudent(studentId: string): User[] {
  const data = get();
  return data.parentMappings.filter((m) => m.studentId === studentId).map((m) =>
    data.users.find((u) => u.id === m.parentId)
  ).filter(Boolean) as User[];
}

// ─── Posts & Comments ───
export function getClassPosts(classId: string): Post[] {
  return get().posts
    .filter((p) => p.classId === classId)
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

export function createPost(content: string, authorId: string, classId: string, type: Post['type'] = 'announcement'): Post {
  const data = get();
  const post: Post = { id: uid(), content, type, pinned: false, authorId, classId, comments: [], createdAt: new Date().toISOString() };
  data.posts.push(post);
  save(data);
  return post;
}

export function addComment(postId: string, content: string, authorId: string): Comment {
  const data = get();
  const comment: Comment = { id: uid(), content, authorId, createdAt: new Date().toISOString() };
  const post = data.posts.find((p) => p.id === postId);
  if (post) post.comments.push(comment);
  save(data);
  return comment;
}
