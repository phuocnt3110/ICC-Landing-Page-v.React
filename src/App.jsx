import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/lib/locale/vi_VN';
import { AppProvider } from './context/AppContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import StepOne from './pages/StepOne';
import StepTwo from './pages/StepTwo';
import NotFound from './pages/NotFound';
import LoadingSpinner from './components/common/LoadingSpinner';
import './App.css';

// Ant Design theme configuration
const theme = {
  token: {
    colorPrimary: '#00509f', // Primary color matching ICANCONNECT blue
    borderRadius: 4,
    fontFamily: "'Montserrat', sans-serif",
  },
};

function App() {
  return (
    <ConfigProvider theme={theme} locale={viVN}>
      <Router>
        <AppProvider>
          <div className="app-container">
            <Header />
            <LoadingSpinner />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/step-one" element={<StepOne />} />
              <Route path="/step-two" element={<StepTwo />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </AppProvider>
      </Router>
    </ConfigProvider>
  );
}

export default App;