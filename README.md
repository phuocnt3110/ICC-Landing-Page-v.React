# ICANCONNECT React

Phiên bản React của trang web đăng ký lịch học ICANCONNECT, sử dụng Ant Design cho UI.

## Giới thiệu

Dự án này là phiên bản chuyển đổi từ trang web HTML/CSS/JavaScript thông thường sang React với Ant Design. Trang web cho phép học viên đăng ký và xác nhận thông tin cá nhân, sau đó chọn lịch học phù hợp.

## Tính năng

1. **Xác nhận thông tin cá nhân**
   - Hiển thị thông tin khóa học và học viên
   - Cho phép chỉnh sửa thông tin
   - Xác thực dữ liệu nhập

2. **Đăng ký lịch học**
   - Hiển thị danh sách lớp học phù hợp
   - Đăng ký lịch học mới nếu không có lớp phù hợp
   - Xử lý đặc biệt cho khóa học SpeakWell

3. **Quản lý trạng thái**
   - Lưu trữ thông tin xuyên suốt quá trình
   - Giao tiếp với API để lưu/lấy dữ liệu

4. **UI/UX**
   - Giao diện thân thiện, phù hợp với thiết bị di động
   - Các thông báo rõ ràng, hướng dẫn người dùng

## Cài đặt

1. Clone repository:
```bash
git clone https://github.com/yourusername/icanconnect-react.git
cd icanconnect-react
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Khởi động server phát triển:
```bash
npm start
```

## Cấu trúc dự án

```
icanconnect-react/
├── public/                # Static files
├── src/
│   ├── api/               # API services
│   ├── components/        # React components
│   ├── context/           # Context API
│   ├── pages/             # Page components
│   ├── utils/             # Utility functions 
│   ├── App.jsx            # Main app component
│   └── index.jsx          # Entry point
└── package.json           # Dependencies and scripts
```

## Công nghệ sử dụng

- **React**: Library UI
- **React Router**: Điều hướng
- **Ant Design**: Thư viện UI components
- **Axios**: HTTP client
- **Context API**: Quản lý state
- **SweetAlert2**: Thông báo đẹp

## API

Dự án sử dụng các API từ nền tảng noco-erp.com để lấy và cập nhật dữ liệu:

- `/tables/m6whmcc44o8tgh8/records`: Thông tin học viên
- `/tables/mhh0jrb11ycvfzg/records`: Thông tin lớp học
- `/tables/matsszn85hw6pha/records`: Thông tin lịch học
- `/tables/m9ruq2cgj9605ix/records`: Thông tin ca học SpeakWell
- `/tables/m9jv8e3mdpvg9vz/records`: Thông tin giáo viên SpeakWell

## Triển khai (Deployment)

1. Build project:
```bash
npm run build
```

2. Triển khai thư mục `build` lên hosting của bạn.

## Tác giả

ICANCONNECT Team