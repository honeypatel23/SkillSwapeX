import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const Contact = () => {
    return (
        <div className="contact-page py-5">
            <Container>
                <div className="text-center mb-5">
                    <h6 className="section-title bg-white text-center text-primary px-3 fw-bold" style={{ color: '#06BBCC !important' }}>Contact Us</h6>
                    <h1 className="mb-5">Contact For Any Query</h1>
                </div>
                <Row className="g-4 justify-content-center">
                    <Col lg={4} md={6}>
                        <div className="d-flex align-items-center mb-3">
                            <div className="d-flex align-items-center justify-content-center flex-shrink-0 bg-primary" style={{ width: '50px', height: '50px', backgroundColor: '#06BBCC !important' }}>
                                <i className="fa fa-map-marker-alt text-white"></i>
                            </div>
                            <div className="ms-3">
                                <h5 className="text-primary" style={{ color: '#06BBCC !important' }}>Office</h5>
                                <p className="mb-0">123 Street, New York, USA</p>
                            </div>
                        </div>
                        <div className="d-flex align-items-center mb-3">
                            <div className="d-flex align-items-center justify-content-center flex-shrink-0 bg-primary" style={{ width: '50px', height: '50px', backgroundColor: '#06BBCC !important' }}>
                                <i className="fa fa-phone-alt text-white"></i>
                            </div>
                            <div className="ms-3">
                                <h5 className="text-primary" style={{ color: '#06BBCC !important' }}>Mobile</h5>
                                <p className="mb-0">+012 345 67890</p>
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="d-flex align-items-center justify-content-center flex-shrink-0 bg-primary" style={{ width: '50px', height: '50px', backgroundColor: '#06BBCC !important' }}>
                                <i className="fa fa-envelope-open text-white"></i>
                            </div>
                            <div className="ms-3">
                                <h5 className="text-primary" style={{ color: '#06BBCC !important' }}>Email</h5>
                                <p className="mb-0">info@example.com</p>
                            </div>
                        </div>
                    </Col>
                    <Col lg={4} md={6}>
                        <Form>
                            <Row className="g-3">
                                <Col md={6}>
                                    <Form.Control type="text" placeholder="Your Name" style={{ height: '55px' }} />
                                </Col>
                                <Col md={6}>
                                    <Form.Control type="email" placeholder="Your Email" style={{ height: '55px' }} />
                                </Col>
                                <Col xs={12}>
                                    <Form.Control type="text" placeholder="Subject" style={{ height: '55px' }} />
                                </Col>
                                <Col xs={12}>
                                    <Form.Control as="textarea" rows={4} placeholder="Message" />
                                </Col>
                                <Col xs={12}>
                                    <Button className="w-100 py-3 rounded-0 text-white fw-bold" type="submit" style={{ background: '#06BBCC', borderColor: '#06BBCC' }}>Send Message</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Contact;
