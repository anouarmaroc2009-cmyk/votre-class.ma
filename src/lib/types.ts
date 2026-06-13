export type Role = 'teacher' | 'student';
export type PostType = 'announcement' | 'assignment' | 'material';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface ClassData {
  id: string;
  name: string;
  section: string;
  code: string;
  teacherId: string;
  coverColor: string;
  createdAt: string;
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
  classes: ClassData[];
  enrollments: Enrollment[];
  posts: Post[];
}
