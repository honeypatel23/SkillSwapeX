import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    return (
        <div className="d-flex w-100 min-vh-100">
            <Sidebar />
            <div className="d-flex flex-column w-100" style={{ marginLeft: 'var(--sidebar-width)' }}>
                <Header />
                <main className="p-4 bg-light flex-grow-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
