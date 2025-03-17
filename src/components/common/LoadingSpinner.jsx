import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useAppContext } from '../../context/AppContext';
import './CommonStyles.css';

const LoadingSpinner = () => {
  const { loading } = useAppContext();
  
  if (!loading) return null;
  
  const antIcon = <LoadingOutlined style={{ fontSize: 40, color: '#00509f' }} spin />;
  
  return (
    <div className="loading-container">
      <Spin indicator={antIcon} />
      <div className="loading-text">ICANCONNECT đang tải dữ liệu...</div>
    </div>
  );
};

export default LoadingSpinner;