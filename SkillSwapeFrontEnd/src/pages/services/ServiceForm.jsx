import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';

const ServiceForm = ({ show, handleClose, service, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        serviceType: 'Online',
        requiredCredits: 0,
        city: '',
        workDetails: '',
        status: 'Active',
        categoryId: '', // Should be a number
        userId: ''     // Should be a number
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Ideally fetch categories here to populate the dropdown
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axiosClient.get('/categories');
            setCategories(res.data);
        } catch (err) {
            console.error("Failed to load categories for select", err);
        }
    };

    useEffect(() => {
        if (service) {
            setFormData({
                title: service.title || '',
                description: service.description || '',
                serviceType: service.serviceType || 'Online',
                requiredCredits: service.requiredCredits || 0,
                city: service.city || '',
                workDetails: service.workDetails || '',
                status: service.status || 'Active',
                categoryId: service.categoryId || '',
                userId: service.userId || ''
            });
        } else {
            setFormData({
                title: '',
                description: '',
                serviceType: 'Online',
                requiredCredits: 0,
                city: '',
                workDetails: '',
                status: 'Active',
                categoryId: '',
                userId: '' // Note: In a real app we might pick the current logged in user or have a user search
            });
        }
    }, [service]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Prepare payload (convert numbers)
        const payload = {
            ...formData,
            categoryId: parseInt(formData.categoryId) || 0,
            userId: parseInt(formData.userId) || 0,
            requiredCredits: parseInt(formData.requiredCredits) || 0
        };

        try {
            if (service) {
                // Some APIs require the ID in the body as well
                payload.serviceId = service.serviceId;
                await axiosClient.put(`/services/${service.serviceId}`, payload);
                toast.success('Service updated successfully');
            } else {
                await axiosClient.post('/services', payload);
                toast.success('Service created successfully');
            }
            onSuccess();
        } catch (err) {
            console.error("Service save error:", err);
            let errorMessage = 'Operation failed. Check if User ID and Category ID are valid.';
            if (err.response?.data) {
                if (typeof err.response.data === 'string') errorMessage = err.response.data;
                else if (err.response.data.message) errorMessage = err.response.data.message;
                else if (err.response.data.title) errorMessage = err.response.data.title;
            } else if (err.message) {
                errorMessage = err.message;
            }
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{service ? 'Edit Service' : 'Create Service'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Service Title</Form.Label>
                                <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
                                    <option value="">Select Category</option>
                                    {categories.map(c => (
                                        <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Owner User ID</Form.Label>
                                <Form.Control type="number" name="userId" value={formData.userId} onChange={handleChange} required placeholder="Enter User ID" />
                                <Form.Text className="text-muted">Enter valid numeric User ID</Form.Text>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Service Type</Form.Label>
                                <Form.Select name="serviceType" value={formData.serviceType} onChange={handleChange}>
                                    <option value="Online">Online</option>
                                    <option value="Offline">Offline</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Required Credits</Form.Label>
                                <Form.Control type="number" name="requiredCredits" value={formData.requiredCredits} onChange={handleChange} required />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>City</Form.Label>
                                <Form.Control type="text" name="city" value={formData.city} onChange={handleChange} />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Status</Form.Label>
                                <Form.Select name="status" value={formData.status} onChange={handleChange}>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Work Details / Instructions</Form.Label>
                                <Form.Control as="textarea" rows={2} name="workDetails" value={formData.workDetails} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Saving...' : (service ? 'Update Service' : 'Create Service')}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ServiceForm;
