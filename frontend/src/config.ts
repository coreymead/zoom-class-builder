// Add type definitions for Vite environment variables
interface ImportMetaEnv {
  PROD: boolean;
  VITE_API_URL?: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}

export const config = {
  // Set to true to use mock API instead of real backend
  useMockApi: true,
  
  // API base URL
  apiBaseUrl: 'http://localhost:8080',  // Use the same port as the backend server

  // Mock API settings
  mockApi: {
    // Simulate network delays (in milliseconds)
    minDelay: 200,
    maxDelay: 1000,
    
    // Simulate error rate (0 to 1)
    errorRate: 0.1,
  },
}; 