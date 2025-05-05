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
  description: string;
  startDate: string;
  endDate: string;
  users: User[];
  zoomResources: {
    whiteboard: {
      status: 'pending' | 'created' | 'error' | null;
      resourceId: string | null;
    };
    chat: {
      status: 'pending' | 'created' | 'error' | null;
      resourceId: string | null;
    };
    meeting: {
      status: 'pending' | 'created' | 'error' | null;
      resourceId: string | null;
    };
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CourseFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface ZoomResource {
  id: string;
  name: string;
  type: 'whiteboard' | 'chat' | 'meeting';
  status: 'pending' | 'created' | 'error';
} 