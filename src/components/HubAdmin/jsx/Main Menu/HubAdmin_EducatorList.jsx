import React, { useState, useEffect } from 'react';
import '../../styles/Main Menu/HubAdmin_EducatorList.css';
import HubAdminSidebar from '../HubAdminSidebar';
import { collection, doc, getDocs } from 'firebase/firestore';
import { db } from "../../../../firebase/firebaseConfig";

const HubAdminEducatorList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [allEducators, setAllEducators] = useState([]);
    const educatorsPerPage = 9;

    useEffect(() => {
        const fetchEducators = async () => {
            const schoolDoc = doc(db, 'schools', '7kJvkewDYT1hTRKieGcQ');
            const teacherCollection = collection(schoolDoc, 'teacher');
            const teacherSnapshot = await getDocs(teacherCollection);
            const teachers = teacherSnapshot.docs.map((doc, index) => ({
                id: (100 + index).toString(),
                name: `${doc.data().teacherFName} ${doc.data().teacherLName}`,
                email: doc.data().teacherEmail,
                status: doc.data().status || 'inactive'
            }));
            setAllEducators(teachers);
        };

        fetchEducators();
    }, []);

    // Search functionality
    const filteredEducators = allEducators.filter(educator =>
        educator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        educator.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        educator.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredEducators.length / educatorsPerPage);
    const indexOfLastEducator = currentPage * educatorsPerPage;
    const indexOfFirstEducator = indexOfLastEducator - educatorsPerPage;
    const currentEducators = filteredEducators.slice(indexOfFirstEducator, indexOfLastEducator);

    // Navigation functions
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    // Handle search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleManageEducators = () => {
        // Add functionality for managing educators here
        console.log("Manage Educators button clicked");
    };

    return (
        <div className="hub-admin-container">
            <HubAdminSidebar />
            <div className="main-content">
                <div className="users-management">
                    <h1>Educators Management</h1>
                    <div className="search-container">
                        <input 
                            type="text" 
                            className="search-bar" 
                            placeholder="Search..." 
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
                <div className="table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>ID #</th>
                                <th>NAME</th>
                                <th>EMAIL ADDRESS</th>
                                <th>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentEducators.map((educator) => (
                                <tr key={educator.id}>
                                    <td>{educator.id}</td>
                                    <td>{educator.name}</td>
                                    <td>{educator.email}</td>
                                    <td>
                                        <span className={`status ${educator.status}`}>
                                            {educator.status === 'active' ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="table-footer">
                    <div className="action-buttons">
                        <button 
                            className="action-button"
                            onClick={handleManageEducators}
                        >
                            Manage Educators
                        </button>
                    </div>
                    <div className="pagination">
                        <button 
                            className="nav-button" 
                            onClick={prevPage}
                            disabled={currentPage === 1}
                        >
                            <span className="material-icons"> ← </span>
                        </button>
                        <span>{String(currentPage).padStart(2, '0')}/{String(totalPages).padStart(2, '0')}</span>
                        <button 
                            className="nav-button" 
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                        >
                            <span className="material-icons"> → </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HubAdminEducatorList;
