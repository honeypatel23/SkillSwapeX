import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [categoriesRes, servicesRes] = await Promise.all([
                    axiosClient.get('/categories'),
                    axiosClient.get('/services')
                ]);
                setCategories(categoriesRes.data);
                setServices(servicesRes.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load content. Please try again later.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Helper to count services per category
    const getServiceCount = (categoryId) => {
        return services.filter(service => service.categoryId === categoryId).length;
    };

    // Helper to get category name (handling different casing if needed, though API seems consistent)
    const getCategoryName = (cat) => cat.categoryName || cat.CategoryName;

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Spinner animation="border" variant="primary" />
        </div>
    );

    if (error) return (
        <Container className="py-5">
            <Alert variant="danger">{error}</Alert>
        </Container>
    );

    return (
        <div className="user-home">
            {/* Hero Section */}
            <div className="hero-section bg-primary position-relative d-flex align-items-center" style={{ minHeight: '80vh', background: 'linear-gradient(rgba(24, 29, 56, .7), rgba(24, 29, 56, .7)), url(https://themewagon.github.io/elearning/img/carousel-1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <Container>
                    <Row className="justify-content-start">
                        <Col sm={10} lg={8}>
                            <h5 className="text-primary text-uppercase mb-3 fw-bold" style={{ letterSpacing: '3px', color: '#06BBCC !important' }}>Best Online Learning</h5>
                            <h1 className="display-3 text-white animated slideInDown">Get Skilled Online From Your Home</h1>
                            <p className="fs-5 text-white mb-4 pb-2">Vero elitr justo clita lorem. Ipsum dolor at sed stet sit diam no. Kasd rebum ipsum et diam justo clita et kasd rebum sea sanctus eirmod elitr.</p>
                            <Button as={Link} to="/services" variant="light" size="lg" className="py-md-3 px-md-5 me-3 rounded-0 text-primary fw-bold">Read More</Button>
                            <Button as={Link} to="/request-service" variant="primary" size="lg" className="py-md-3 px-md-5 rounded-0 text-white fw-bold" style={{ background: '#06BBCC', borderColor: '#06BBCC' }}>Join Now</Button>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Service Categories Section */}
            <Container className="py-5">
                <div className="text-center mb-5">
                    <h6 className="section-title bg-white text-center text-primary px-3 fw-bold" style={{ color: '#06BBCC !important' }}>Categories</h6>
                    <h1 className="mb-5">Service Categories</h1>
                </div>
                <Row className="g-4">
                    {categories.length > 0 ? (
                        categories.map((category) => {
                            const count = getServiceCount(category.categoryId);
                            return (
                                <Col lg={3} md={6} key={category.categoryId}>
                                    <div className="category-item">
                                        <Link to={`/services?cat=${category.categoryId}`} className="text-decoration-none text-dark">
                                            <Card className="border-0 shadow-sm hover-shadow transition-all">
                                                <div className="position-relative overflow-hidden">
                                                    {/* Unique image based on category ID to prevent duplicates looking identical */}
                                                    <img className="img-fluid w-100" src={`https://source.unsplash.com/600x400/?education,learning,${getCategoryName(category).replace(/\s+/g, '')}`} alt={getCategoryName(category)} style={{ height: '200px', objectFit: 'cover' }} onError={(e) => e.target.src = "https://themewagon.github.io/elearning/img/cat-1.jpg"} />
                                                    <div className="bg-white text-center position-absolute bottom-0 end-0 py-2 px-3" style={{ margin: '1px' }}>
                                                        <small className="text-primary">{getCategoryName(category)}</small>
                                                    </div>
                                                </div>
                                                <Card.Body className="text-center">
                                                    <h5 className="mb-0">{getCategoryName(category)}</h5>
                                                    <small className="text-muted">{count} Courses</small>
                                                </Card.Body>
                                            </Card>
                                        </Link>
                                    </div>
                                </Col>
                            );
                        })
                    ) : (
                        <Col xs={12} className="text-center">
                            <p className="text-muted">No categories available at the moment.</p>
                        </Col>
                    )}
                </Row>
            </Container>
        </div>
    );
};

export default Home;
