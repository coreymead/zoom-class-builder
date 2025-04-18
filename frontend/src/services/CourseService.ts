import { Course, User, CourseFormData } from '../types';

// Mock data for development
const MOCK_COURSES: Course[] = [
  {
    id: '1',
    name: 'Introduction to React',
    description: 'Learn the basics of React and build your first app',
    users: [
      { id: '1', name: 'John Smith', role: 'teacher' },
      { id: '2', name: 'Jane Doe', role: 'student' },
      { id: '3', name: 'Bob Johnson', role: 'TA' }
    ]
  },
  {
    id: '2',
    name: 'Advanced JavaScript',
    description: 'Deep dive into JavaScript concepts and patterns',
    users: [
      { id: '1', name: 'John Smith', role: 'teacher' },
      { id: '4', name: 'Alice Williams', role: 'student' },
      { id: '5', name: 'Charlie Brown', role: 'student' }
    ]
  }
];

// In a real application, these functions would make API calls
class CourseService {
  private courses: Course[] = [...MOCK_COURSES];

  getAllCourses(): Promise<Course[]> {
    return Promise.resolve([...this.courses]);
  }

  getCourseById(id: string): Promise<Course | undefined> {
    const course = this.courses.find(c => c.id === id);
    return Promise.resolve(course ? { ...course } : undefined);
  }

  createCourse(courseData: CourseFormData): Promise<Course> {
    const newCourse: Course = {
      id: Date.now().toString(),
      name: courseData.name,
      description: courseData.description,
      users: []
    };
    
    this.courses.push(newCourse);
    return Promise.resolve({ ...newCourse });
  }

  updateCourse(id: string, courseData: CourseFormData): Promise<Course | undefined> {
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) return Promise.resolve(undefined);
    
    const updatedCourse = {
      ...this.courses[index],
      name: courseData.name,
      description: courseData.description
    };
    
    this.courses[index] = updatedCourse;
    return Promise.resolve({ ...updatedCourse });
  }

  deleteCourse(id: string): Promise<boolean> {
    const initialLength = this.courses.length;
    this.courses = this.courses.filter(c => c.id !== id);
    return Promise.resolve(this.courses.length !== initialLength);
  }

  // User management within courses
  addUserToCourse(courseId: string, user: User): Promise<Course | undefined> {
    const index = this.courses.findIndex(c => c.id === courseId);
    if (index === -1) return Promise.resolve(undefined);
    
    const course = this.courses[index];
    const updatedUsers = [...course.users, user];
    
    const updatedCourse = { ...course, users: updatedUsers };
    this.courses[index] = updatedCourse;
    
    return Promise.resolve({ ...updatedCourse });
  }

  removeUserFromCourse(courseId: string, userId: string): Promise<Course | undefined> {
    const index = this.courses.findIndex(c => c.id === courseId);
    if (index === -1) return Promise.resolve(undefined);
    
    const course = this.courses[index];
    const updatedUsers = course.users.filter(u => u.id !== userId);
    
    const updatedCourse = { ...course, users: updatedUsers };
    this.courses[index] = updatedCourse;
    
    return Promise.resolve({ ...updatedCourse });
  }

  updateUserRole(courseId: string, userId: string, role: User['role']): Promise<Course | undefined> {
    const index = this.courses.findIndex(c => c.id === courseId);
    if (index === -1) return Promise.resolve(undefined);
    
    const course = this.courses[index];
    const updatedUsers = course.users.map(u => 
      u.id === userId ? { ...u, role } : u
    );
    
    const updatedCourse = { ...course, users: updatedUsers };
    this.courses[index] = updatedCourse;
    
    return Promise.resolve({ ...updatedCourse });
  }
}

export default new CourseService(); 