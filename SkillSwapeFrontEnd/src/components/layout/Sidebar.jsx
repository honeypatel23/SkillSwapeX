import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    FaTachometerAlt,
    FaUsers,
    FaTags,
    FaTools,
    FaClipboardList,
    FaChalkboardTeacher,
    FaTasks,
    FaFileUpload
} from 'react-icons/fa';
import { Container, Nav } from 'react-bootstrap';

const Sidebar = () => {
    const menuItems = [
        { path: '/admin', name: 'Dashboard', icon: <FaTachometerAlt /> },
        { path: '/admin/users', name: 'Users', icon: <FaUsers /> },
        { path: '/admin/categories', name: 'Categories', icon: <FaTags /> },
        { path: '/admin/services', name: 'Services', icon: <FaTools /> },
        { path: '/admin/requests', name: 'Service Requests', icon: <FaClipboardList /> },
        { path: '/admin/sessions', name: 'Learning Sessions', icon: <FaChalkboardTeacher /> },
        { path: '/admin/work-progress', name: 'Work Progress', icon: <FaTasks /> },
        { path: '/admin/submissions', name: 'Submissions', icon: <FaFileUpload /> },
    ];

    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{ width: 'var(--sidebar-width)', minHeight: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 1000 }}>
            <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span className="fs-4 fw-bold">SkillSwape</span>
            </a>
            <hr />
            <Nav className="flex-column mb-auto">
                {menuItems.map((item, index) => (
                    <Nav.Item key={index} className="mb-1">
                        <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                                `nav-link text-white d-flex align-items-center gap-2 ${isActive ? 'active bg-primary' : ''}`
                            }
                            style={{ borderRadius: '5px' }}
                        >
                            {item.icon}
                            {item.name}
                        </NavLink>
                    </Nav.Item>
                ))}
            </Nav>
        </div>
    );
};

export default Sidebar;
