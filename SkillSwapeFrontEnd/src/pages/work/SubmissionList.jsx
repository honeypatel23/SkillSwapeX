import React, { useEffect, useState } from 'react';
import { Table, Button, Badge, Spinner, Alert, Container } from 'react-bootstrap';
import { FaTrash, FaDownload, FaFileAlt } from 'react-icons/fa';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';
import AppPagination from '../../components/common/AppPagination';

const SubmissionList = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/worksubmission');
            setSubmissions(response.data);
            setCurrentPage(1); // Reset page on fetch
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch submissions.');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this submission?')) {
            try {
                await axiosClient.delete(`/worksubmission/${id}`);
                toast.success('Submission deleted successfully');
                fetchSubmissions();
            } catch (err) {
                toast.error('Failed to delete submission');
            }
        }
    };

    // Calculate pagination values
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = submissions.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading && submissions.length === 0) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

    return (
        <Container fluid className="p-0">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Work Submissions</h2>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    <Table responsive hover className="mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4">ID</th>
                                <th>Request ID</th>
                                <th>File / Link</th>
                                <th>Remarks</th>
                                <th>Submitted At</th>
                                <th className="text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((sub) => (
                                <tr key={sub.submissionId}>
                                    <td className="ps-4">#{sub.submissionId}</td>
                                    <td>Request #{sub.requestId}</td>
                                    <td>
                                        {sub.fileUrl ? (
                                            <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">
                                                <FaDownload className="me-2" /> View File
                                            </a>
                                        ) : <span className="text-muted">No File</span>}
                                    </td>
                                    <td>{sub.remarks}</td>
                                    <td>{new Date(sub.submittedAt).toLocaleString()}</td>
                                    <td className="text-end pe-4">
                                        <Button variant="link" className="text-danger p-0" onClick={() => handleDelete(sub.submissionId)}>
                                            <FaTrash size={16} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {submissions.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">No submissions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>

            <AppPagination
                itemsPerPage={itemsPerPage}
                totalItems={submissions.length}
                paginate={paginate}
                currentPage={currentPage}
            />
        </Container>
    );
};

export default SubmissionList;
