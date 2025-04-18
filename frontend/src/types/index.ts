export type UserRole = 'student' | 'teacher' | 'TA' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
}

export interface Course {
  id: string;
  name: string;
  description?: string;
  users: User[];
}

export interface CourseFormData {
  name: string;
  description?: string;
} 