import React from 'react';
import { Layout } from 'antd';
import { CopyrightOutlined } from '@ant-design/icons';
import './CommonStyles.css';

const { Footer: AntFooter } = Layout;

const Footer = () => {
  return (
    <AntFooter className="app-footer">
      <div className="copyright">
        <CopyrightOutlined className="copyright-icon" />
        <span>ICANCONNECT © 2023. All rights reserved.</span>
      </div>
    </AntFooter>
  );
};

export default Footer;