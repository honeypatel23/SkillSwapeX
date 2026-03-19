import React, { useEffect, useState } from 'react';
import { Table, Button, Badge, Spinner, Alert, Container, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';
import AppPagination from '../../components/common/AppPagination';

const RequestList = () => {
    const [requests, setRequests] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [status, setStatus] = useState('');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Session Creation State within Modal
    const [sessionDate, setSessionDate] = useState('');
    const [meetingLink, setMeetingLink] = useState('');
    const [meetingPlatform, setMeetingPlatform] = useState('Google Meet');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const [reqRes, sessRes] = await Promise.all([
                axiosClient.get('/servicerequests'),
                axiosClient.get('/learningsession')
            ]);
            setRequests(reqRes.data);
            setSessions(sessRes.data);
            setCurrentPage(1); // Reset page on fetch
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch data.');
            setLoading(false);
        }
    };

    const getSessionProgress = (requestId, totalSessions) => {
        if (!totalSessions || totalSessions <= 1) return '-';
        const reqSessions = sessions.filter(s => s.requestId === requestId);
        const completed = reqSessions.filter(s => s.status === 'Completed').length;
        return `${completed} / ${totalSessions}`;
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            try {
                await axiosClient.delete(`/servicerequests/${id}`);
                toast.success('Request deleted successfully');
                fetchRequests();
            } catch (err) {
                toast.error('Failed to delete request');
            }
        }
    };

    const handleEdit = (req) => {
        setSelectedRequest(req);
        setStatus(req.status);

        // Reset session fields
        setSessionDate(new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)); // Default to tomorrow
        setMeetingLink('');
        setMeetingPlatform(req.mode === 'Offline' ? 'Offline' : 'Google Meet');

        setShowModal(true);
    };

    // Calculate pagination values
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = requests.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedRequest(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // According to backend logic, we mainly update status and completedAt
            const payload = {
                requestId: selectedRequest.requestId,
                status: status,
                completedAt: status === 'Completed' ? new Date().toISOString() : null,
                // We might need to send other fields back if validation requires them, 
                // but typical update DTOs might be partial. 
                // Let's send what the validtor likely needs or check if we need to fetch full object first.
                // For now, let's assume partial update or we just send these.
                // Waiting to see if validation fails on missing fields.
                // To be safe, let's include basic fields from the selected object.
                serviceId: selectedRequest.serviceId,
                requestedById: selectedRequest.requestedById,
                requestedToId: selectedRequest.requestedToId,
                mode: selectedRequest.mode,
                totalSessions: selectedRequest.totalSessions,
                totalCredits: selectedRequest.totalCredits
            };

            await axiosClient.put(`/servicerequests/${selectedRequest.requestId}`, payload);
            toast.success('Request updated successfully');

            // If they are accepting, and it requires a session scheduling, let's create the first session.
            // We only do this if they are moving to 'Accepted' and they provided a session Date.
            // If totalSessions is basically a learning session.
            if (status === 'Accepted' && selectedRequest.totalSessions > 0) {
                // Check if any sessions exist already (prevent duplicate creation on repeated status resaves if they do that)
                const existingSessions = sessions.filter(s => s.requestId === selectedRequest.requestId);
                if (existingSessions.length === 0) {
                    try {
                        const sessionPayload = {
                            requestId: selectedRequest.requestId,
                            sessionType: selectedRequest.mode,
                            meetingLink: meetingLink,
                            sessionDate: sessionDate, // Use the provided date from state
                            status: 'Scheduled',
                            meetingPlatform: meetingPlatform
                        };
                        console.log("Creating first session automatically:", sessionPayload);
                        await axiosClient.post('/learningsession', sessionPayload);
                        toast.success('First Session scheduled successfully!');
                    } catch (sessionErr) {
                        console.error("Failed to auto-create session", sessionErr);
                        toast.error('Request accepted, but failed to auto-schedule the first session.');
                    }
                }
            }

            handleModalClose();
            fetchRequests();
        } catch (err) {
            console.error(err);
            toast.error('Operation failed');
        }
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

    if (loading && requests.length === 0) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

    return (
        <Container fluid className="p-0">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Service Requests</h2>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    <Table responsive hover className="mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4">ID</th>
                                <th>Service ID</th>
                                <th>Requester</th>
                                <th>Mode</th>
                                <th>Credits</th>
                                <th>Progress</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th className="text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((req) => (
                                <tr key={req.requestId}>
                                    <td className="ps-4">#{req.requestId}</td>
                                    <td>Service #{req.serviceId}</td>
                                    <td>User #{req.requestedById}</td>
                                    <td>{req.mode}</td>
                                    <td>{req.totalCredits}</td>
                                    <td>{getSessionProgress(req.requestId, req.totalSessions)}</td>
                                    <td>
                                        <Badge bg={getStatusBadge(req.status)}>
                                            {req.status}
                                        </Badge>
                                    </td>
                                    <td>{new Date(req.requestedAt).toLocaleDateString()}</td>
                                    <td className="text-end pe-4">
                                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(req)}>
                                            Update Status
                                        </Button>
                                        <Button variant="link" className="text-danger p-0" onClick={() => handleDelete(req.requestId)}>
                                            <FaTrash size={16} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {requests.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="8" className="text-center py-4">No service requests found.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>

            <AppPagination
                itemsPerPage={itemsPerPage}
                totalItems={requests.length}
                paginate={paginate}
                currentPage={currentPage}
            />

            <Modal show={showModal} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Update Request Status</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <p>Updating Request <strong>#{selectedRequest?.requestId}</strong></p>
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="Pending">Pending</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </Form.Select>
                        </Form.Group>

                        {/* Extra Session Fields when Accepting */}
                        {status === 'Accepted' && selectedRequest?.totalSessions > 0 && selectedRequest?.status === 'Pending' && (
                            <div className="border border-primary rounded p-3 bg-light mt-3">
                                <h6><i className="fa fa-calendar-check text-primary me-2"></i>Schedule First Session</h6>
                                <Form.Text className="text-muted d-block mb-3">
                                    Since you are accepting this request, please provide details for the first session.
                                </Form.Text>

                                <Form.Group className="mb-3">
                                    <Form.Label>Date & Time</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        value={sessionDate}
                                        onChange={(e) => setSessionDate(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                {selectedRequest.mode === 'Online' && (
                                    <>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Platform</Form.Label>
                                            <Form.Select value={meetingPlatform} onChange={(e) => setMeetingPlatform(e.target.value)}>
                                                <option value="Google Meet">Google Meet</option>
                                                <option value="Zoom">Zoom</option>
                                                <option value="Teams">Microsoft Teams</option>
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Meeting Link</Form.Label>
                                            <Form.Control
                                                type="url"
                                                placeholder="https://meet.google.com/..."
                                                value={meetingLink}
                                                onChange={(e) => setMeetingLink(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </>
                                )}
                            </div>
                        )}

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

        </Container>
    );
};

export default RequestList;
