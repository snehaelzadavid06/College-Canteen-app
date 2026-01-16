import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import StudentDashboard from './pages/StudentDashboard';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import { CartProvider } from './context/CartContext';
import { CanteenProvider } from './context/CanteenContext';

function App() {
  return (
    <CanteenProvider>
      <CartProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </CartProvider>
    </CanteenProvider>
  );
}

export default App;
