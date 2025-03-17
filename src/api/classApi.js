import apiClient from './config';

// API functions related to class data
const classApi = {
  // Find classes that match student preferences
  findMatchingClasses: async (product, size, level, teacherType) => {
    try {
      const response = await apiClient.get(
        `/tables/mhh0jrb11ycvfzg/records?where=((soSlotConLai,lt,0)~and(Product,allof,${product})~and(Size,allof,${size})~and(Level,allof,${level})~and(Teacher_type,allof,${teacherType})~and((Status,allof,Dự kiến khai giảng)~or(Status,allof,Chốt khai giảng)))`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching matching classes:', error);
      throw error;
    }
  },

  // Find class by class code
  findClassByCode: async (classCode) => {
    try {
      const response = await apiClient.get(`/tables/mhh0jrb11ycvfzg/records?where=(Classcode,allof,${classCode})`);
      return response.data;
    } catch (error) {
      console.error('Error fetching class by code:', error);
      throw error;
    }
  },

  // Update class (e.g., increase slot count)
  updateClass: async (data) => {
    try {
      const response = await apiClient.patch(`/tables/mhh0jrb11ycvfzg/records`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating class:', error);
      throw error;
    }
  },

  // Update class for SpeakWell
  updateClassSP: async (data) => {
    try {
      const response = await apiClient.patch(`/tables/myepkgaw4gfdb0l/records`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating SpeakWell class:', error);
      throw error;
    }
  }
};

export default classApi;