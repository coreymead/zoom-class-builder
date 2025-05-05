import { Course, User, CourseFormData } from '../types';
import { ResourceType } from '../components/ZoomResourceSetup';
import { config } from '../config';
import {
  mockCourses,
  mockZoomResources,
  generateId,
  cloneCourse,
  cloneCourses,
  validateCourse,
  validateUser,
} from './mockData';

// Simulate network delay
const delay = (ms: number = Math.random() * (config.mockApi.maxDelay - config.mockApi.minDelay) + config.mockApi.minDelay) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Simulate error
const simulateError = () => Math.random() < config.mockApi.errorRate;

// Course Management
export const mockGetCourses = async (): Promise<Course[]> => {
  await delay();
  return Array.from(mockCourses.values());
};

export const mockGetCourseById = async (courseId: string): Promise<Course> => {
  await delay();
  const course = mockCourses.get(courseId);
  if (!course) {
    throw new Error('Course not found');
  }
  return cloneCourse(course);
};

export const mockCreateCourse = async (data: CourseFormData): Promise<Course> => {
  await delay();
  
  if (!validateCourse(data)) {
    throw new Error('Invalid course data');
  }

  const newCourse: Course = {
    id: generateId(),
    ...data,
    users: [],
    zoomResources: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockCourses.set(newCourse.id, newCourse);
  return cloneCourse(newCourse);
};

export const mockUpdateCourse = async (courseId: string, data: CourseFormData): Promise<Course> => {
  await delay();

  const course = mockCourses.get(courseId);
  if (!course) {
    throw new Error('Course not found');
  }

  if (!validateCourse(data)) {
    throw new Error('Invalid course data');
  }

  const updatedCourse: Course = {
    ...course,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  mockCourses.set(courseId, updatedCourse);
  return cloneCourse(updatedCourse);
};

export const mockDeleteCourse = async (courseId: string): Promise<void> => {
  await delay();

  if (!mockCourses.has(courseId)) {
    throw new Error('Course not found');
  }

  mockCourses.delete(courseId);
};

// User Management
export const mockAddUserToCourse = async (courseId: string, userData: Partial<User>): Promise<Course> => {
  await delay();

  const course = mockCourses.get(courseId);
  if (!course) {
    throw new Error('Course not found');
  }

  if (!validateUser(userData)) {
    throw new Error('Invalid user data');
  }

  const newUser: User = {
    id: generateId(),
    ...userData,
    role: userData.role!,
    name: userData.name!,
  };

  const updatedCourse = cloneCourse(course);
  updatedCourse.users.push(newUser);
  updatedCourse.updatedAt = new Date().toISOString();

  mockCourses.set(courseId, updatedCourse);
  return updatedCourse;
};

export const mockRemoveUserFromCourse = async (courseId: string, userId: string): Promise<Course> => {
  await delay();

  const course = mockCourses.get(courseId);
  if (!course) {
    throw new Error('Course not found');
  }

  const updatedCourse = cloneCourse(course);
  updatedCourse.users = updatedCourse.users.filter(user => user.id !== userId);
  updatedCourse.updatedAt = new Date().toISOString();

  mockCourses.set(courseId, updatedCourse);
  return updatedCourse;
};

export const mockUpdateUserRole = async (courseId: string, userId: string, role: User['role']): Promise<Course> => {
  await delay();

  const course = mockCourses.get(courseId);
  if (!course) {
    throw new Error('Course not found');
  }

  const updatedCourse = cloneCourse(course);
  const userIndex = updatedCourse.users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found in course');
  }

  updatedCourse.users[userIndex] = {
    ...updatedCourse.users[userIndex],
    role,
  };
  updatedCourse.updatedAt = new Date().toISOString();

  mockCourses.set(courseId, updatedCourse);
  return updatedCourse;
};

// Zoom Resources
export const mockInitializeZoomResources = async (courseId: string, resourceType: ResourceType): Promise<void> => {
  await delay();

  if (simulateError()) {
    throw new Error(`Failed to initialize ${resourceType}. Please try again.`);
  }

  const course = mockCourses.get(courseId);
  if (!course) {
    throw new Error('Course not found');
  }

  const updatedCourse = cloneCourse(course);
  if (!updatedCourse.zoomResources) {
    updatedCourse.zoomResources = {
      whiteboard: { status: null, resourceId: null },
      chat: { status: null, resourceId: null },
      meeting: { status: null, resourceId: null },
    };
  }

  const resourceId = `mock-${resourceType}-${Date.now()}`;
  updatedCourse.zoomResources[resourceType] = {
    status: 'created',
    resourceId,
  };
  updatedCourse.updatedAt = new Date().toISOString();

  mockCourses.set(courseId, updatedCourse);
  mockZoomResources.set(courseId, new Map([[resourceType, resourceId]]));
};

export const mockLinkZoomResource = async (courseId: string, resourceType: ResourceType, resourceId: string): Promise<void> => {
  await delay();

  if (!resourceId.match(/^[a-zA-Z0-9-_]+$/)) {
    throw new Error('Invalid resource ID format');
  }

  const course = mockCourses.get(courseId);
  if (!course) {
    throw new Error('Course not found');
  }

  const updatedCourse = cloneCourse(course);
  if (!updatedCourse.zoomResources) {
    updatedCourse.zoomResources = {
      whiteboard: { status: null, resourceId: null },
      chat: { status: null, resourceId: null },
      meeting: { status: null, resourceId: null },
    };
  }

  updatedCourse.zoomResources[resourceType] = {
    status: 'created',
    resourceId,
  };
  updatedCourse.updatedAt = new Date().toISOString();

  mockCourses.set(courseId, updatedCourse);
  if (!mockZoomResources.has(courseId)) {
    mockZoomResources.set(courseId, new Map());
  }
  mockZoomResources.get(courseId)!.set(resourceType, resourceId);
};

export const mockGetCourseResources = async (courseId: string): Promise<Record<ResourceType, string | null>> => {
  await delay(500); // Simulate network delay

  const courseResources = mockZoomResources.get(courseId);
  if (!courseResources) {
    return {
      whiteboard: null,
      chat: null,
      meeting: null,
    };
  }

  return {
    whiteboard: courseResources.get('whiteboard') || null,
    chat: courseResources.get('chat') || null,
    meeting: courseResources.get('meeting') || null,
  };
}; 