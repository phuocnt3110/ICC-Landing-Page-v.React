import React, { useState, useEffect } from 'react';
import { Layout, Typography, Empty, Button, Row, Col, Card } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { QrcodeOutlined } from '@ant-design/icons';
import { useAppContext } from '../context/AppContext';
import ScheduleTable from '../components/schedule/ScheduleTable';
import CustomScheduleForm from '../components/schedule/CustomScheduleForm';
import RegisteredSchedule from '../components/schedule/RegisteredSchedule';
import SpeakWellSchedule from '../components/schedule/SpeakWellSchedule';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const StepTwo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    studentData, 
    activeStep, 
    setActiveStep, 
    registeredSchedule,
    resetRegistration 
  } = useAppContext();
  const [showCustomForm, setShowCustomForm] = useState(false);
  
  // Check if user came from step one
  useEffect(() => {
    if (activeStep !== 2) {
      navigate(`/step-one${location.search}`);
    }
  }, [activeStep, navigate, location.search]);
  
  // If no student data, redirect to step one
  if (!studentData.studentId) {
    navigate(`/step-one${location.search}`);
    return null;
  }
  
  // Handle show custom schedule form
  const handleShowCustomForm = () => {
    setShowCustomForm(true);
  };
  
  // Handle going back to schedule table
  const handleBackToTable = () => {
    setShowCustomForm(false);
  };
  
  // Handle rejecting handover class
  const handleRejectHandover = () => {
    resetRegistration();
  };
  
  // Determine what content to show
  const renderContent = () => {
    // If student already registered for a class
    if (registeredSchedule) {
      return <RegisteredSchedule onReject={handleRejectHandover} />;
    }
    
    // SpeakWell has special handling
    if (studentData.tenSanPham === "SpeakWell") {
      return <SpeakWellSchedule />;
    }
    
    // Special case for Easy PASS with no classes
    if (studentData.tenSanPham === "Easy PASS") {
      return (
        <Card className="form-section">
          <Title level={4} style={{ textAlign: 'center', marginBottom: 24, color: '#00509f' }}>
            CHƯA CÓ LỊCH HỌC PHÙ HỢP
          </Title>
          <Paragraph style={{ textAlign: 'center', fontSize: 16 }}>
            <Text strong>Hiện tại chưa có lịch học phù hợp với bạn</Text>
          </Paragraph>
          <Paragraph style={{ textAlign: 'center', fontSize: 16 }}>
            ICANCONNECT sẽ liên hệ để xếp lớp học cho bạn trong thời gian sớm nhất!
          </Paragraph>
        </Card>
      );
    }
    
    // Show custom form if requested
    if (showCustomForm) {
      return <CustomScheduleForm onGoBack={handleBackToTable} />;
    }
    
    // Default: show schedule table
    return <ScheduleTable onShowCustomForm={handleShowCustomForm} />;
  };
  
  return (
    <Content style={{ padding: '30px 15px' }}>
      {/* Progress steps */}
      <div className="progress-steps">
        <div className="step completed">
          <div className="circle">1</div>
          <div>Xác nhận thông tin</div>
        </div>
        <div className="divider"></div>
        <div className="step active">
          <div className="circle">2</div>
          <div>Đặt lịch học</div>
        </div>
      </div>
      
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 0' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 20, color: '#00509f' }}>
          Bước 2: Chọn lịch học phù hợp
        </Title>
        
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={18}>
            {renderContent()}
          </Col>
          <Col xs={24} lg={6}>
            <Card style={{ textAlign: 'center' }}>
              <QrcodeOutlined style={{ fontSize: 64, color: '#00509f', marginBottom: 16 }} />
              <Paragraph>
                <Text strong style={{ color: '#00509f' }}>OA - ICANCONNECT</Text>
              </Paragraph>
              <Paragraph>
                <Text>Mở Zalo, bấm quét QR và xem trên điện thoại</Text>
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
    </Content>
  );
};

export default StepTwo;