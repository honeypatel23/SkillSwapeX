import React, { useEffect, useState } from 'react';
import { Table, Button, Badge, Spinner, Alert, Container, Row, Col, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaFilter } from 'react-icons/fa';
import axiosClient from '../../api/axiosClient';
import ServiceForm from './ServiceForm';
import { toast } from 'react-toastify';
import AppPagination from '../../components/common/AppPagination';

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/services');
            console.log("Fetched Services:", response.data);
            setServices(response.data);
            setCurrentPage(1); // Reset page on fetch
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch services.');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                await axiosClient.delete(`/services/${id}`);
                toast.success('Service deleted successfully');
                fetchServices();
            } catch (err) {
                console.error("Delete service error:", err);
                let errorMessage = 'Failed to delete service';
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

    const handleEdit = (service) => {
        setSelectedService(service);
        setShowModal(true);
    };

    // Calculate pagination values
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = services.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleCreate = () => {
        setSelectedService(null);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedService(null);
    };

    const handleFormSuccess = () => {
        handleModalClose();
        fetchServices();
    };

    // Helper to safely access fields
    const getField = (obj, key) => {
        if (!obj) return '';
        if (obj[key] !== undefined) return obj[key];
        const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
        if (obj[pascalKey] !== undefined) return obj[pascalKey];
        const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
        if (obj[camelKey] !== undefined) return obj[camelKey];
        return '';
    };

    if (loading && services.length === 0) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

    return (
        <Container fluid className="p-0">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Service Management</h2>
                <Button variant="primary" onClick={handleCreate}>
                    <FaPlus className="me-2" /> Add Service
                </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    <Table responsive hover className="mb-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4">ID</th>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Category</th>
                                <th>Credits</th>
                                <th>City</th>
                                <th>Status</th>
                                <th className="text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((service) => {
                                const serviceId = getField(service, 'serviceId');
                                const title = getField(service, 'title');
                                const serviceType = getField(service, 'serviceType');
                                const categoryId = getField(service, 'categoryId');
                                const requiredCredits = getField(service, 'requiredCredits');
                                const city = getField(service, 'city');
                                const status = getField(service, 'status');

                                return (
                                    <tr key={serviceId}>
                                        <td className="ps-4">#{serviceId}</td>
                                        <td className="fw-bold">{title}</td>
                                        <td>{serviceType}</td>
                                        <td>{categoryId}</td>
                                        <td>{requiredCredits}</td>
                                        <td>{city}</td>
                                        <td>
                                            <Badge bg={status === 'Active' ? 'success' : 'secondary'}>
                                                {status}
                                            </Badge>
                                        </td>
                                        <td className="text-end pe-4">
                                            <Button variant="link" className="text-primary p-0 me-3" onClick={() => handleEdit(service)}>
                                                <FaEdit size={18} />
                                            </Button>
                                            <Button variant="link" className="text-danger p-0" onClick={() => handleDelete(serviceId)}>
                                                <FaTrash size={18} />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {services.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="8" className="text-center py-4">No services found.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>

            <AppPagination
                itemsPerPage={itemsPerPage}
                totalItems={services.length}
                paginate={paginate}
                currentPage={currentPage}
            />

            <ServiceForm
                show={showModal}
                handleClose={handleModalClose}
                service={selectedService}
                onSuccess={handleFormSuccess}
            />
        </Container>
    );
};

export default ServiceList;
