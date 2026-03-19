import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminLayout from './components/layout/AdminLayout';
import UserLayout from './components/layout/UserLayout';
import Login from './pages/auth/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import NotFound from "./pages/NotFound";

// Pages
import Dashboard from './pages/Dashboard';
import UserList from './pages/users/UserList';
import CategoryManager from './pages/categories/CategoryManager';
import ServiceList from './pages/services/ServiceList';
import RequestList from './pages/requests/RequestList';
import SessionList from './pages/sessions/SessionList';
import WorkProgressList from './pages/work/WorkProgressList';
import SubmissionList from './pages/work/SubmissionList';
import Home from './pages/user-view/Home';
import About from './pages/user-view/About';
import UserServiceList from './pages/user-view/UserServiceList';
import UserRequestForm from './pages/user-view/UserRequestForm';
import Contact from './pages/user-view/Contact';
import UserRequests from './pages/user-view/UserRequests';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" />;

  // Normalize roles for comparison
  const userRole = (user.role || '').toLowerCase();
  const allowed = allowedRoles.map(r => r.toLowerCase());

  if (allowedRoles && !allowed.includes(userRole)) {
    // Redirect based on role
    return userRole === 'user' ? <Navigate to="/home" /> : <Navigate to="/admin" />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Public Login Route */}
          <Route path="/" element={<Login />} />

          {/* User Side Routes */}
          <Route path="/" element={<UserLayout />}>
            <Route path="home" element={
              <ProtectedRoute allowedRoles={['User']}>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="about" element={
              <ProtectedRoute allowedRoles={['User']}>
                <About />
              </ProtectedRoute>
            } />
            <Route path="services" element={
              <ProtectedRoute allowedRoles={['User']}>
                <UserServiceList />
              </ProtectedRoute>
            } />
            <Route path="request-service" element={
              <ProtectedRoute allowedRoles={['User']}>
                <UserRequestForm />
              </ProtectedRoute>
            } />
            <Route path="my-requests" element={
              <ProtectedRoute allowedRoles={['User']}>
                <UserRequests />
              </ProtectedRoute>
            } />
            <Route path="contact" element={
              <ProtectedRoute allowedRoles={['User']}>
                <Contact />
              </ProtectedRoute>
            } />
          </Route>

          {/* Admin / Service Provider Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['Admin', 'ServiceProvider']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserList />} />
            <Route path="categories" element={<CategoryManager />} />
            <Route path="services" element={<ServiceList />} />
            <Route path="requests" element={<RequestList />} />
            <Route path="sessions" element={<SessionList />} />
            <Route path="work-progress" element={<WorkProgressList />} />

            <Route path="submissions" element={<SubmissionList />} />
            {/* Catch all invalid routes */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
