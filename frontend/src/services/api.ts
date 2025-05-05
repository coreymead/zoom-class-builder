import { Course, User, CourseFormData } from '../types';
import { ResourceType } from '../components/ZoomResourceSetup';
import { config } from '../config';
import {
  mockGetCourses,
  mockGetCourseById,
  mockCreateCourse,
  mockUpdateCourse,
  mockDeleteCourse,
  mockAddUserToCourse,
  mockRemoveUserFromCourse,
  mockUpdateUserRole,
  mockInitializeZoomResources,
  mockLinkZoomResource,
  mockGetCourseResources,
} from './mockApi';

// Helper for real API calls
const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
};

// Course Management
export const getCourses = async (): Promise<Course[]> => {
  if (config.useMockApi) {
    return mockGetCourses();
  }
  return fetchApi('/api/courses');
};

export const getCourseById = async (courseId: string): Promise<Course> => {
  if (config.useMockApi) {
    return mockGetCourseById(courseId);
  }
  return fetchApi(`/api/courses/${courseId}`);
};

export const createCourse = async (data: CourseFormData): Promise<Course> => {
  if (config.useMockApi) {
    return mockCreateCourse(data);
  }
  return fetchApi('/api/courses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateCourse = async (courseId: string, data: CourseFormData): Promise<Course> => {
  if (config.useMockApi) {
    return mockUpdateCourse(courseId, data);
  }
  return fetchApi(`/api/courses/${courseId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteCourse = async (courseId: string): Promise<void> => {
  if (config.useMockApi) {
    return mockDeleteCourse(courseId);
  }
  return fetchApi(`/api/courses/${courseId}`, {
    method: 'DELETE',
  });
};

// User Management
export const addUserToCourse = async (courseId: string, userData: Partial<User>): Promise<Course> => {
  if (config.useMockApi) {
    return mockAddUserToCourse(courseId, userData);
  }
  return fetchApi(`/api/courses/${courseId}/users`, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const removeUserFromCourse = async (courseId: string, userId: string): Promise<Course> => {
  if (config.useMockApi) {
    return mockRemoveUserFromCourse(courseId, userId);
  }
  return fetchApi(`/api/courses/${courseId}/users/${userId}`, {
    method: 'DELETE',
  });
};

export const updateUserRole = async (courseId: string, userId: string, role: User['role']): Promise<Course> => {
  if (config.useMockApi) {
    return mockUpdateUserRole(courseId, userId, role);
  }
  return fetchApi(`/api/courses/${courseId}/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
};

// Zoom Resources
export const initializeZoomResources = async (courseId: string, resourceType: ResourceType): Promise<void> => {
  if (config.useMockApi) {
    return mockInitializeZoomResources(courseId, resourceType);
  }
  return fetchApi(`/api/courses/${courseId}/zoom-resources/${resourceType}`, {
    method: 'POST',
  });
};

export const linkZoomResource = async (courseId: string, resourceType: ResourceType, resourceId: string): Promise<void> => {
  if (config.useMockApi) {
    return mockLinkZoomResource(courseId, resourceType, resourceId);
  }
  return fetchApi(`/api/courses/${courseId}/zoom-resources/${resourceType}/link`, {
    method: 'POST',
    body: JSON.stringify({ resourceId }),
  });
};

export const getCourseResources = async (courseId: string): Promise<Record<ResourceType, string | null>> => {
  if (config.useMockApi) {
    return mockGetCourseResources(courseId);
  }
  return fetchApi(`/api/courses/${courseId}/zoom-resources`);
}; 