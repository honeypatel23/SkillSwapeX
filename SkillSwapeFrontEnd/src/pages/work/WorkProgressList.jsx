import React, { useEffect, useState } from 'react';
import { Table, Button, Badge, Spinner, Alert, Container, ProgressBar } from 'react-bootstrap';
import { FaTrash, FaCheckCircle } from 'react-icons/fa';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';

const WorkProgressList = () => {
    const [progressData, setProgressData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/workprogress');
            setProgressData(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch work progress.');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this progress entry?')) {
            try {
                await axiosClient.delete(`/workprogress/${id}`);
                toast.success('Progress deleted successfully');
                fetchProgress();
            } catch (err) {
                toast.error('Failed to delete progress');
            }
        }
    };

    if (loading && progressData.length === 0) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

    return (
        <Container fluid className="p-0">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Work Progress</h2>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    <Table responsive hover className="mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4">ID</th>
                                <th>Request ID</th>
                                <th>Description</th>
                                <th>Updated By</th>
                                <th>% Done</th>
                                <th>Last Updated</th>
                                <th className="text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {progressData.map((item) => (
                                <tr key={item.progressId}>
                                    <td className="ps-4">#{item.progressId}</td>
                                    <td>Request #{item.requestId}</td>
                                    <td>{item.description}</td>
                                    <td>User #{item.updatedById}</td>
                                    <td style={{ width: '200px' }}>
                                        <ProgressBar now={item.progressPercent} label={`${item.progressPercent}%`} variant={item.progressPercent === 100 ? 'success' : 'info'} />
                                    </td>
                                    <td>{new Date(item.updatedAt).toLocaleString()}</td>
                                    <td className="text-end pe-4">
                                        <Button variant="link" className="text-danger p-0" onClick={() => handleDelete(item.progressId)}>
                                            <FaTrash size={16} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {progressData.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">No work progress found.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>
        </Container>
    );
};

export default WorkProgressList;
