import React from 'react';
import { Table, Button, Empty, Alert, Typography, Space } from 'antd';
import { useAppContext } from '../../context/AppContext';
import { formatDate } from '../../utils/dateUtils';
import Swal from 'sweetalert2';

const { Title } = Typography;

const ScheduleTable = ({ onShowCustomForm }) => {
  const { classes, registerClass } = useAppContext();
  
  // Group classes by Classcode
  const groupedClasses = React.useMemo(() => {
    const grouped = {};
    
    classes.forEach(cls => {
      const classCode = cls.Classcode;
      
      if (!grouped[classCode]) {
        grouped[classCode] = [];
      }
      
      grouped[classCode].push(cls);
    });
    
    return grouped;
  }, [classes]);
  
  // Format classes for table display
  const tableData = React.useMemo(() => {
    return Object.entries(groupedClasses).map(([classCode, records], index) => {
      // Get schedule string
      const scheduleString = records
        .map(record => `${record.Weekday}: ${record.Time}`)
        .join(', ');
      
      // Get start date from first record
      const startDate = records[0]?.Start_date || '';
      
      return {
        key: index,
        classCode,
        scheduleString,
        startDate,
        records
      };
    });
  }, [groupedClasses]);
  
  // Handle registration click
  const handleRegister = (classCode, scheduleString, startDate) => {
    Swal.fire({
      title: 'Xác nhận đăng ký',
      text: `Bạn có chắc chắn muốn đăng ký lớp ${classCode} không?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đăng ký',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        registerClass(classCode, scheduleString, startDate);
      }
    });
  };
  
  // Define table columns
  const columns = [
    {
      title: 'Mã lớp',
      dataIndex: 'classCode',
      key: 'classCode',
    },
    {
      title: 'Lịch học',
      dataIndex: 'scheduleString',
      key: 'scheduleString',
    },
    {
      title: 'Ngày khai giảng dự kiến',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (startDate) => formatDate(startDate)
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          size="small"
          onClick={() => handleRegister(record.classCode, record.scheduleString, record.startDate)}
        >
          Đăng ký
        </Button>
      ),
    },
  ];
  
  // If no classes found
  if (!tableData || tableData.length === 0) {
    return (
      <div style={{ marginTop: 24 }}>
        <Empty 
          description="Chưa có lịch học phù hợp" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button type="primary" onClick={onShowCustomForm}>
            Đăng ký lịch khác
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="schedule-table">
      <Title level={4} style={{ textAlign: 'center', marginBottom: 24, color: '#00509f' }}>
        LỊCH HỌC
      </Title>
      
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        message="Lưu ý về lịch học"
        description={
          <Space direction="vertical">
            <span>- Đối với học viên có lịch học phù hợp: Vui lòng chọn mã lớp và ấn vào nút "Đăng ký" để xác nhận lịch học</span>
            <span>- Khi đã đăng ký lịch học thành công, học viên không được sửa lịch học</span>
            <span>- Trong trường hợp học viên muốn sửa lịch vui lòng quét mã QR bên cạnh để kết nối với ICANCONNECT</span>
          </Space>
        }
      />
      
      <Table 
        columns={columns} 
        dataSource={tableData} 
        pagination={false}
        bordered
      />
      
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Button type="primary" onClick={onShowCustomForm}>
          Đăng ký lịch khác
        </Button>
      </div>
    </div>
  );
};

export default ScheduleTable;