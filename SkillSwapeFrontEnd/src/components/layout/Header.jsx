import React from 'react';
import { Navbar, Container, Dropdown, Image } from 'react-bootstrap';
import { FaUserCircle, FaBell } from 'react-icons/fa';

const Header = () => {
    return (
        <Navbar bg="white" variant="light" className="shadow-sm" style={{ height: 'var(--header-height)', position: 'sticky', top: 0, zIndex: 999 }}>
            <Container fluid className="px-4">
                {/* Toggle button could go here for mobile */}
                <Navbar.Brand className="d-none d-md-block"></Navbar.Brand>

                <div className="d-flex align-items-center ms-auto gap-3">
                    <div className="position-relative cursor-pointer text-secondary">
                        <FaBell size={20} />
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light p-1">
                            <span className="visually-hidden">New alerts</span>
                        </span>
                    </div>

                    <div className="vr h-100 mx-2"></div>

                    <Dropdown align="end">
                        <Dropdown.Toggle variant="light" id="dropdown-profile" className="d-flex align-items-center gap-2 border-0 bg-transparent">
                            <span className="d-none d-lg-block small text-secondary fw-bold">Admin User</span>
                            <FaUserCircle size={28} className="text-primary" />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="#profile">Profile</Dropdown.Item>
                            <Dropdown.Item href="#settings">Settings</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item href="#logout" className="text-danger">Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </Container>
        </Navbar>
    );
};

export default Header;
