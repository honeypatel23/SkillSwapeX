import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Form, InputGroup } from 'react-bootstrap';
import axiosClient from '../../api/axiosClient';
import { useSearchParams, Link } from 'react-router-dom';

const UserServiceList = () => {
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchParams] = useSearchParams();

    useEffect(() => {
        fetchData();
    }, []);

    // Filter effect
    useEffect(() => {
        let result = services;

        // Filter by Category
        if (selectedCategory !== 'All') {
            result = result.filter(s => s.categoryId === parseInt(selectedCategory));
        }

        // Filter by Search
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(s =>
                s.title.toLowerCase().includes(lowerTerm) ||
                (s.description && s.description.toLowerCase().includes(lowerTerm))
            );
        }

        setFilteredServices(result);
    }, [services, selectedCategory, searchTerm]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [servicesRes, categoriesRes] = await Promise.all([
                axiosClient.get('/services'),
                axiosClient.get('/categories')
            ]);

            // Only show Active services
            const activeServices = servicesRes.data.filter(s => s.status === 'Active');
            setServices(activeServices);
            setCategories(categoriesRes.data);

            // Handle URL query params for initial category filter
            const categoryParam = searchParams.get('cat');
            if (categoryParam) {
                setSelectedCategory(categoryParam);
            }

            setLoading(false);
        } catch (err) {
            console.error("Error fetching data:", err);
            setLoading(false);
        }
    };

    const getCategoryName = (categoryId) => {
        const cat = categories.find(c => c.categoryId === categoryId);
        return cat ? (cat.categoryName || cat.CategoryName) : 'Uncategorized';
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Spinner animation="border" variant="primary" />
        </div>
    );

    return (
        <div className="user-services py-5">
            <Container>
                <div className="text-center mb-5">
                    <h6 className="section-title bg-white text-center text-primary px-3 fw-bold" style={{ color: '#06BBCC !important' }}>Courses</h6>
                    <h1 className="mb-5">Our Popular Courses</h1>
                </div>

                {/* Filters */}
                <Row className="mb-5 justify-content-center">
                    <Col md={8}>
                        <InputGroup className="mb-3">
                            <Form.Select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                style={{ maxWidth: '200px' }}
                            >
                                <option value="All">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat.categoryId} value={cat.categoryId}>
                                        {cat.categoryName || cat.CategoryName}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button variant="primary" style={{ background: '#06BBCC', borderColor: '#06BBCC' }}>
                                Search
                            </Button>
                        </InputGroup>
                    </Col>
                </Row>

                {/* Service List */}
                <Row className="g-4">
                    {filteredServices.length > 0 ? (
                        filteredServices.map(service => (
                            <Col lg={4} md={6} key={service.serviceId}>
                                <Card className="border-0 shadow-sm hover-shadow h-100 transition-all">
                                    <div className="position-relative overflow-hidden">
                                        <img className="img-fluid w-100" src={`https://source.unsplash.com/600x400/?course,${service.title.replace(/\s+/g, '')}`} alt={service.title} style={{ height: '250px', objectFit: 'cover' }} onError={(e) => e.target.src = "https://themewagon.github.io/elearning/img/course-1.jpg"} />
                                        <div className="bg-white text-center position-absolute bottom-0 end-0 py-2 px-3" style={{ margin: '1px' }}>
                                            <small className="text-primary">{getCategoryName(service.categoryId)}</small>
                                        </div>
                                    </div>
                                    <Card.Body>
                                        <h5 className="card-title mb-3">{service.title}</h5>
                                        <div className="d-flex justify-content-between mb-3">
                                            <small className="m-0"><i className="fa fa-map-marker-alt text-primary me-2"></i>{service.mode || service.serviceType || 'Online'}</small>
                                            <small className="m-0"><i className="fa fa-clock text-primary me-2"></i>{service.requiredCredits} Credits</small>
                                        </div>
                                        <p className="card-text text-muted" style={{ fontSize: '0.9rem' }}>
                                            {service.description ? service.description.substring(0, 100) + '...' : 'No description available for this course.'}
                                        </p>
                                    </Card.Body>
                                    <Card.Footer className="bg-white border-top-0 d-flex align-items-center justify-content-between p-4">
                                        <Button
                                            as={Link}
                                            to={`/request-service?serviceId=${service.serviceId}`}
                                            variant="outline-primary"
                                            className="rounded-pill px-4 py-2"
                                            size="sm"
                                        >
                                            Read More
                                        </Button>
                                        <Button
                                            as={Link}
                                            to={`/request-service?serviceId=${service.serviceId}`}
                                            variant="primary"
                                            className="rounded-pill px-4 py-2 text-white"
                                            size="sm"
                                            style={{ background: '#06BBCC', borderColor: '#06BBCC' }}
                                        >
                                            Join Now
                                        </Button>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col className="text-center py-5">
                            <h4>No courses found matching your criteria.</h4>
                        </Col>
                    )}
                </Row>
            </Container>
        </div>
    );
};

export default UserServiceList;
