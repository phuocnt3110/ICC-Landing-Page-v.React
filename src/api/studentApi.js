import apiClient from './config';

// API functions related to student data
const studentApi = {
  // Get student data by student ID
  getStudentById: async (studentId) => {
    try {
      const response = await apiClient.get(`/tables/m6whmcc44o8tgh8/records?where=(studentId,allof,${studentId})`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student data:', error);
      throw error;
    }
  },

  // Update student data
  updateStudent: async (data) => {
    try {
      const response = await apiClient.patch(`/tables/m6whmcc44o8tgh8/records`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating student data:', error);
      throw error;
    }
  },

  // Get classes assigned for handover (maLopBanGiao)
  getHandoverClass: async (handoverId) => {
    try {
      const response = await apiClient.get(`/tables/mqccf6avwxoqc5n/records?where=(ma_order,allof,${handoverId})`);
      return response.data;
    } catch (error) {
      console.error('Error fetching handover class:', error);
      throw error;
    }
  }
};

export default studentApi;