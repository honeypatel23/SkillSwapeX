import React from 'react';
import { Pagination } from 'react-bootstrap';

const AppPagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = [];

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Don't render pagination if there are no items or only 1 page
    if (totalItems <= 0 || totalPages <= 1) {
        return null;
    }

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    // Handlers for Previous and Next
    const handlePrev = () => {
        if (currentPage > 1) {
            paginate(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            paginate(currentPage + 1);
        }
    };

    return (
        <nav className="d-flex justify-content-end mt-4">
            <Pagination className="mb-0">
                <Pagination.Prev onClick={handlePrev} disabled={currentPage === 1} />

                {pageNumbers.map(number => (
                    <Pagination.Item
                        key={number}
                        active={number === currentPage}
                        onClick={() => paginate(number)}
                    >
                        {number}
                    </Pagination.Item>
                ))}

                <Pagination.Next onClick={handleNext} disabled={currentPage === totalPages} />
            </Pagination>
        </nav>
    );
};

export default AppPagination;
