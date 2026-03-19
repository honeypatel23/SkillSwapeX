import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { FaUsers, FaLayerGroup, FaTools, FaClipboardList } from 'react-icons/fa';
import axiosClient from '../api/axiosClient';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axiosClient.get('/admin/dashboard/stats');
            setStats(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load dashboard statistics.');
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <Spinner animation="border" variant="primary" />
        </div>
    );

    if (error) return <Alert variant="danger">{error}</Alert>;

    const statCards = [
        {
            title: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: <FaUsers size={30} />,
            color: 'primary',
            bg: 'bg-primary-subtle'
        },
        {
            title: 'Categories',
            value: stats?.totalCategories || 0,
            icon: <FaLayerGroup size={30} />,
            color: 'success',
            bg: 'bg-success-subtle'
        },
        {
            title: 'Services',
            value: stats?.totalServices || 0,
            icon: <FaTools size={30} />,
            color: 'info',
            bg: 'bg-info-subtle'
        },
        {
            title: 'Requests',
            value: stats?.totalServiceRequests || 0,
            icon: <FaClipboardList size={30} />,
            color: 'warning',
            bg: 'bg-warning-subtle'
        },
    ];

    return (
        <div>
            <h2 className="mb-4">Dashboard Overview</h2>

            <Row className="g-4 mb-5">
                {statCards.map((stat, index) => (
                    <Col md={3} sm={6} key={index}>
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Body className="d-flex align-items-center">
                                <div className={`rounded-circle p-3 me-3 ${stat.bg} text-${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <h6 className="text-muted mb-1">{stat.title}</h6>
                                    <h3 className="fw-bold mb-0">{stat.value}</h3>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Access Logs or Recent Activity could go here */}
            <Card className="border-0 shadow-sm">
                <Card.Body>
                    <Card.Title>Quick Actions</Card.Title>
                    <Card.Text className="text-muted">Select a module from the sidebar to manage content.</Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Dashboard;
