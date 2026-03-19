import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Real API call to login
            const response = await axiosClient.post('/auth/login', {
                email,
                password
            });

            console.log("FULL LOGIN RESPONSE:", response);
            console.log("Response Data:", response.data);

            let userData = response.data;
            // Normalize response data structure
            if (response.data.user) {
                console.log("Found nested 'user' object");
                userData = { ...response.data.user };
                if (response.data.token) userData.token = response.data.token;
                if (response.data.accessToken) userData.token = response.data.accessToken;
            }

            // Ensure token exists for axiosClient
            if (!userData.token && response.data.token) userData.token = response.data.token;
            if (!userData.token && response.data.accessToken) userData.token = response.data.accessToken;

            // Fallback: Decode token if role is missing
            if (!userData.role && userData.token) {
                try {
                    console.log("Role missing in body, attempting to decode token...");
                    const base64Url = userData.token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));

                    const decoded = JSON.parse(jsonPayload);
                    console.log("Decoded Token Payload:", decoded);

                    // Look for common role keys
                    userData.role = decoded.role || decoded.Role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'User';
                } catch (e) {
                    console.error("Failed to decode token:", e);
                }
            }

            console.log("Processed UserData:", userData);

            login(userData);

            const role = (userData.role || '').toLowerCase();
            console.log("Detected Role:", role);

            // DEBUG ALERT
            alert(`Login Successful!\nRole: ${role}\nClick OK to proceed.`);

            // Role-based redirection
            if (role === 'admin' || role === 'serviceprovider') {
                console.log("Redirecting to /admin");
                navigate('/admin');
            } else if (role === 'user') {
                console.log("Redirecting to /home");
                navigate('/home');
            } else {
                console.warn("Unknown role, defaulting to /home");
                alert(`Unknown role: ${role}. Redirecting to /home`);
                navigate('/home');
            }

        } catch (err) {
            console.error("Login error object:", err);
            let msg = 'Failed to login.';

            // Robust Error Extraction
            if (err.response) {
                // Server responded
                msg += ` Server Error: ${err.response.status}`;

                // Append detailed data if available
                if (err.response.data) {
                    try {
                        const rawError = JSON.stringify(err.response.data, null, 2);
                        msg += `\nDetails: ${rawError}`;
                    } catch (e) {
                        msg += `\nRaw Data: ${err.response.data}`;
                    }
                }
            } else if (err.request) {
                // Network Error
                msg += ' Network Error: Server not reachable. Check if backend is running.';
            } else {
                // Config/Setup Error
                msg += ` Request Error: ${err.message || 'Unknown'}`;
            }

            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                {/* Left Side Branding */}
                <div className="login-brand-side">
                    <div className="brand-content">
                        <div className="brand-logo-text">SkillSwape</div>
                        <p className="brand-tagline">
                            Connect, collaborate, and swap skills with professionals worldwide.
                        </p>
                    </div>
                </div>

                {/* Right Side Form */}
                <div className="login-form-side">
                    <div className="login-header">
                        <h2 className="login-title">Welcome Back</h2>
                        <p className="login-subtitle">Please sign in to continue to your dashboard.</p>
                    </div>

                    {error && (
                        <div className="alert-message alert-danger">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="custom-form-group">
                            <label className="custom-label">Email Address</label>
                            <input
                                type="email"
                                className="custom-input"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="custom-form-group">
                            <label className="custom-label">Password</label>
                            <input
                                type="password"
                                className="custom-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="login-btn"
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="form-footer">
                        <p>
                            Don't have an account? <a href="#" className="footer-link">Sign up</a>
                            <br />
                            <small className="text-muted mt-2 d-block">Admin Demo: admin@test.com</small>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
