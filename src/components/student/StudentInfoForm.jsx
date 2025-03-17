import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Row, Col, Divider } from 'antd';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';
import { useAppContext } from '../../context/AppContext';
import { validateStudentForm } from '../../utils/validators';

const { Title, Text } = Typography;

const StudentInfoForm = () => {
  const { studentData, confirmStudentInfo } = useAppContext();
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  
  // Initialize form with student data
  React.useEffect(() => {
    form.setFieldsValue({
      hoTenHocVien: studentData.hoTenHocVien || '',
      sdtHocVien: studentData.sdtHocVien || '',
      emailHocVien: studentData.emailHocVien || '',
      hoTenDaiDien: studentData.hoTenDaiDien || '',
      sdtDaiDien: studentData.sdtDaiDien || '',
      emailDaiDien: studentData.emailDaiDien || ''
    });
  }, [studentData, form]);
  
  const handleEdit = () => {
    setEditing(true);
  };
  
  const handleSubmit = async (values) => {
    // Validate form data
    const errors = validateStudentForm(values);
    
    if (Object.keys(errors).length > 0) {
      // Set form errors
      Object.entries(errors).forEach(([field, error]) => {
        form.setFields([
          {
            name: field,
            errors: [error]
          }
        ]);
      });
      return;
    }
    
    // Call the context function to confirm info
    await confirmStudentInfo(values);
    setEditing(false);
  };
  
  return (
    <div className="form-section">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          hoTenHocVien: studentData.hoTenHocVien || '',
          sdtHocVien: studentData.sdtHocVien || '',
          emailHocVien: studentData.emailHocVien || '',
          hoTenDaiDien: studentData.hoTenDaiDien || '',
          sdtDaiDien: studentData.sdtDaiDien || '',
          emailDaiDien: studentData.emailDaiDien || ''
        }}
      >
        {/* A. Course Information */}
        <Card style={{ marginBottom: 24 }}>
          <Title level={5} className="card-title">A. Thông tin khóa học</Title>
          <Divider />
          
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Text strong>Khóa học đã đăng ký:</Text>
            </Col>
            <Col xs={24} md={16}>
              <Text>{studentData.tenSanPham || ''}</Text>
            </Col>
            
            <Col xs={24} md={8}>
              <Text strong>Trình độ bắt đầu:</Text>
            </Col>
            <Col xs={24} md={16}>
              <Text>{studentData.trinhDo || ''}</Text>
            </Col>
            
            <Col xs={24} md={8}>
              <Text strong>Sĩ số:</Text>
            </Col>
            <Col xs={24} md={16}>
              <Text>{studentData.size || ''}</Text>
            </Col>
            
            <Col xs={24} md={8}>
              <Text strong>Giáo viên:</Text>
            </Col>
            <Col xs={24} md={16}>
              <Text>{studentData.loaiGiaoVien || ''}</Text>
            </Col>
            
            <Col xs={24} md={8}>
              <Text strong>Số buổi:</Text>
            </Col>
            <Col xs={24} md={16}>
              <Text>{studentData.soBuoi || ''}</Text>
            </Col>
            
            <Col xs={24} md={8}>
              <Text strong>Học phí:</Text>
            </Col>
            <Col xs={24} md={16}>
              <Text>{studentData.giaThucDong || ''}</Text>
            </Col>
          </Row>
        </Card>
        
        {/* B. Student Information */}
        <Card style={{ marginBottom: 24 }}>
          <Title level={5} className="card-title">B. Thông tin học viên</Title>
          <Divider />
          
          <Form.Item
            name="hoTenHocVien"
            label={<span className="required-field">Họ và tên học viên</span>}
            rules={[{ required: true, message: 'Vui lòng nhập họ tên học viên' }]}
          >
            <Input disabled={!editing} />
          </Form.Item>
          
          <Form.Item
            name="sdtHocVien"
            label={<span className="required-field">Số điện thoại học viên</span>}
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại học viên' },
              { pattern: /^0\d{9,10}$/, message: 'Số điện thoại không hợp lệ' }
            ]}
          >
            <Input disabled={!editing} />
          </Form.Item>
          
          <Form.Item
            name="emailHocVien"
            label={<span className="required-field">Email học viên</span>}
            rules={[
              { required: true, message: 'Vui lòng nhập email học viên' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input disabled={!editing} />
          </Form.Item>
        </Card>
        
        {/* C. Contact Information */}
        <Card style={{ marginBottom: 24 }}>
          <Title level={5} className="card-title">C. Thông tin người liên hệ, nhận báo cáo học tập</Title>
          <Divider />
          
          <Form.Item
            name="hoTenDaiDien"
            label={<span className="required-field">Họ tên người liên hệ</span>}
            rules={[{ required: true, message: 'Vui lòng nhập họ tên người liên hệ' }]}
          >
            <Input disabled={!editing} />
          </Form.Item>
          
          <Form.Item
            name="sdtDaiDien"
            label={<span className="required-field">Số điện thoại người liên hệ</span>}
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại người liên hệ' },
              { pattern: /^0\d{9,10}$/, message: 'Số điện thoại không hợp lệ' }
            ]}
          >
            <Input disabled={!editing} />
          </Form.Item>
          
          <Form.Item
            name="emailDaiDien"
            label={<span className="required-field">Email người liên hệ</span>}
            rules={[
              { required: true, message: 'Vui lòng nhập email người liên hệ' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input disabled={!editing} />
          </Form.Item>
        </Card>
        
        <Text type="danger" style={{ display: 'block', marginBottom: 16 }}>
          (*) là trường thông tin bắt buộc nhập
        </Text>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {!editing ? (
            <Button 
              type="default" 
              icon={<EditOutlined />}
              onClick={handleEdit}
            >
              Sửa thông tin
            </Button>
          ) : (
            <Button 
              type="default" 
              onClick={() => setEditing(false)}
            >
              Hủy
            </Button>
          )}
          
          <Button 
            type="primary" 
            icon={<CheckOutlined />}
            htmlType="submit"
            disabled={!editing}
          >
            Xác nhận thông tin
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default StudentInfoForm;