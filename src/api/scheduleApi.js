import apiClient from './config';

// API functions related to schedule data
const scheduleApi = {
  // Get available schedule options (for custom schedule)
  getAvailableScheduleOptions: async () => {
    try {
      const response = await apiClient.get(`/tables/matsszn85hw6pha/records`);
      return response.data;
    } catch (error) {
      console.error('Error fetching schedule options:', error);
      throw error;
    }
  },

  // Get time slots for SpeakWell
  getSpeakWellTimeSlots: async () => {
    try {
      const response = await apiClient.get(`/tables/m9ruq2cgj9605ix/records?viewId=vwrepzw97mh4v1lv`);
      return response.data;
    } catch (error) {
      console.error('Error fetching SpeakWell time slots:', error);
      throw error;
    }
  },

  // Get teacher schedules for SpeakWell
  getSpeakWellTeacherSchedules: async (startTime, endTime, teacherType, dayConditions) => {
    try {
      let url = `/tables/m9jv8e3mdpvg9vz/records?where=(thoiGian,btw,${startTime},${endTime})~and(loaiGiaoVien,anyof,${teacherType})`;
      
      if (dayConditions) {
        url += dayConditions;
      }

      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching SpeakWell teacher schedules:', error);
      throw error;
    }
  }
};

export default scheduleApi;