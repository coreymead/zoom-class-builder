import { Course, User, CourseFormData } from '../types';
import { apiService } from './apiService';
import { ResourceType } from '../components/ZoomResourceSetup';

class CourseService {
  getAllCourses = async (): Promise<Course[]> => {
    const courses = await apiService.getCourses();
    return courses.map(course => this.normalizeZoomResources(course));
  };

  getCourseById = async (id: string): Promise<Course> => {
    const course = await apiService.getCourseById(id);
    return this.normalizeZoomResources(course);
  };

  createCourse = async (courseData: CourseFormData): Promise<Course> => {
    const course = await apiService.createCourse(courseData);
    return this.normalizeZoomResources(course);
  };

  updateCourse = async (id: string, courseData: Partial<Course>): Promise<Course> => {
    const course = await apiService.updateCourse(id, courseData as CourseFormData);
    return this.normalizeZoomResources(course);
  };

  deleteCourse = async (id: string): Promise<boolean> => {
    try {
      await apiService.deleteCourse(id);
      return true;
    } catch (error) {
      console.error('Error deleting course:', error);
      return false;
    }
  };

  addUserToCourse = async (courseId: string, userData: Partial<User>): Promise<Course> => {
    const course = await apiService.addUserToCourse(courseId, userData);
    return this.normalizeZoomResources(course);
  };

  removeUserFromCourse = async (courseId: string, userId: string): Promise<Course> => {
    const course = await apiService.removeUserFromCourse(courseId, userId);
    return this.normalizeZoomResources(course);
  };

  updateUserRole = async (courseId: string, userId: string, role: User['role']): Promise<Course> => {
    const course = await apiService.updateUserRole(courseId, userId, role);
    return this.normalizeZoomResources(course);
  };

  initializeZoomResources = async (courseId: string, resourceType: ResourceType): Promise<void> => {
    return apiService.initializeZoomResources(courseId, resourceType);
  };

  linkZoomResource = async (courseId: string, resourceType: ResourceType, resourceId: string): Promise<void> => {
    return apiService.linkZoomResource(courseId, resourceType, resourceId);
  };

  getCourseResources = async (courseId: string): Promise<Record<ResourceType, string | null>> => {
    return apiService.getCourseResources(courseId);
  };

  unlinkZoomResources = async (courseId: string): Promise<void> => {
    throw new Error('Not implemented');
  };

  private normalizeZoomResources(course: Course): Course {
    return {
      ...course,
      zoomResources: course.zoomResources || {
        whiteboard: { status: null, resourceId: null },
        chat: { status: null, resourceId: null },
        meeting: { status: null, resourceId: null }
      }
    };
  }
}

export default new CourseService(); 