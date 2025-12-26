import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to unwrap data
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle errors globally
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

// Structured API object matching frontend expectations
export const api = {
  // LLM / AI
  invokeLLM: (data) => axiosInstance.post('/llm/invoke', data),

  // Commands
  commands: {
    create: (data) => axiosInstance.post('/commands', data),
    list: (params) => axiosInstance.get('/commands', { params }),
    get: (id) => axiosInstance.get(`/commands/${id}`),
    update: (id, data) => axiosInstance.put(`/commands/${id}`, data),
    delete: (id) => axiosInstance.delete(`/commands/${id}`),
  },

  // Preferences
  preferences: {
    create: (data) => axiosInstance.post('/preferences', data),
    list: (params) => axiosInstance.get('/preferences', { params }),
    get: () => axiosInstance.get('/preferences'),
    update: (id, data) => axiosInstance.put(`/preferences/${id}`, data),
  }
};
