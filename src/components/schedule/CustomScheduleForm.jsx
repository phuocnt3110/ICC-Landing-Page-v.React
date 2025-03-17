import React, { useState, useEffect } from 'react';
import { Card, Form, Select, Button, Typography, Alert, Space } from 'antd';
import { ArrowLeftOutlined, CheckOutlined } from '@ant-design/icons';
import { useAppContext } from '../../context/AppContext';
import scheduleApi from '../../api/scheduleApi';
import Swal from 'sweetalert2';

const { Title, Text } = Typography;
const { Option } = Select;

const CustomScheduleForm = ({ onGoBack }) => {
  const { registerCustomSchedule } = useAppContext();
  const [form] = Form.useForm();
  const [scheduleOptions, setScheduleOptions] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [timeOptions, setTimeOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Fetch schedule options when component mounts
  useEffect(() => {
    const fetchScheduleOptions = async () => {
      setLoading(true);
      try {
        const response = await scheduleApi.getAvailableScheduleOptions();
        if (response.list && response.list.length > 0) {
          setScheduleOptions(response.list);
        }
      } catch (error) {
        console.error('Error fetching schedule options:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchScheduleOptions();
  }, []);
  
  // Get unique days from schedule options
  const dayOptions = React.useMemo(() => {
    const days = new Set();
    
    scheduleOptions.forEach(option => {
      if (option.thu) {
        days.add(option.thu);
      }
    });
    
    return Array.from(days);
  }, [scheduleOptions]);
  
  // Handle day selection change
  const handleDayChange = (value) => {
    setSelectedDay(value);
    form.setFieldsValue({ time: undefined });
    
    // Find time options for selected day
    const times = [];
    scheduleOptions.forEach(option => {
      if (option.thu === value) {
        if (option.gio_1) times.push(option.gio_1);
        if (option.gio_2) times.push(option.gio_2);
      }
    });
    
    setTimeOptions(times);
  };
  
  // Handle form submission
  const handleSubmit = async (values) => {
    const { day, time } = values;
    
    if (!day || !time) {
      Swal.fire({
        icon: 'warning',
        title: 'Thiếu thông tin',
        text: 'Vui lòng chọn cả ngày và giờ học!',
      });
      return;
    }
    
    const scheduleString = `${day} : ${time}`;
    
    Swal.fire({
      title: 'Xác nhận đăng ký',
      text: `Bạn có chắc chắn muốn đăng ký lịch học: ${scheduleString}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const success = await registerCustomSchedule(scheduleString);
        if (success) {
          form.resetFields();
        }
      }
    });
  };
  
  return (
    <Card className="form-section">
      <Title level={4} style={{ textAlign: 'center', marginBottom: 24, color: '#00509f' }}>
        CHƯA CÓ LỊCH HỌC PHÙ HỢP
      </Title>
      
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
        message="Bạn hãy chọn lịch có thể học dưới đây:"
        description={
          <Space direction="vertical">
            <Text>
              ICANCONNECT sẽ liên hệ để xác nhận lớp học cho bạn trong thời gian sớm nhất!
            </Text>
          </Space>
        }
      />
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Chọn ngày có thể học"
          name="day"
          rules={[{ required: true, message: 'Vui lòng chọn ngày học' }]}
        >
          <Select
            placeholder="Chọn ngày trong tuần có thể học"
            onChange={handleDayChange}
            loading={loading}
          >
            {dayOptions.map((day, index) => (
              <Option key={index} value={day}>
                {day}
              </Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item
          label="Chọn giờ học"
          name="time"
          rules={[{ required: true, message: 'Vui lòng chọn giờ học' }]}
        >
          <Select
            placeholder="Chọn giờ"
            disabled={!selectedDay}
            loading={loading}
          >
            {timeOptions.map((time, index) => (
              <Option key={index} value={time}>
                {time}
              </Option>
            ))}
          </Select>
        </Form.Item>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={onGoBack}
            disabled={loading}
          >
            Quay lại
          </Button>
          
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<CheckOutlined />}
            loading={loading}
          >
            Đăng ký lịch
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default CustomScheduleForm;