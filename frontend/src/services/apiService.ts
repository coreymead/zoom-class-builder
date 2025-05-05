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

class ApiService {
  private static instance: ApiService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = config.apiBaseUrl;
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
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
  }

  // Course Management
  public async getCourses(): Promise<Course[]> {
    if (config.useMockApi) {
      return mockGetCourses();
    }
    return this.fetchApi('/api/courses');
  }

  public async getCourseById(courseId: string): Promise<Course> {
    if (config.useMockApi) {
      return mockGetCourseById(courseId);
    }
    return this.fetchApi(`/api/courses/${courseId}`);
  }

  public async createCourse(data: CourseFormData): Promise<Course> {
    if (config.useMockApi) {
      return mockCreateCourse(data);
    }
    return this.fetchApi('/api/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async updateCourse(courseId: string, data: CourseFormData): Promise<Course> {
    if (config.useMockApi) {
      return mockUpdateCourse(courseId, data);
    }
    return this.fetchApi(`/api/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  public async deleteCourse(courseId: string): Promise<void> {
    if (config.useMockApi) {
      return mockDeleteCourse(courseId);
    }
    return this.fetchApi(`/api/courses/${courseId}`, {
      method: 'DELETE',
    });
  }

  // User Management
  public async addUserToCourse(courseId: string, userData: Partial<User>): Promise<Course> {
    if (config.useMockApi) {
      return mockAddUserToCourse(courseId, userData);
    }
    return this.fetchApi(`/api/courses/${courseId}/users`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  public async removeUserFromCourse(courseId: string, userId: string): Promise<Course> {
    if (config.useMockApi) {
      return mockRemoveUserFromCourse(courseId, userId);
    }
    return this.fetchApi(`/api/courses/${courseId}/users/${userId}`, {
      method: 'DELETE',
    });
  }

  public async updateUserRole(courseId: string, userId: string, role: User['role']): Promise<Course> {
    if (config.useMockApi) {
      return mockUpdateUserRole(courseId, userId, role);
    }
    return this.fetchApi(`/api/courses/${courseId}/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  // Zoom Resources
  public async initializeZoomResources(courseId: string, resourceType: ResourceType): Promise<void> {
    if (config.useMockApi) {
      return mockInitializeZoomResources(courseId, resourceType);
    }
    return this.fetchApi(`/api/courses/${courseId}/zoom-resources/${resourceType}`, {
      method: 'POST',
    });
  }

  public async linkZoomResource(courseId: string, resourceType: ResourceType, resourceId: string): Promise<void> {
    if (config.useMockApi) {
      return mockLinkZoomResource(courseId, resourceType, resourceId);
    }
    return this.fetchApi(`/api/courses/${courseId}/zoom-resources/${resourceType}/link`, {
      method: 'POST',
      body: JSON.stringify({ resourceId }),
    });
  }

  public async getCourseResources(courseId: string): Promise<Record<ResourceType, string | null>> {
    if (config.useMockApi) {
      return mockGetCourseResources(courseId);
    }
    return this.fetchApi(`/api/courses/${courseId}/zoom-resources`);
  }
}

export const apiService = ApiService.getInstance(); 