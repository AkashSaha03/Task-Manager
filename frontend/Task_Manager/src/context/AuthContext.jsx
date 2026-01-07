import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosinstance";
import { AUTH_ENDPOINTS } from "../utils/apiPath";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      setError(null);
      const response = await axiosInstance.post(AUTH_ENDPOINTS.REGISTER, userData);
      const { token, ...userInfo } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userInfo));
      setUser(userInfo);

      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      throw err;
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, credentials);
      const { token, ...userInfo } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userInfo));
      setUser(userInfo);

      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await axiosInstance.put(
        AUTH_ENDPOINTS.UPDATE_PROFILE,
        profileData
      );
      const { token, ...userInfo } = response.data;

      localStorage.setItem("user", JSON.stringify(userInfo));
      if (token) {
        localStorage.setItem("token", token);
      }
      setUser(userInfo);

      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Update failed";
      setError(message);
      throw err;
    }
  };

  const uploadProfileImage = async (formData) => {
    try {
      setError(null);
      const response = await axiosInstance.post(
        AUTH_ENDPOINTS.UPLOAD_IMAGE,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Upload failed";
      setError(message);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    uploadProfileImage,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
