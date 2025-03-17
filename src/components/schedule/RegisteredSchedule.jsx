import React from 'react';
import { Card, Table, Typography, Alert, QRCode, Row, Col, Space } from 'antd';
import { useAppContext } from '../../context/AppContext';
import { formatDate } from '../../utils/dateUtils';

const { Title, Text } = Typography;

const RegisteredSchedule = ({ isHandover, onReject }) => {
  const { registeredSchedule, confirmHandoverClass } = useAppContext();
  
  if (!registeredSchedule) return null;
  
  const { maLop, lichHoc, ngayKhaiGiangDuKien } = registeredSchedule;
  const formattedDate = formatDate(ngayKhaiGiangDuKien);
  
  // If this is a handover class that needs confirmation
  const showHandoverConfirmation = isHandover || registeredSchedule.isHandover;
  
  const columns = [
    {
      title: 'Mã lớp',
      dataIndex: 'maLop',
      key: 'maLop',
    },
    {
      title: 'Lịch học',
      dataIndex: 'lichHoc',
      key: 'lichHoc',
    },
    {
      title: 'Ngày khai giảng dự kiến',
      dataIndex: 'ngayKhaiGiang',
      key: 'ngayKhaiGiang',
    },
  ];
  
  const data = [
    {
      key: '1',
      maLop,
      lichHoc,
      ngayKhaiGiang: formattedDate,
    },
  ];
  
  const handleConfirmHandover = () => {
    confirmHandoverClass(maLop, lichHoc, ngayKhaiGiangDuKien);
  };
  
  const handleRejectHandover = () => {
    if (onReject) onReject();
  };
  
  return (
    <Card className="form-section">
      <Title level={4} style={{ textAlign: 'center', marginBottom: 24, color: '#00509f' }}>
        {showHandoverConfirmation ? 'LỚP HỌC ĐƯỢC GIỮ CHỖ' : 'ĐÃ ĐĂNG KÝ LỊCH HỌC'}
      </Title>
      
      {showHandoverConfirmation ? (
        <Alert
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
          message="Bạn đã được giữ chỗ vào lớp học này"
          description="Vui lòng xác nhận nếu bạn đồng ý với lịch học đã được sắp xếp."
        />
      ) : (
        <Alert
          type="success"
          showIcon
          style={{ marginBottom: 24 }}
          message="Đăng ký thành công"
          description="Bạn đã đăng ký lớp học thành công, nếu muốn thay đổi lịch học vui lòng liên hệ zalo của ICANCONNECT để được hỗ trợ."
        />
      )}
      
      <Table 
        columns={columns} 
        dataSource={data} 
        pagination={false}
        bordered
      />
      
      {showHandoverConfirmation && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, gap: 16 }}>
          <button 
            className="ant-btn ant-btn-primary" 
            onClick={handleConfirmHandover}
          >
            Có, tôi đồng ý
          </button>
          <button 
            className="ant-btn ant-btn-default" 
            onClick={handleRejectHandover}
          >
            Không, chọn lịch khác
          </button>
        </div>
      )}
      
      {!showHandoverConfirmation && (
        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24} md={16}>
            <Space direction="vertical">
              <Text strong>
                Bạn đã đăng ký lớp học thành công!
              </Text>
              <Text>
                Nếu muốn thay đổi lịch học vui lòng liên hệ zalo của ICANCONNECT để được hỗ trợ.
              </Text>
            </Space>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'center' }}>
            <div>
              <QRCode
                value="https://zalo.me/icanconnect"
                size={120}
                style={{ margin: '0 auto' }}
              />
              <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                OA - ICANCONNECT
              </Text>
              <Text type="secondary" style={{ display: 'block' }}>
                Mở Zalo, bấm quét QR và xem trên điện thoại
              </Text>
            </div>
          </Col>
        </Row>
      )}
    </Card>
  );
};

export default RegisteredSchedule;