export type Role = 'admin' | 'teacher' | 'student' | 'parent';
export type PostType = 'announcement' | 'assignment' | 'material';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  schoolId?: string;
}

export interface School {
  id: string;
  name: string;
  address?: string;
  adminId: string;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  schoolId: string;
}

export interface ClassData {
  id: string;
  name: string;
  section: string;
  code: string;
  teacherId: string;
  subjectId?: string;
  schoolId?: string;
  coverColor: string;
  createdAt: string;
}

export interface TimetableSlot {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;  // HH:mm
  endTime: string;    // HH:mm
  room: string;
}

export interface InviteLink {
  id: string;
  code: string;
  classId: string;
  role: 'student' | 'parent';
  expiresAt?: string;
  usedCount: number;
  createdAt: string;
}

export interface ParentStudentMapping {
  id: string;
  parentId: string;
  studentId: string;
}

export interface Attachment {
  name: string;
  url: string;
  type: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  createdAt: string;
}

export interface Post {
  id: string;
  content: string;
  type: PostType;
  pinned: boolean;
  attachments?: Attachment[];
  authorId: string;
  classId: string;
  comments: Comment[];
  createdAt: string;
}

export interface Enrollment {
  userId: string;
  classId: string;
  role: Role;
}

export interface AppData {
  users: User[];
  schools: School[];
  subjects: Subject[];
  classes: ClassData[];
  enrollments: Enrollment[];
  timetableSlots: TimetableSlot[];
  inviteLinks: InviteLink[];
  parentMappings: ParentStudentMapping[];
  posts: Post[];
}
