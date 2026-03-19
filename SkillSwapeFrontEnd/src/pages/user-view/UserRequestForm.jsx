import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserRequestForm = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // State
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Form Fields
    const [selectedServiceId, setSelectedServiceId] = useState('');
    const [selectedService, setSelectedService] = useState(null);
    const [requestType, setRequestType] = useState('Direct Work'); // 'Direct Work' or 'Learning Session'
    const [numSessions, setNumSessions] = useState(1);
    const [mode, setMode] = useState('Online');
    const [description, setDescription] = useState(''); // Note: Backend might not accept this yet, but good for UI

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/services');
            // Filter only Active services
            const activeServices = response.data.filter(s => s.status === 'Active');
            setServices(activeServices);

            // If URL has serviceId, pre-select it
            const paramId = searchParams.get('serviceId');
            if (paramId) {
                const service = activeServices.find(s => s.serviceId === parseInt(paramId));
                if (service) {
                    setSelectedServiceId(service.serviceId);
                    setSelectedService(service);
                    setMode(service.serviceType || 'Online');
                }
            }
            setLoading(false);
        } catch (err) {
            setError('Failed to load services.');
            setLoading(false);
        }
    };

    const handleServiceChange = (e) => {
        const id = parseInt(e.target.value);
        setSelectedServiceId(id);
        const service = services.find(s => s.serviceId === id);
        setSelectedService(service);
        if (service) {
            setMode(service.serviceType || 'Online');
        }
    };

    const calculateTotalCredits = () => {
        if (!selectedService) return 0;
        if (requestType === 'Learning Session') {
            return selectedService.requiredCredits * numSessions;
        }
        return selectedService.requiredCredits;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedService) {
            toast.error('Please select a service');
            return;
        }

        setSubmitting(true);
        try {
            // Construct Payload
            const payload = {
                serviceId: selectedService.serviceId,
                requestedById: user.userId, // Assuming user object has userId
                requestedToId: selectedService.userId,
                mode: mode,
                totalSessions: requestType === 'Learning Session' ? parseInt(numSessions) : 1, // Default to 1 if not learning
                totalCredits: calculateTotalCredits(),
                status: 'Pending',
                // Adding timestamp locally, though backend usually handles it
                requestedAt: new Date().toISOString()
            };

            await axiosClient.post('/servicerequests', payload);
            toast.success('Service Request sent successfully!');
            navigate('/home'); // Redirect to home or a "My Requests" page if it existed
        } catch (err) {
            console.error("Request Error:", err);
            let msg = 'Failed to send request.';
            if (err.response?.data?.message) msg = err.response.data.message;
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col lg={8}>
                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-5">
                            <div className="text-center mb-5">
                                <h6 className="text-primary text-uppercase fw-bold" style={{ letterSpacing: '3px', color: '#06BBCC' }}>New Request</h6>
                                <h2 className="mb-3">Request a Service</h2>
                                <p className="text-muted">Fill out the form below to request work or learning sessions.</p>
                            </div>

                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Row className="g-3">
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Select Service</Form.Label>
                                            <Form.Select
                                                value={selectedServiceId}
                                                onChange={handleServiceChange}
                                                required
                                            >
                                                <option value="">-- Choose a Service --</option>
                                                {services.map(s => (
                                                    <option key={s.serviceId} value={s.serviceId}>
                                                        {s.title} ({s.requiredCredits} Credits) - {s.serviceType}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    {selectedService && (
                                        <>
                                            <Col md={12}>
                                                <Alert variant="info" className="d-flex align-items-center">
                                                    <div>
                                                        <strong>Service Details:</strong><br />
                                                        Title: {selectedService.title}<br />
                                                        Provider ID: {selectedService.userId}<br />
                                                        Base Credits: {selectedService.requiredCredits}
                                                    </div>
                                                </Alert>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Request Goal</Form.Label>
                                                    <div>
                                                        <Form.Check
                                                            type="radio"
                                                            label="Direct Work"
                                                            name="requestType"
                                                            id="typeWork"
                                                            value="Direct Work"
                                                            checked={requestType === 'Direct Work'}
                                                            onChange={(e) => setRequestType(e.target.value)}
                                                            className="mb-2"
                                                        />
                                                        <Form.Check
                                                            type="radio"
                                                            label="Learning Session"
                                                            name="requestType"
                                                            id="typeLearning"
                                                            value="Learning Session"
                                                            checked={requestType === 'Learning Session'}
                                                            onChange={(e) => setRequestType(e.target.value)}
                                                        />
                                                    </div>
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Mode</Form.Label>
                                                    <Form.Select value={mode} onChange={(e) => setMode(e.target.value)}>
                                                        <option value="Online">Online</option>
                                                        <option value="Offline">Offline</option>
                                                    </Form.Select>
                                                    <Form.Text className="text-muted">
                                                        Service default: {selectedService.serviceType}
                                                    </Form.Text>
                                                </Form.Group>
                                            </Col>

                                            {requestType === 'Learning Session' && (
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Number of Sessions</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            min="1"
                                                            value={numSessions}
                                                            onChange={(e) => setNumSessions(e.target.value)}
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            )}

                                            <Col md={12}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Additional Requirements / Description</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={3}
                                                        placeholder="Describe your specific needs..."
                                                        value={description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                    />
                                                    <Form.Text className="text-muted">
                                                        This will be sent as part of your request.
                                                    </Form.Text>
                                                </Form.Group>
                                            </Col>

                                            <Col md={12}>
                                                <Card className="bg-light border-0 mb-3">
                                                    <Card.Body>
                                                        <h5 className="m-0">Total Cost: <span className="text-primary">{calculateTotalCredits()} Credits</span></h5>
                                                    </Card.Body>
                                                </Card>
                                            </Col>

                                            <Col md={12}>
                                                <Button
                                                    type="submit"
                                                    className="w-100 py-3 rounded-0 text-white fw-bold"
                                                    style={{ background: '#06BBCC', borderColor: '#06BBCC' }}
                                                    disabled={submitting}
                                                >
                                                    {submitting ? 'Sending Request...' : 'Send Request'}
                                                </Button>
                                            </Col>
                                        </>
                                    )}
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UserRequestForm;
