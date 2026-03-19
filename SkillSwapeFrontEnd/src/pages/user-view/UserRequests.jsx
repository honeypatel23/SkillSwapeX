import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Table, Button } from 'react-bootstrap';
import { FaVideo, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';

const UserRequests = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [reqRes, sessionRes, servicesRes] = await Promise.all([
                axiosClient.get('/servicerequests'),
                axiosClient.get('/learningsession'),
                axiosClient.get('/services')
            ]);

            // Filter requests that belong to this user
            const myRequests = reqRes.data.filter(r => r.requestedById === user?.userId);
            setRequests(myRequests);
            setSessions(sessionRes.data);
            setServices(servicesRes.data);

            setLoading(false);
        } catch (err) {
            console.error("Error fetching requests:", err);
            setError("Failed to load your requests.");
            setLoading(false);
        }
    };

    const getServiceName = (serviceId) => {
        const s = services.find(serv => serv.serviceId === serviceId);
        return s ? s.title : `Service #${serviceId}`;
    };

    const handleCancelRequest = async (request) => {
        if (window.confirm('Are you sure you want to cancel this pending request?')) {
            try {
                const payload = {
                    ...request,
                    status: 'Cancelled',
                    requestedAt: request.requestedAt // Preserve existing values
                };
                await axiosClient.put(`/servicerequests/${request.requestId}`, payload);
                // Refresh data to show it as cancelled
                fetchData();
            } catch (err) {
                console.error("Failed to cancel request:", err);
                alert("Failed to cancel the request. Please try again.");
            }
        }
    };

    const getSessionProgress = (requestId, totalSessions) => {
        const reqSessions = sessions.filter(s => s.requestId === requestId);
        const completed = reqSessions.filter(s => s.status === 'Completed').length;
        return { completed, total: totalSessions, details: reqSessions };
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending': return 'warning';
            case 'Accepted': return 'primary';
            case 'Rejected': return 'danger';
            case 'Completed': return 'success';
            default: return 'secondary';
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <Spinner animation="border" variant="primary" />
        </div>
    );

    return (
        <Container className="py-5">
            <div className="text-center mb-5">
                <h6 className="section-title bg-white text-center text-primary px-3 fw-bold" style={{ color: '#06BBCC !important' }}>My Dashboard</h6>
                <h1 className="mb-5">My Service Requests</h1>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {requests.length === 0 ? (
                <div className="text-center py-5">
                    <h4 className="text-muted">You haven't made any requests yet.</h4>
                </div>
            ) : (
                <Row className="g-4">
                    {requests.map(req => {
                        const progress = getSessionProgress(req.requestId, req.totalSessions);
                        const upcomingSession = progress.details.find(s => s.status === 'Scheduled');

                        return (
                            <Col lg={12} key={req.requestId}>
                                <Card className="border-0 shadow-sm mb-4">
                                    <Card.Header className="bg-light d-flex justify-content-between align-items-center py-3">
                                        <h5 className="m-0 text-primary">Req #{req.requestId} - {getServiceName(req.serviceId)}</h5>
                                        <Badge bg={getStatusBadge(req.status)} className="px-3 py-2">
                                            {req.status}
                                        </Badge>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md={6}>
                                                <p><strong>Mode:</strong> {req.mode}</p>
                                                <p><strong>Type:</strong> {req.totalSessions > 1 ? 'Learning Session' : 'Direct Work'}</p>
                                                <p><strong>Total Credits:</strong> {req.totalCredits}</p>
                                                <p><strong>Requested At:</strong> {new Date(req.requestedAt).toLocaleDateString()}</p>
                                            </Col>
                                            <Col md={6}>
                                                {req.status === 'Accepted' || req.status === 'In Progress' ? (
                                                    <div className="bg-light p-3 rounded h-100">
                                                        <h6 className="text-primary mb-3">Session Progress</h6>
                                                        <div className="d-flex justify-content-between mb-2">
                                                            <span>Completed Sessions:</span>
                                                            <strong>{progress.completed} / {progress.total}</strong>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-3 text-muted small">
                                                            <span>Credits per Session:</span>
                                                            <span>{(req.totalCredits / req.totalSessions).toFixed(0)} Credits</span>
                                                        </div>

                                                        {upcomingSession ? (
                                                            <div className="mt-3 border-top pt-3">
                                                                <p className="mb-1 text-success fw-bold">
                                                                    <FaCheckCircle className="me-2" />
                                                                    Upcoming Session
                                                                </p>
                                                                <p className="mb-1 small">
                                                                    <strong>Date:</strong> {new Date(upcomingSession.sessionDate).toLocaleString()}
                                                                </p>
                                                                {upcomingSession.meetingPlatform !== 'Offline' && upcomingSession.meetingLink && (
                                                                    <a
                                                                        href={upcomingSession.meetingLink}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="btn btn-sm btn-outline-primary mt-2"
                                                                    >
                                                                        <FaVideo className="me-2" /> Join {upcomingSession.meetingPlatform}
                                                                    </a>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="mt-3 border-top pt-3">
                                                                <p className="mb-0 text-muted small">
                                                                    <FaSpinner className="me-2" /> Waiting for provider to schedule next session.
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="d-flex h-100 align-items-center justify-content-center flex-column text-muted border rounded p-4">
                                                        <p className="m-0 text-center mb-3">
                                                            {req.status === 'Pending' ? 'Waiting for provider to accept your request.' :
                                                                req.status === 'Completed' ? 'This request has been fully completed.' :
                                                                    `Request is ${req.status}.`}
                                                        </p>
                                                        {req.status === 'Pending' && (
                                                            <Button
                                                                variant="outline-danger"
                                                                size="sm"
                                                                onClick={() => handleCancelRequest(req)}
                                                            >
                                                                Cancel Request
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </Container>
    );
};

export default UserRequests;
