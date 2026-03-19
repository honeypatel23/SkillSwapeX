import React, { useEffect, useState } from 'react';
import { Table, Button, Badge, Spinner, Alert, Container, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import axiosClient from '../../api/axiosClient';
// We will create this next
import UserForm from './UserForm';
import { toast } from 'react-toastify';
import AppPagination from '../../components/common/AppPagination';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Try standard /users endpoint (mapped to /api/users)
            const response = await axiosClient.get('/users');
            console.log("Fetched Users:", response.data);
            setUsers(response.data);
            setCurrentPage(1); // Reset page on fetch
            setLoading(false);
        } catch (err) {
            console.error("Fetch users error:", err);
            const msg = err.response?.data?.message || err.message || 'Failed to fetch users.';
            setError(`Error: ${msg}`);
            setLoading(false);
        }
    };

    // Helper to safely access fields
    const getField = (obj, key) => {
        if (!obj) return '';
        // Try exact key (assumed to be camelCase)
        if (obj[key] !== undefined) return obj[key];
        // Try PascalCase
        const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
        if (obj[pascalKey] !== undefined) return obj[pascalKey];
        // If the input key was already PascalCase, try camelCase
        const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
        if (obj[camelKey] !== undefined) return obj[camelKey];
        return ''; // Default fallback
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axiosClient.delete(`/users/${id}`);
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (err) {
                console.error("Delete user error:", err);
                let errorMessage = 'Failed to delete user';
                if (err.response?.data) {
                    if (typeof err.response.data === 'string') errorMessage = err.response.data;
                    else if (err.response.data.message) errorMessage = err.response.data.message;
                    else if (err.response.data.title) errorMessage = err.response.data.title;
                } else if (err.message) {
                    errorMessage = err.message;
                }
                toast.error(errorMessage);
            }
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    // Calculate pagination values
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleCreate = () => {
        setSelectedUser(null);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const handleFormSubmit = () => {
        handleModalClose();
        fetchUsers();
    };

    if (loading && users.length === 0) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

    return (
        <Container fluid className="p-0">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>User Management</h2>
                <Button variant="primary" onClick={handleCreate}>
                    <FaPlus className="me-2" /> Add User
                </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    <Table responsive hover className="mb-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4">ID</th>
                                <th>User</th>
                                <th>Role</th>
                                <th>City</th>
                                <th>Credits</th>
                                <th className="text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((user) => {
                                const userId = getField(user, 'userId');
                                const fullName = getField(user, 'fullName');
                                const email = getField(user, 'email');
                                const role = getField(user, 'role');
                                const city = getField(user, 'city');
                                const totalCredits = getField(user, 'totalCredits');

                                return (
                                    <tr key={userId}>
                                        <td className="ps-4">#{userId}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: '40px', height: '40px' }}>
                                                    {fullName?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <div className="fw-bold">{fullName}</div>
                                                    <div className="text-muted small">{email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <Badge bg={role === 'Admin' ? 'danger' : 'info'}>
                                                {role || 'User'}
                                            </Badge>
                                        </td>
                                        <td>{city || '-'}</td>
                                        <td>{totalCredits}</td>
                                        <td className="text-end pe-4">
                                            <Button variant="link" className="text-primary p-0 me-3" onClick={() => handleEdit(user)}>
                                                <FaEdit size={18} />
                                            </Button>
                                            <Button variant="link" className="text-danger p-0" onClick={() => handleDelete(userId)}>
                                                <FaTrash size={18} />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {users.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>

            <AppPagination
                itemsPerPage={itemsPerPage}
                totalItems={users.length}
                paginate={paginate}
                currentPage={currentPage}
            />

            <UserForm
                show={showModal}
                handleClose={handleModalClose}
                user={selectedUser}
                onSuccess={handleFormSubmit}
            />
        </Container>
    );
};

export default UserList;
