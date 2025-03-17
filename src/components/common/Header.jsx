import React from 'react';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';
import './CommonStyles.css';

const { Header: AntHeader } = Layout;

const Header = () => {
  return (
    <AntHeader className="app-header">
      <div className="logo-container">
        <Link to="/">
          <img 
            src="https://www.icanconnect.vn/_next/image?url=https%3A%2F%2Fs3.icankid.io%2Fmedia%2Fweb%2Fican-connect%2FICanConnect-logo.png&w=256&q=75" 
            alt="ICANCONNECT Logo" 
            className="logo" 
          />
        </Link>
      </div>
    </AntHeader>
  );
};

export default Header;