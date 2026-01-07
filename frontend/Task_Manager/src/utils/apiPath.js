// Authentication API Endpoints
export const AUTH_ENDPOINTS = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  PROFILE: "/auth/profile",
  UPDATE_PROFILE: "/auth/profile",
  UPLOAD_IMAGE: "/auth/upload-image",
};

// User API Endpoints
export const USER_ENDPOINTS = {
  GET_ALL_USERS: "/users",
  GET_USER: (id) => `/users/${id}`,
  DELETE_USER: (id) => `/users/${id}`,
};

// Task API Endpoints
export const TASK_ENDPOINTS = {
  CREATE_TASK: "/tasks",
  GET_ALL_TASKS: "/tasks",
  GET_TASK: (id) => `/tasks/${id}`,
  UPDATE_TASK: (id) => `/tasks/${id}`,
  DELETE_TASK: (id) => `/tasks/${id}`,
  GET_USER_TASKS: (userId) => `/tasks/user/${userId}`,
  ADD_TODO: (taskId) => `/tasks/${taskId}/todos`,
  UPDATE_TODO: (taskId, todoId) => `/tasks/${taskId}/todos/${todoId}`,
};

// Report API Endpoints
export const REPORT_ENDPOINTS = {
  GET_TASK_STATS: "/reports/stats",
  GET_USER_STATS: (userId) => `/reports/user-stats/${userId}`,
  GET_OVERDUE_TASKS: "/reports/overdue",
  GET_TASKS_BY_PRIORITY: "/reports/by-priority",
  GET_TASKS_BY_STATUS: "/reports/by-status",
};
