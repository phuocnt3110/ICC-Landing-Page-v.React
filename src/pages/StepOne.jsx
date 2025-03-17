import React, { useEffect } from 'react';
import { Layout, Typography, Empty, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import StudentInfoForm from '../components/student/StudentInfoForm';

const { Content } = Layout;
const { Title } = Typography;

const StepOne = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { studentData, activeStep, setActiveStep } = useAppContext();
  
  // Check if we have the required student ID in URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const studentId = queryParams.get('id');
    
    // If we finish step one, navigate to step two
    if (activeStep === 2) {
      navigate(`/step-two${location.search}`);
    }
    
    if (!studentId) {
      // If no student ID, show empty state
      setActiveStep(1);
    }
  }, [location.search, navigate, activeStep, setActiveStep]);
  
  // If no student data loaded yet, show empty state
  if (!studentData.studentId) {
    return (
      <Content style={{ padding: '50px 0' }}>
        <Empty 
          description="Không tìm thấy thông tin học viên" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={() => navigate('/')}>
            Quay lại trang chủ
          </Button>
        </Empty>
      </Content>
    );
  }
  
  return (
    <Content style={{ padding: '30px 15px' }}>
      {/* Progress steps */}
      <div className="progress-steps">
        <div className="step active">
          <div className="circle">1</div>
          <div>Xác nhận thông tin</div>
        </div>
        <div className="divider"></div>
        <div className="step">
          <div className="circle">2</div>
          <div>Đặt lịch học</div>
        </div>
      </div>
      
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '30px 0' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 30, color: '#00509f' }}>
          Bước 1: Điền và xác nhận thông tin cá nhân
        </Title>
        
        <StudentInfoForm />
      </div>
    </Content>
  );
};

export default StepOne;