import React, { useEffect } from 'react';
import { Button, Layout } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const { Content } = Layout;

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { studentData } = useAppContext();
  
  // Check if the URL already has an ID parameter
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const studentId = queryParams.get('id');
    
    // If we have student ID in URL, go directly to step one
    if (studentId) {
      navigate(`/step-one${location.search}`);
    }
  }, [location.search, navigate]);
  
  const handleGetStarted = () => {
    // If we already have student data (from context), go to step one with ID
    if (studentData?.studentId) {
      navigate(`/step-one?id=${studentData.studentId}`);
    } else {
      // Otherwise, go to step one and wait for ID in URL
      navigate('/step-one');
    }
  };
  
  return (
    <Content>
      <div className="banner-container">
        <img 
          src="/img/banner.jpg" 
          alt="ICANCONNECT Banner" 
          className="banner-image"
        />
        <div className="banner-overlay">
          <Button 
            type="primary" 
            ghost 
            size="large"
            onClick={handleGetStarted}
          >
            Nhấn để bắt đầu
          </Button>
        </div>
      </div>
    </Content>
  );
};

export default Home;