import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaLayerGroup } from 'react-icons/fa';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';
import AppPagination from '../../components/common/AppPagination';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryName, setCategoryName] = useState('');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/categories');
            console.log("Fetched Categories:", response.data);
            setCategories(response.data);
            setCurrentPage(1); // Reset page on fetch
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch categories.');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await axiosClient.delete(`/categories/${id}`);
                toast.success('Category deleted successfully');
                fetchCategories();
            } catch (err) {
                console.error("Delete category error:", err);
                let errorMessage = 'Failed to delete category';
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

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setCategoryName(category.categoryName);
        setShowModal(true);
    };

    // Calculate pagination values
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleCreate = () => {
        setSelectedCategory(null);
        setCategoryName('');
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedCategory(null);
        setCategoryName('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedCategory) {
                // Update
                await axiosClient.put(`/categories/${selectedCategory.categoryId}`, {
                    categoryId: selectedCategory.categoryId,
                    categoryName
                });
                toast.success('Category updated successfully');
            } else {
                // Create
                await axiosClient.post('/categories', { categoryName });
                toast.success('Category created successfully');
            }
            handleModalClose();
            fetchCategories();
        } catch (err) {
            console.error("Category save error:", err);
            const errorMessage = err.response?.data?.message || err.response?.data?.title || 'Operation failed';
            toast.error(errorMessage);
        }
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

    if (loading && categories.length === 0) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

    return (
        <Container fluid className="p-0">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Category Management</h2>
                <Button variant="primary" onClick={handleCreate}>
                    <FaPlus className="me-2" /> Add Category
                </Button>
            </div>

            {error ? <Alert variant="danger">{error}</Alert> : null}

            <div className="card shadow-sm border-0 col-lg-8">
                <div className="card-body p-0">
                    <Table responsive hover className="mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4" style={{ width: '100px' }}>ID</th>
                                <th>Category Name</th>
                                <th className="text-end pe-4" style={{ width: '150px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((cat) => {
                                const categoryId = getField(cat, 'categoryId');
                                const categoryName = getField(cat, 'categoryName');
                                return (
                                    <tr key={categoryId}>
                                        <td className="ps-4">#{categoryId}</td>
                                        <td className="fw-bold">
                                            <FaLayerGroup className="text-muted me-2" />
                                            {categoryName}
                                        </td>
                                        <td className="text-end pe-4">
                                            <Button variant="link" className="text-primary p-0 me-3" onClick={() => handleEdit(cat)}>
                                                <FaEdit size={18} />
                                            </Button>
                                            <Button variant="link" className="text-danger p-0" onClick={() => handleDelete(categoryId)}>
                                                <FaTrash size={18} />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {categories.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="3" className="text-center py-4">No categories found.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>

            <AppPagination
                itemsPerPage={itemsPerPage}
                totalItems={categories.length}
                paginate={paginate}
                currentPage={currentPage}
            />

            <Modal show={showModal} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedCategory ? 'Edit Category' : 'Create Category'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Category Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                required
                                autoFocus
                                placeholder="e.g. Programming, Design"
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            {selectedCategory ? 'Save Changes' : 'Create Category'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

        </Container>
    );
};

export default CategoryManager;
