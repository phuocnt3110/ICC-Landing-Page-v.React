import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Select, 
  Checkbox, 
  Button, 
  Table, 
  Typography, 
  Alert,
  Empty,
  Spin,
  Input
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useAppContext } from '../../context/AppContext';
import ScheduleConfirmModal from '../modals/ScheduleConfirmModal';
import scheduleApi from '../../api/scheduleApi';
import { calculateStartDate } from '../../utils/dateUtils';

const { Title, Text } = Typography;
const { Option } = Select;

const SpeakWellSchedule = () => {
  const { studentData, registerSpeakWellSchedule } = useAppContext();
  const [form] = Form.useForm();
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [timeRange, setTimeRange] = useState({ start: '', end: '' });
  const [teacherSchedules, setTeacherSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  
  // Load time slots when component mounts
  useEffect(() => {
    const fetchTimeSlots = async () => {
      setLoading(true);
      try {
        const response = await scheduleApi.getSpeakWellTimeSlots();
        if (response.list && response.list.length > 0) {
          setTimeSlots(response.list);
        }
      } catch (error) {
        console.error('Error fetching time slots:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTimeSlots();
  }, []);
  
  // Handle day selection changes
  const handleDayChange = (e) => {
    const { id, checked } = e.target;
    const day = id.replace('thu', 'Thứ ');
    
    if (id === 'cn') {
      if (checked) {
        setSelectedDays(prev => [...prev, 'Chủ nhật']);
      } else {
        setSelectedDays(prev => prev.filter(d => d !== 'Chủ nhật'));
      }
    } else {
      if (checked) {
        setSelectedDays(prev => [...prev, day]);
      } else {
        setSelectedDays(prev => prev.filter(d => d !== day));
      }
    }
  };
  
  // Handle time slot selection
  const handleTimeSlotChange = (value) => {
    if (!value) {
      setTimeRange({ start: '', end: '' });
      return;
    }
    
    const [start, end] = value.split(',');
    setTimeRange({ start, end });
    
    // Store values in hidden form fields
    form.setFieldsValue({
      startTime: start,
      endTime: end
    });
  };
  
  // Search for available teachers
  const handleSearch = async () => {
    if (selectedDays.length === 0 || !timeRange.start || !timeRange.end) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Map selected days to API day names
      const dayMapping = {
        'Thứ 2': 'Monday',
        'Thứ 3': 'Tuesday',
        'Thứ 4': 'Wednesday',
        'Thứ 5': 'Thursday',
        'Thứ 6': 'Friday',
        'Thứ 7': 'Saturday',
        'Chủ nhật': 'Sunday'
      };
      
      // Construct day conditions for API
      let dayConditions = selectedDays
        .map(day => `(${dayMapping[day]},eq,Blank)`)
        .join("~or");
        
      if (dayConditions) {
        dayConditions = "~and" + "(" + dayConditions + ")";
      }
      
      const response = await scheduleApi.getSpeakWellTeacherSchedules(
        timeRange.start,
        timeRange.end,
        studentData.loaiGiaoVien,
        dayConditions
      );
      
      if (response.list && response.list.length > 0) {
        // Group by teacher name
        const groupedData = {};
        
        response.list.forEach(record => {
          const teacherName = record.tenGV;
          if (!groupedData[teacherName]) {
            groupedData[teacherName] = [];
          }
          groupedData[teacherName].push(record);
        });
        
        // Transform to table data format
        const tableData = Object.entries(groupedData)
          .map(([teacherName, records]) => {
            // Check if teacher has at least one day available
            let isAvailable = false;
            records.forEach(record => {
              selectedDays.forEach(day => {
                const apiDay = dayMapping[day];
                if (record[apiDay] === "Blank") {
                  isAvailable = true;
                }
              });
            });
            
            // Only include available teachers with matching teacher type
            if (isAvailable && records[0].loaiGiaoVien === studentData.loaiGiaoVien) {
              return {
                teacherName,
                gender: records[0].gioiTinh,
                time: records[0].thoiGian,
                monday: records[0].Monday === "Blank" ? 'Rảnh' : '',
                tuesday: records[0].Tuesday === "Blank" ? 'Rảnh' : '',
                wednesday: records[0].Wednesday === "Blank" ? 'Rảnh' : '',
                thursday: records[0].Thursday === "Blank" ? 'Rảnh' : '',
                friday: records[0].Friday === "Blank" ? 'Rảnh' : '',
                saturday: records[0].Saturday === "Blank" ? 'Rảnh' : '',
                sunday: records[0].Sunday === "Blank" ? 'Rảnh' : '',
                id: records[0].Id,
                rawData: records[0] // Store raw data for later use
              };
            }
            return null;
          })
          .filter(Boolean); // Remove null entries
        
        setTeacherSchedules(tableData);
      } else {
        setTeacherSchedules([]);
      }
    } catch (error) {
      console.error('Error fetching teacher schedules:', error);
      setTeacherSchedules([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle teacher selection
  const handleSelectTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setModalVisible(true);
  };
  
  // Confirm schedule selection in modal
  const handleConfirmSchedule = (selectedSchedules) => {
    if (selectedSchedules.length === 0) return;
    
    // Generate schedule string and calculate start date
    const scheduleString = selectedSchedules
      .map(schedule => `${schedule.day}: ${timeRange.start} - ${timeRange.end}`)
      .join(', ');
      
    const days = selectedSchedules.map(schedule => schedule.day);
    const startDate = calculateStartDate(days);
    
    // Register the schedule
    registerSpeakWellSchedule(
      studentData.maLopSW || 'SW-' + Date.now().toString().substr(-6),
      scheduleString,
      startDate,
      selectedSchedules.map(schedule => ({
        Id: selectedTeacher.id,
        day: schedule.dayField, // API field name (e.g. 'Monday')
      }))
    );
    
    setModalVisible(false);
  };
  
  // Table columns
  const columns = [
    {
      title: 'Tên giáo viên',
      dataIndex: 'teacherName',
      key: 'teacherName',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Thứ 2',
      dataIndex: 'monday',
      key: 'monday',
    },
    {
      title: 'Thứ 3',
      dataIndex: 'tuesday',
      key: 'tuesday',
    },
    {
      title: 'Thứ 4',
      dataIndex: 'wednesday',
      key: 'wednesday',
    },
    {
      title: 'Thứ 5',
      dataIndex: 'thursday',
      key: 'thursday',
    },
    {
      title: 'Thứ 6',
      dataIndex: 'friday',
      key: 'friday',
    },
    {
      title: 'Thứ 7',
      dataIndex: 'saturday',
      key: 'saturday',
    },
    {
      title: 'Chủ Nhật',
      dataIndex: 'sunday',
      key: 'sunday',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          size="small" 
          onClick={() => handleSelectTeacher(record)}
        >
          Chọn giáo viên
        </Button>
      ),
    },
  ];
  
  return (
    <Card className="form-section">
      <Title level={4} style={{ textAlign: 'center', marginBottom: 24, color: '#00509f' }}>
        ĐĂNG KÝ LỊCH HỌC SPEAKWELL
      </Title>
      
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
        message="Hãy chọn thời gian học phù hợp"
        description="Vui lòng chọn ngày và giờ có thể học, sau đó nhấn Tìm kiếm để xem danh sách giáo viên phù hợp."
      />
      
      <Form form={form} layout="vertical">
        {/* Hidden fields for time range */}
        <Form.Item name="startTime" hidden><Input /></Form.Item>
        <Form.Item name="endTime" hidden><Input /></Form.Item>
        
        <Form.Item label="Ngày trong tuần có thể học:">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <Checkbox id="thu2" onChange={handleDayChange}>Thứ 2</Checkbox>
            <Checkbox id="thu3" onChange={handleDayChange}>Thứ 3</Checkbox>
            <Checkbox id="thu4" onChange={handleDayChange}>Thứ 4</Checkbox>
            <Checkbox id="thu5" onChange={handleDayChange}>Thứ 5</Checkbox>
            <Checkbox id="thu6" onChange={handleDayChange}>Thứ 6</Checkbox>
            <Checkbox id="thu7" onChange={handleDayChange}>Thứ 7</Checkbox>
            <Checkbox id="cn" onChange={handleDayChange}>Chủ Nhật</Checkbox>
          </div>
        </Form.Item>
        
        <Form.Item label="Giờ có thể học:">
          <Select
            placeholder="Chọn thời gian"
            style={{ width: '100%' }}
            onChange={handleTimeSlotChange}
          >
            {timeSlots.map((slot, index) => (
              <Option 
                key={index} 
                value={`${slot.thoiGianBatDau},${slot.thoiGianKetThuc}`}
              >
                {slot.thoiGianBatDau} - {slot.thoiGianKetThuc}
              </Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item>
          <Button 
            type="primary" 
            icon={<SearchOutlined />} 
            onClick={handleSearch}
            disabled={selectedDays.length === 0 || !timeRange.start || !timeRange.end}
          >
            Tìm kiếm
          </Button>
        </Form.Item>
      </Form>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '30px 0' }}>
          <Spin tip="Đang tìm kiếm..." />
        </div>
      ) : teacherSchedules.length > 0 ? (
        <Table 
          columns={columns} 
          dataSource={teacherSchedules} 
          rowKey="id"
          pagination={false}
          scroll={{ x: true }}
          bordered
        />
      ) : (
        <Empty 
          description="Không có lịch dạy phù hợp" 
          style={{ margin: '30px 0' }}
        />
      )}
      
      {selectedTeacher && (
        <ScheduleConfirmModal
          visible={modalVisible}
          teacher={selectedTeacher}
          selectedDays={selectedDays}
          timeRange={timeRange}
          onCancel={() => setModalVisible(false)}
          onConfirm={handleConfirmSchedule}
        />
      )}
    </Card>
  );
};

export default SpeakWellSchedule;