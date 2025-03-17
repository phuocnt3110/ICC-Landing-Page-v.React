import moment from 'moment';

// Format date from yyyy-MM-dd to dd/MM/yyyy
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  // Check if the date is already in dd/MM/yyyy format
  if (dateString.includes('/')) {
    return dateString;
  }
  
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const month = String(parts[1]).padStart(2, '0');
      const day = String(parts[2]).padStart(2, '0');
      
      return `${day}/${month}/${year}`;
    }
    return dateString;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Calculate expected start date for SpeakWell courses
export const calculateStartDate = (selectedDays) => {
  const today = moment();
  const dayMapping = {
    "Thứ 2": 1, // Monday
    "Thứ 3": 2, // Tuesday
    "Thứ 4": 3, // Wednesday
    "Thứ 5": 4, // Thursday
    "Thứ 6": 5, // Friday
    "Thứ 7": 6, // Saturday
    "Chủ nhật": 0 // Sunday
  };
  
  let nearestDate = null;
  
  // Find the nearest date from the selected days
  selectedDays.forEach(day => {
    const dayNumber = dayMapping[day];
    let targetDate = moment();
    
    // Calculate days until the next occurrence of this day
    const daysUntil = (7 + dayNumber - today.day()) % 7;
    targetDate.add(daysUntil, 'days');
    
    // If the date is less than 3 days from now, add a week
    if (targetDate.diff(today, 'days') < 3) {
      targetDate.add(7, 'days');
    }
    
    // Update nearest date if this is the earliest valid date
    if (!nearestDate || targetDate.isBefore(nearestDate)) {
      nearestDate = targetDate;
    }
  });
  
  return nearestDate ? nearestDate.format('YYYY-MM-DD') : null;
};

// Get day display name from day of week
export const getDayDisplayName = (dayOfWeek) => {
  const dayNames = {
    'Monday': 'Thứ 2',
    'Tuesday': 'Thứ 3',
    'Wednesday': 'Thứ 4',
    'Thursday': 'Thứ 5',
    'Friday': 'Thứ 6',
    'Saturday': 'Thứ 7',
    'Sunday': 'Chủ nhật'
  };
  
  return dayNames[dayOfWeek] || dayOfWeek;
};

// Parse schedule string like "Thứ 2: 9:00 - 10:30, Thứ 4: 9:00 - 10:30"
export const parseScheduleString = (scheduleString) => {
  if (!scheduleString) return [];
  
  const schedules = scheduleString.split(',').map(s => s.trim());
  
  return schedules.map(schedule => {
    const [day, time] = schedule.split(':').map(s => s.trim());
    return { day, time };
  });
};