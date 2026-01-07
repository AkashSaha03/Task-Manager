import React, { createContext, useContext, useState, useCallback } from "react";
import axiosInstance from "../utils/axiosinstance";
import { TASK_ENDPOINTS } from "../utils/apiPath";

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within TaskProvider");
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(TASK_ENDPOINTS.GET_ALL_TASKS);
      setTasks(response.data);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch tasks";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserTasks = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(
        TASK_ENDPOINTS.GET_USER_TASKS(userId)
      );
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch user tasks";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTaskById = useCallback(async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(TASK_ENDPOINTS.GET_TASK(taskId));
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch task";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.post(
        TASK_ENDPOINTS.CREATE_TASK,
        taskData
      );
      setTasks([response.data, ...tasks]);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create task";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [tasks]);

  const updateTask = useCallback(async (taskId, taskData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.put(
        TASK_ENDPOINTS.UPDATE_TASK(taskId),
        taskData
      );
      setTasks(
        tasks.map((task) => (task._id === taskId ? response.data : task))
      );
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update task";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [tasks]);

  const deleteTask = useCallback(async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      await axiosInstance.delete(TASK_ENDPOINTS.DELETE_TASK(taskId));
      setTasks(tasks.filter((task) => task._id !== taskId));
      return true;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete task";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [tasks]);

  const addTodo = useCallback(async (taskId, todoText) => {
    try {
      setError(null);
      const response = await axiosInstance.post(
        TASK_ENDPOINTS.ADD_TODO(taskId),
        { text: todoText }
      );
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to add todo";
      setError(message);
      throw err;
    }
  }, []);

  const updateTodo = useCallback(async (taskId, todoId, completed) => {
    try {
      setError(null);
      const response = await axiosInstance.put(
        TASK_ENDPOINTS.UPDATE_TODO(taskId, todoId),
        { completed }
      );
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update todo";
      setError(message);
      throw err;
    }
  }, []);

  const value = {
    tasks,
    loading,
    error,
    fetchAllTasks,
    fetchUserTasks,
    fetchTaskById,
    createTask,
    updateTask,
    deleteTask,
    addTodo,
    updateTodo,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
