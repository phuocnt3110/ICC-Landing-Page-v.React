import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';

const { Content } = Layout;

const NotFound = () => {
  return (
    <Content style={{ padding: '50px 0' }}>
      <Result
        status="404"
        title="404"
        subTitle="Xin lỗi, trang bạn tìm kiếm không tồn tại."
        extra={
          <Button type="primary">
            <Link to="/">Quay lại trang chủ</Link>
          </Button>
        }
      />
    </Content>
  );
};

export default NotFound;