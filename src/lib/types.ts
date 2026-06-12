export type Role = 'teacher' | 'student' | 'admin';
export type PostType = 'announcement' | 'assignment' | 'material';

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: Role;
}

export interface Course {
  id: string;
  name: string;
  section: string;
  subject?: string;
  room?: string;
  coverColor: string;
  teacher: Pick<User, 'id' | 'name' | 'image'>;
  enrollmentCount?: number;
}

export interface Post {
  id: string;
  content: string;
  type: PostType;
  pinned: boolean;
  attachments?: Attachment[];
  author: Pick<User, 'id' | 'name' | 'image'>;
  comments: Comment[];
  assignmentId?: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: Pick<User, 'id' | 'name' | 'image'>;
  createdAt: string;
}

export interface Attachment {
  name: string;
  url: string;
  type: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  points: number;
  dueDate?: string;
  courseId: string;
  submission?: Submission;
}

export interface Submission {
  id: string;
  status: 'ASSIGNED' | 'TURNED_IN' | 'GRADED' | 'RETURNED';
  grade?: number;
  feedback?: string;
  attachments?: Attachment[];
  submittedAt?: string;
}

export interface UpcomingWork {
  id: string;
  title: string;
  courseName: string;
  dueDate: string;
  points: number;
}
