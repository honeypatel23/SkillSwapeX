import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';

const UserForm = ({ show, handleClose, user, onSuccess }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        city: '',
        role: 'User',
        bio: '',
        profileImage: '',
        totalCredits: 0
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                password: '', // Don't fill password on edit
                city: user.city || '',
                role: user.role || 'User',
                bio: user.bio || '',
                profileImage: user.profileImage || '',
                totalCredits: user.totalCredits || 0
            });
        } else {
            setFormData({
                fullName: '',
                email: '',
                password: '',
                city: '',
                role: 'User',
                bio: '',
                profileImage: '',
                totalCredits: 0
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Prepare payload
            const payload = { ...formData };
            if (user) {
                // Remove password if empty on update
                if (!payload.password) {
                    delete payload.password;
                }
                // Ensure userId is present (for some APIs)
                payload.userId = user.userId;

                // Update
                await axiosClient.put(`/users/${user.userId}`, payload);
                toast.success('User updated successfully');
            } else {
                // Create
                await axiosClient.post('/users', payload);
                toast.success('User created successfully');
            }
            onSuccess();
        } catch (err) {
            console.error("Form submit error:", err);
            let errorMessage = 'Operation failed';
            if (err.response?.data) {
                if (typeof err.response.data === 'string') errorMessage = err.response.data;
                else if (err.response.data.message) errorMessage = err.response.data.message;
                else if (err.response.data.title) errorMessage = err.response.data.title;
            } else if (err.message) {
                errorMessage = err.message;
            }
            toast.error(errorMessage);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{user ? 'Edit User' : 'Create User'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>{user ? 'Password (Leave blank to keep current)' : 'Password'}</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required={!user}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Role</Form.Label>
                        <Form.Select name="role" value={formData.role} onChange={handleChange}>
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Bio</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                        />
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                        {user ? 'Update User' : 'Create User'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default UserForm;
