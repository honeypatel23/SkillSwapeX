import React, { useEffect, useState } from 'react';
import { Table, Button, Badge, Spinner, Alert, Container, Modal, Form } from 'react-bootstrap';
import { FaTrash, FaVideo, FaEdit, FaPlus } from 'react-icons/fa';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';
import AppPagination from '../../components/common/AppPagination';

const SessionList = () => {
    const [sessions, setSessions] = useState([]);
    const [requests, setRequests] = useState([]); // For Dropdown
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal States
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Form Data
    const [formData, setFormData] = useState({
        sessionId: 0,
        requestId: '',
        sessionType: 'Online',
        meetingLink: '',
        sessionDate: '',
        status: 'Scheduled',
        meetingPlatform: 'Google Meet'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [sessionRes, requestRes] = await Promise.all([
                axiosClient.get('/learningsession'),
                axiosClient.get('/servicerequests')
            ]);
            setSessions(sessionRes.data);
            setRequests(requestRes.data.filter(r => r.status === 'Accepted' || r.status === 'In Progress')); // Only allow sessions for accepted requests
            setCurrentPage(1); // Reset page on fetch
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch data.');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this session?')) {
            try {
                await axiosClient.delete(`/learningsession/${id}`);
                toast.success('Session deleted successfully');
                fetchData();
            } catch (err) {
                toast.error('Failed to delete session');
            }
        }
    };

    const openCreateModal = () => {
        setModalMode('create');
        setFormData({
            sessionId: 0,
            requestId: '',
            sessionType: 'Online', // Default
            meetingLink: '',
            sessionDate: new Date().toISOString().slice(0, 16), // Format for datetime-local
            status: 'Scheduled',
            meetingPlatform: 'Google Meet'
        });
        setShowModal(true);
    };

    const openEditModal = (session) => {
        setModalMode('edit');
        setFormData({
            sessionId: session.sessionId,
            requestId: session.requestId,
            sessionType: session.sessionType || 'Online',
            meetingLink: session.meetingLink || '',
            sessionDate: session.sessionDate ? new Date(session.sessionDate).toISOString().slice(0, 16) : '',
            status: session.status || 'Scheduled',
            meetingPlatform: session.meetingPlatform || 'Google Meet'
        });
        setShowModal(true);
    };

    const handleModalClose = () => setShowModal(false);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalMode === 'create') {
                const payload = {
                    ...formData,
                    requestId: parseInt(formData.requestId)
                };
                await axiosClient.post('/learningsession', payload);
                toast.success('Session created successfully');
            } else {
                const payload = {
                    ...formData,
                    requestId: parseInt(formData.requestId)
                };
                await axiosClient.put(`/learningsession/${formData.sessionId}`, payload);
                toast.success('Session updated successfully. (Credits applied if Completed)');
            }
            handleModalClose();
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || err.response?.data || 'Failed to save session');
        }
    };

    const selectedReq = requests.find(r => r.requestId === parseInt(formData.requestId));
    const currentSessionsCount = formData.requestId ? sessions.filter(s => s.requestId === parseInt(formData.requestId)).length : 0;

    // For creation mode, check if adding a new session would exceed the limit
    const isLimitReached = modalMode === 'create' && selectedReq && currentSessionsCount >= selectedReq.totalSessions;

    const creditsPerSession = selectedReq ? Math.floor(selectedReq.totalCredits / selectedReq.totalSessions) : 0;

    // Calculate pagination values
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sessions.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading && sessions.length === 0) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

    return (
        <Container fluid className="p-0">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Learning Sessions</h2>
                <Button variant="primary" onClick={openCreateModal}>
                    <FaPlus className="me-2" /> Add Session
                </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    <Table responsive hover className="mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4">ID</th>
                                <th>Request ID</th>
                                <th>Type</th>
                                <th>Platform</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Link</th>
                                <th className="text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((session) => (
                                <tr key={session.sessionId}>
                                    <td className="ps-4">#{session.sessionId}</td>
                                    <td>Request #{session.requestId}</td>
                                    <td>{session.sessionType}</td>
                                    <td>{session.meetingPlatform}</td>
                                    <td>{new Date(session.sessionDate).toLocaleString()}</td>
                                    <td>
                                        <Badge bg={session.status === 'Completed' ? 'success' : 'info'}>
                                            {session.status}
                                        </Badge>
                                    </td>
                                    <td>
                                        {session.meetingLink && (
                                            <a href={session.meetingLink} target="_blank" rel="noreferrer" className="text-decoration-none">
                                                <FaVideo className="me-1" /> Join
                                            </a>
                                        )}
                                    </td>
                                    <td className="text-end pe-4">
                                        <Button variant="link" className="text-primary p-0 me-3" onClick={() => openEditModal(session)}>
                                            <FaEdit size={16} />
                                        </Button>
                                        <Button variant="link" className="text-danger p-0" onClick={() => handleDelete(session.sessionId)}>
                                            <FaTrash size={16} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {sessions.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="8" className="text-center py-4">No learning sessions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>

            <AppPagination
                itemsPerPage={itemsPerPage}
                totalItems={sessions.length}
                paginate={paginate}
                currentPage={currentPage}
            />

            {/* Create/Edit Modal */}
            <Modal show={showModal} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{modalMode === 'create' ? 'Create Learning Session' : 'Edit Learning Session'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Service Request ID</Form.Label>
                            <Form.Select
                                name="requestId"
                                value={formData.requestId}
                                onChange={handleFormChange}
                                required
                                disabled={modalMode === 'edit'} // Usually don't change request after creation
                            >
                                <option value="">-- Select an Accepted Request --</option>
                                {requests.map(r => (
                                    <option key={r.requestId} value={r.requestId}>
                                        Req #{r.requestId} (Service #{r.serviceId})
                                    </option>
                                ))}
                                {modalMode === 'edit' && !requests.find(r => r.requestId == formData.requestId) && (
                                    <option value={formData.requestId}>Req #{formData.requestId}</option>
                                )}
                            </Form.Select>
                            {selectedReq && (
                                <Form.Text className={isLimitReached ? "text-danger fw-bold" : "text-muted"}>
                                    Sessions created: {currentSessionsCount} / {selectedReq.totalSessions}
                                    {isLimitReached && " (Limit Reached)"}
                                </Form.Text>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                name="status"
                                value={formData.status}
                                onChange={handleFormChange}
                            >
                                <option value="Scheduled">Scheduled</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Cancelled">Cancelled</option>
                            </Form.Select>
                            {formData.status === 'Completed' && modalMode === 'edit' && selectedReq && (
                                <Form.Text className="text-success fw-bold">
                                    Marking as completed will transfer {creditsPerSession} Credits to your account.
                                </Form.Text>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Session Date & Time</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="sessionDate"
                                value={formData.sessionDate}
                                onChange={handleFormChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Meeting Platform</Form.Label>
                            <Form.Select
                                name="meetingPlatform"
                                value={formData.meetingPlatform}
                                onChange={handleFormChange}
                            >
                                <option value="Google Meet">Google Meet</option>
                                <option value="Zoom">Zoom</option>
                                <option value="Teams">Microsoft Teams</option>
                                <option value="Offline">Offline</option>
                            </Form.Select>
                        </Form.Group>

                        {formData.meetingPlatform !== 'Offline' && (
                            <Form.Group className="mb-3">
                                <Form.Label>Meeting Link (e.g., Google Meet URL)</Form.Label>
                                <Form.Control
                                    type="url"
                                    name="meetingLink"
                                    value={formData.meetingLink}
                                    onChange={handleFormChange}
                                    placeholder="https://meet.google.com/..."
                                />
                            </Form.Group>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
                        <Button variant="primary" type="submit" disabled={isLimitReached && modalMode === 'create'}>
                            {modalMode === 'create' ? 'Create Session' : 'Save Changes'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default SessionList;
