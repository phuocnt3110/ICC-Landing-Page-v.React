import React, { useState, useEffect } from 'react';
import { Modal, Table, Checkbox, Button, Alert } from 'antd';

const ScheduleConfirmModal = ({ visible, teacher, selectedDays, timeRange, onCancel, onConfirm }) => {
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  
  // Reset selected schedules when the modal opens with a new teacher
  useEffect(() => {
    setSelectedSchedules([]);
  }, [visible, teacher]);
  
  if (!teacher) return null;
  
  // Day mapping 
  const dayMapping = {
    'Thứ 2': 'Monday',
    'Thứ 3': 'Tuesday',
    'Thứ 4': 'Wednesday',
    'Thứ 5': 'Thursday',
    'Thứ 6': 'Friday',
    'Thứ 7': 'Saturday',
    'Chủ nhật': 'Sunday'
  };
  
  // Filter days that the teacher is available for
  const availableDays = selectedDays.filter(day => {
    const apiDay = dayMapping[day];
    return teacher[apiDay.toLowerCase()] === 'Rảnh';
  });
  
  // Create data for table display
  const tableData = availableDays.map((day, index) => ({
    key: index,
    day,
    teacherName: teacher.teacherName,
    time: `${timeRange.start} - ${timeRange.end}`,
    dayField: dayMapping[day] // Store the API field name
  }));
  
  // Handle checkbox selection
  const handleSelect = (record) => {
    const isSelected = selectedSchedules.some(item => item.day === record.day);
    
    if (isSelected) {
      setSelectedSchedules(prev => prev.filter(item => item.day !== record.day));
    } else {
      setSelectedSchedules(prev => [...prev, record]);
    }
  };
  
  // Table columns
  const columns = [
    {
      title: 'Tên giáo viên',
      dataIndex: 'teacherName',
      key: 'teacherName',
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Thứ',
      dataIndex: 'day',
      key: 'day',
    },
    {
      title: 'Chọn lịch',
      key: 'select',
      render: (_, record) => (
        <Checkbox
          checked={selectedSchedules.some(item => item.day === record.day)}
          onChange={() => handleSelect(record)}
        />
      ),
    },
  ];
  
  return (
    <Modal
      title="Xác nhận lịch học"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      {tableData.length > 0 ? (
        <>
          <Alert
            message="Hãy chọn ngày học"
            description="Vui lòng chọn ít nhất một ngày học trong tuần."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            rowKey="key"
          />
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <Button
              type="primary"
              onClick={() => onConfirm(selectedSchedules)}
              disabled={selectedSchedules.length === 0}
            >
              Xác nhận lịch đã chọn
            </Button>
          </div>
        </>
      ) : (
        <Alert
          message="Không có lịch phù hợp"
          description="Không có ngày học nào phù hợp với giáo viên này."
          type="warning"
          showIcon
        />
      )}
    </Modal>
  );
};

export default ScheduleConfirmModal;