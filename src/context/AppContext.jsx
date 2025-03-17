import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import studentApi from '../api/studentApi';
import classApi from '../api/classApi';
import Swal from 'sweetalert2';

// Create Context
const AppContext = createContext();

// Custom hook to use the app context
export const useAppContext = () => useContext(AppContext);

// Provider Component
export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  
  // Student and class data states
  const [studentData, setStudentData] = useState({
    Id: '',
    studentId: '',
    maTheoDoi: '',
    maDonHang: '',
    hoTenHocVien: '',
    sdtHocVien: '',
    emailHocVien: '',
    tenSanPham: '',
    trinhDo: '',
    size: '',
    loaiGiaoVien: '',
    soBuoi: '',
    giaThucDong: '',
    hoTenDaiDien: '',
    sdtDaiDien: '',
    emailDaiDien: '',
    maLop: '',
    lichHoc: '',
    ngayKhaiGiangDuKien: '',
    maLopSW: '',
    maLopBanGiao: ''
  });
  
  const [classes, setClasses] = useState([]);
  const [activeStep, setActiveStep] = useState(1);
  const [registeredSchedule, setRegisteredSchedule] = useState(null);
  
  // Fetch student data based on URL query parameter
  useEffect(() => {
    const fetchInitialData = async () => {
      // Parse URL query parameters
      const queryParams = new URLSearchParams(location.search);
      const studentId = queryParams.get('id');
      
      if (studentId) {
        setLoading(true);
        try {
          const response = await studentApi.getStudentById(studentId);
          
          if (response.list && response.list.length > 0) {
            const data = response.list[0];
            setStudentData(data);
            
            // Check if student already has registered schedule
            if (data.maLop && data.lichHoc && data.ngayKhaiGiangDuKien) {
              setRegisteredSchedule({
                maLop: data.maLop,
                lichHoc: data.lichHoc,
                ngayKhaiGiangDuKien: data.ngayKhaiGiangDuKien
              });
            }
            
            // If student has handover class, handle it
            else if (data.maLopBanGiao) {
              handleHandoverClass(data.maLopBanGiao);
            }
          }
        } catch (error) {
          console.error('Error fetching student data:', error);
          showErrorAlert('Không thể tải dữ liệu học viên');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchInitialData();
  }, [location.search]);
  
  // Handle handover class
  const handleHandoverClass = async (handoverId) => {
    setLoading(true);
    try {
      const response = await studentApi.getHandoverClass(handoverId);
      
      if (response.list && response.list.length > 0) {
        const handoverData = response.list[0];
        const maLop = handoverData.ma_lop;
        
        if (maLop) {
          const classResponse = await classApi.findClassByCode(maLop);
          
          if (classResponse.list && classResponse.list.length > 0) {
            const classData = classResponse.list;
            // Create schedule from class data
            const lichHoc = classData
              .map(item => `${item.Weekday}: ${item.Time}`)
              .join(', ');
              
            const ngayKhaiGiang = classData[0]?.Start_date || 'Chưa có ngày khai giảng';
            
            // Set handover data to show confirmation
            setRegisteredSchedule({
              maLop,
              lichHoc,
              ngayKhaiGiangDuKien: ngayKhaiGiang,
              isHandover: true // Flag to indicate this is a handover class
            });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching handover class:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Confirm student information and proceed to step 2
  const confirmStudentInfo = async (values) => {
    setLoading(true);
    try {
      // Update student data with form values
      const updatedData = {
        ...values,
        Id: studentData.Id,
        studentId: studentData.studentId,
        maTheoDoi: studentData.maTheoDoi,
        maDonHang: studentData.maDonHang,
      };
      
      await studentApi.updateStudent(updatedData);
      
      // Update local state
      setStudentData(prev => ({
        ...prev,
        ...values
      }));
      
      // Show success notification
      Swal.fire({
        title: 'Xác nhận thành công!',
        icon: 'success',
        confirmButtonText: 'Tiếp tục'
      });
      
      // Move to step 2
      setActiveStep(2);
      
      // Load class data for step 2
      await loadClassData();
      
    } catch (error) {
      console.error('Error confirming student info:', error);
      showErrorAlert('Không thể cập nhật thông tin học viên');
    } finally {
      setLoading(false);
    }
  };
  
  // Load class data for step 2
  const loadClassData = async () => {
    // Skip if already registered
    if (registeredSchedule) return;
    
    setLoading(true);
    try {
      const { tenSanPham, size, trinhDo, loaiGiaoVien } = studentData;
      
      // SpeakWell has special handling
      if (tenSanPham === "SpeakWell") {
        // Just set the flag to show SpeakWell interface
        setClasses([]);
        return;
      }
      
      // For other courses, fetch matching classes
      const response = await classApi.findMatchingClasses(
        tenSanPham, 
        size, 
        trinhDo, 
        loaiGiaoVien
      );
      
      if (response.list && response.list.length > 0) {
        setClasses(response.list);
      } else if (tenSanPham === "Easy PASS") {
        // Special case for Easy PASS with no classes
        setClasses([]);
      } else {
        // No matching classes for other courses
        setClasses([]);
      }
      
    } catch (error) {
      console.error('Error loading class data:', error);
      showErrorAlert('Không thể tải dữ liệu lớp học');
    } finally {
      setLoading(false);
    }
  };
  
  // Register for a class
  const registerClass = async (classCode, lichHoc, startDate) => {
    setLoading(true);
    try {
      // Find class data
      const response = await classApi.findClassByCode(classCode);
      
      if (response.list && response.list.length > 0) {
        const classData = response.list;
        
        // Check if class is full
        if (classData[0].soSlotConLai <= 0) {
          showErrorAlert('Lớp học đã đủ sĩ số, vui lòng chọn lớp khác.');
          return false;
        }
        
        // Update all class records with same class code
        for (const record of classData) {
          const soDaDangKyHienTai = record.soDaDangKy || 0;
          
          await classApi.updateClass({
            Id: record.Id,
            soDaDangKy: soDaDangKyHienTai + 1
          });
        }
        
        // Update student record with class info
        const updatedData = {
          Id: studentData.Id,
          maLop: classCode,
          lichHoc: lichHoc,
          ngayKhaiGiangDuKien: startDate,
          trangThai: 'Đã chọn lịch thành công',
          status: 'L3.Nghe máy và xác nhận lịch'
        };
        
        await studentApi.updateStudent(updatedData);
        
        // Update local state
        setStudentData(prev => ({
          ...prev,
          ...updatedData
        }));
        
        // Set registered schedule
        setRegisteredSchedule({
          maLop: classCode,
          lichHoc: lichHoc,
          ngayKhaiGiangDuKien: startDate
        });
        
        // Show success message
        Swal.fire({
          title: 'Đăng ký thành công!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        
        return true;
      } else {
        showErrorAlert('Không tìm thấy lớp học!');
        return false;
      }
    } catch (error) {
      console.error('Error registering class:', error);
      showErrorAlert('Đăng ký không thành công: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Register custom schedule
  const registerCustomSchedule = async (scheduleString) => {
    setLoading(true);
    try {
      const updatedData = {
        Id: studentData.Id,
        lichHoc: scheduleString,
        trangThai: 'Đăng ký lịch ngoài'
      };
      
      await studentApi.updateStudent(updatedData);
      
      // Update local state
      setStudentData(prev => ({
        ...prev,
        lichHoc: scheduleString,
        trangThai: 'Đăng ký lịch ngoài'
      }));
      
      // Show success message
      Swal.fire({
        title: 'Đăng ký thành công!',
        text: 'ICANCONNECT sẽ liên hệ để xác nhận lớp học cho bạn trong thời gian sớm nhất!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      
      return true;
    } catch (error) {
      console.error('Error registering custom schedule:', error);
      showErrorAlert('Đăng ký không thành công: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Confirm handover class
  const confirmHandoverClass = async (classCode, lichHoc, startDate) => {
    setLoading(true);
    try {
      // Find class data
      const response = await classApi.findClassByCode(classCode);
      
      if (response.list && response.list.length > 0) {
        const classData = response.list;
        
        // Update all class records with same class code
        for (const record of classData) {
          const soDaDangKyHienTai = record.soDaDangKy || 0;
          
          await classApi.updateClass({
            Id: record.Id,
            soDaDangKy: soDaDangKyHienTai + 1
          });
        }
        
        // Update student record with class info
        const updatedData = {
          Id: studentData.Id,
          maLop: classCode,
          lichHoc: lichHoc,
          ngayKhaiGiangDuKien: startDate,
          trangThai: 'Đã xác nhận lịch được giữ',
          status: 'L3.Nghe máy và xác nhận lịch'
        };
        
        await studentApi.updateStudent(updatedData);
        
        // Update local state
        setStudentData(prev => ({
          ...prev,
          ...updatedData
        }));
        
        // Set registered schedule but remove handover flag
        setRegisteredSchedule({
          maLop: classCode,
          lichHoc: lichHoc,
          ngayKhaiGiangDuKien: startDate
        });
        
        // Show success message
        Swal.fire({
          title: 'Xác nhận thành công!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        
        return true;
      } else {
        showErrorAlert('Không tìm thấy thông tin lớp học!');
        return false;
      }
    } catch (error) {
      console.error('Error confirming handover class:', error);
      showErrorAlert('Xác nhận không thành công: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Register SpeakWell schedule
  const registerSpeakWellSchedule = async (maLopSW, lichHoc, ngayKhaiGiang, selectedTeachers) => {
    setLoading(true);
    try {
      // Update student record with SpeakWell info
      const updatedStudentData = {
        Id: studentData.Id,
        maLop: maLopSW,
        lichHoc: lichHoc,
        ngayKhaiGiangDuKien: ngayKhaiGiang,
        trangThai: 'Đã chọn lịch thành công',
        status: 'L3.Nghe máy và xác nhận lịch'
      };
      
      await studentApi.updateStudent(updatedStudentData);
      
      // Update teacher schedules
      for (const teacherData of selectedTeachers) {
        await classApi.updateClassSP({
          Id: teacherData.Id,
          [teacherData.day]: maLopSW
        });
      }
      
      // Update local state
      setStudentData(prev => ({
        ...prev,
        ...updatedStudentData
      }));
      
      // Set registered schedule
      setRegisteredSchedule({
        maLop: maLopSW,
        lichHoc: lichHoc,
        ngayKhaiGiangDuKien: ngayKhaiGiang
      });
      
      // Show success message
      Swal.fire({
        title: 'Đăng ký lịch học thành công!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      
      return true;
    } catch (error) {
      console.error('Error registering SpeakWell schedule:', error);
      showErrorAlert('Đăng ký không thành công: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Reset registration to get new options
  const resetRegistration = () => {
    setRegisteredSchedule(prevSchedule => {
      // Only reset if it's a handover class that hasn't been confirmed
      if (prevSchedule?.isHandover) {
        return null;
      }
      return prevSchedule;
    });
    
    // Reload class data
    loadClassData();
  };
  
  // Helper to show error alerts
  const showErrorAlert = (message) => {
    Swal.fire({
      title: 'Lỗi',
      text: message,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  };
  
  // Value object to be provided to consumers
  const contextValue = {
    loading,
    setLoading,
    studentData,
    setStudentData,
    classes,
    activeStep,
    setActiveStep,
    registeredSchedule,
    confirmStudentInfo,
    loadClassData,
    registerClass,
    registerCustomSchedule,
    confirmHandoverClass,
    registerSpeakWellSchedule,
    resetRegistration
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;