import { Course, User, UserRole } from '../types';
import { ResourceType } from '../components/ZoomResourceSetup';

// Helper to generate IDs
export const generateId = () => Math.random().toString(36).substring(2, 15);

// Initial mock users
const mockUsers: User[] = [
  { id: 'u1', name: 'John Doe', role: 'teacher', email: 'john@example.com' },
  { id: 'u2', name: 'Jane Smith', role: 'student', email: 'jane@example.com' },
  { id: 'u3', name: 'Bob Wilson', role: 'TA', email: 'bob@example.com' },
];

// Initial mock courses
export const mockCourses = new Map<string, Course>([
  ['1', {
    id: '1',
    name: 'Introduction to Programming',
    description: 'Learn the basics of programming with Python',
    startDate: '2024-01-01',
    endDate: '2024-04-30',
    users: [mockUsers[0], mockUsers[1]],
    zoomResources: {
      whiteboard: { status: 'created', resourceId: 'wb-123' },
      chat: { status: 'created', resourceId: 'chat-456' },
      meeting: { status: 'created', resourceId: 'meet-789' },
    },
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2023-12-01T00:00:00Z',
  }],
  ['2', {
    id: '2',
    name: 'Web Development',
    description: 'Full-stack web development with React and Node.js',
    startDate: '2024-02-01',
    endDate: '2024-05-31',
    users: [mockUsers[0], mockUsers[2]],
    zoomResources: null,
    createdAt: '2023-12-15T00:00:00Z',
    updatedAt: '2023-12-15T00:00:00Z',
  }],
]);

// Mock zoom resources data store
export const mockZoomResources = new Map<string, Map<ResourceType, string>>();

// Helper to clone course data (to avoid direct mutations)
export const cloneCourse = (course: Course): Course => JSON.parse(JSON.stringify(course));

// Helper to clone courses map
export const cloneCourses = (): Map<string, Course> => {
  const clone = new Map<string, Course>();
  mockCourses.forEach((course, id) => {
    clone.set(id, cloneCourse(course));
  });
  return clone;
};

// Helper to validate course data
export const validateCourse = (data: Partial<Course>): boolean => {
  if (!data.name || !data.description || !data.startDate || !data.endDate) {
    return false;
  }
  
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
    return false;
  }
  
  return true;
};

// Helper to validate user data
export const validateUser = (data: Partial<User>): boolean => {
  if (!data.name || !data.role) {
    return false;
  }
  
  const validRoles: UserRole[] = ['student', 'teacher', 'TA', 'admin'];
  if (!validRoles.includes(data.role)) {
    return false;
  }
  
  return true;
};

// Helper to get error message
export const getErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return 'Invalid request data';
    case 404:
      return 'Resource not found';
    case 409:
      return 'Resource already exists';
    default:
      return 'An unexpected error occurred';
  }
}; 