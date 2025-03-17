// Email validation regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone number validation (Vietnamese format)
const phoneRegex = /^0\d{9,10}$/;

/**
 * Validate Vietnamese phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - Whether the phone is valid
 */
export const isValidPhoneNumber = (phone) => {
  if (!phone) return false;
  return phoneRegex.test(phone);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  return emailRegex.test(email);
};

/**
 * Check if a required field has a value
 * @param {string} value - The field value
 * @returns {boolean} - Whether the field has a value
 */
export const isRequired = (value) => {
  if (value === undefined || value === null) return false;
  return value.trim().length > 0;
};

/**
 * Format currency with Vietnamese format
 * @param {number|string} value - The value to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (value) => {
  if (!value) return '';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
};

/**
 * Validate student form data
 * @param {Object} values - Form values
 * @returns {Object} - Error messages
 */
export const validateStudentForm = (values) => {
  const errors = {};
  
  // Validate required fields
  if (!isRequired(values.hoTenDaiDien)) {
    errors.hoTenDaiDien = 'Vui lòng nhập họ tên người đại diện';
  }
  
  if (!isRequired(values.sdtDaiDien)) {
    errors.sdtDaiDien = 'Vui lòng nhập số điện thoại người đại diện';
  } else if (!isValidPhoneNumber(values.sdtDaiDien)) {
    errors.sdtDaiDien = 'Số điện thoại không đúng định dạng';
  }
  
  if (!isRequired(values.emailDaiDien)) {
    errors.emailDaiDien = 'Vui lòng nhập email người đại diện';
  } else if (!isValidEmail(values.emailDaiDien)) {
    errors.emailDaiDien = 'Email không đúng định dạng';
  }
  
  return errors;
};