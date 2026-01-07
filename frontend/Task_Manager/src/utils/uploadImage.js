import axiosInstance from "./axiosinstance";

/**
 * Upload user profile image
 * @param {string} userId - User ID
 * @param {File} file - Image file to upload
 * @returns {Promise} Response from server
 */
export const uploadUserProfileImage = async (userId, file) => {
  try {
    const formData = new FormData();
    formData.append("profileImage", file);

    const response = await axiosInstance.post(
      `/users/${userId}/upload-avatar`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Upload task attachment/image
 * @param {string} taskId - Task ID
 * @param {File} file - Image file to upload
 * @returns {Promise} Response from server
 */
export const uploadTaskImage = async (taskId, file) => {
  try {
    const formData = new FormData();
    formData.append("taskImage", file);

    const response = await axiosInstance.post(
      `/tasks/${taskId}/upload-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default {
  uploadUserProfileImage,
  uploadTaskImage,
};
