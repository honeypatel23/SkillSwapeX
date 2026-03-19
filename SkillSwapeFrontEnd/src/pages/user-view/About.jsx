import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="about-page">
            <Container className="py-5">
                <Row className="g-5">
                    <Col lg={6} className="d-flex align-items-center" style={{ minHeight: '400px' }}>
                        <div className="position-relative w-100 h-100">
                            <img className="img-fluid position-absolute w-100 h-100" src="https://themewagon.github.io/elearning/img/about.jpg" alt="" style={{ objectFit: 'cover' }} />
                        </div>
                    </Col>
                    <Col lg={6}>
                        <h6 className="section-title bg-white text-start text-primary pe-3 fw-bold" style={{ color: '#06BBCC !important' }}>About Us</h6>
                        <h1 className="mb-4">Welcome to SkillSwape</h1>
                        <p className="mb-4">Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit.</p>
                        <p className="mb-4">Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore erat amet</p>
                        <Row className="gy-2 gx-4 mb-4">
                            <Col sm={6}>
                                <p className="mb-0"><i className="fa fa-arrow-right text-primary me-2"></i>Skilled Instructors</p>
                            </Col>
                            <Col sm={6}>
                                <p className="mb-0"><i className="fa fa-arrow-right text-primary me-2"></i>Online Classes</p>
                            </Col>
                            <Col sm={6}>
                                <p className="mb-0"><i className="fa fa-arrow-right text-primary me-2"></i>International Certificate</p>
                            </Col>
                            <Col sm={6}>
                                <p className="mb-0"><i className="fa fa-arrow-right text-primary me-2"></i>Skilled Instructors</p>
                            </Col>
                            <Col sm={6}>
                                <p className="mb-0"><i className="fa fa-arrow-right text-primary me-2"></i>Online Classes</p>
                            </Col>
                            <Col sm={6}>
                                <p className="mb-0"><i className="fa fa-arrow-right text-primary me-2"></i>International Certificate</p>
                            </Col>
                        </Row>
                        <Button as={Link} to="/services" className="py-3 px-5 mt-2 rounded-0 text-white fw-bold" style={{ background: '#06BBCC', borderColor: '#06BBCC' }}>Read More</Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default About;
