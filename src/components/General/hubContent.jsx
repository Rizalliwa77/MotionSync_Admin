import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, onSnapshot, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import '../../assets/General/hubContent.css';
import Sidebar from '../Sidebar';

const HubContent = () => {
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);
    const [selectedHub, setSelectedHub] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [schools, setSchools] = useState([]);
    const [selectedSchoolCourses, setSelectedSchoolCourses] = useState([]);
    const [selectedSection, setSelectedSection] = useState('courses');
    const [applications, setApplications] = useState([]);
    const [loadingApplicationId, setLoadingApplicationId] = useState(null);

    // Fetch schools data
    useEffect(() => {
        const fetchSchools = async () => {
            const schoolsCollection = collection(db, 'schools');
            const schoolsSnapshot = await getDocs(schoolsCollection);
            const schoolsList = schoolsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSchools(schoolsList);
        };

        fetchSchools();
    }, []);

    // Fetch courses when a school is selected
    useEffect(() => {
        if (selectedHub) {
            const coursesRef = collection(db, 'schools', selectedHub.id, 'courses');
            const unsubscribe = onSnapshot(coursesRef, (snapshot) => {
                const coursesList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setSelectedSchoolCourses(coursesList);
            });

            return () => unsubscribe();
        }
    }, [selectedHub]);

    // New useEffect for applications
    useEffect(() => {
        if (selectedHub) {
            const applicationsRef = collection(db, 'schools', selectedHub.id, 'applications');
            const unsubscribe = onSnapshot(applicationsRef, (snapshot) => {
                const applicationsList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setApplications(applicationsList);
            });

            return () => unsubscribe();
        }
    }, [selectedHub]);

    const filteredSchools = schools.filter(school =>
        school.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.schoolEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (school.tokenId && school.tokenId.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleCourseClick = (course) => {
        setSelectedCourse(selectedCourse?.id === course.id ? null : course);
    };

    const handleStatusUpdate = async (application, newStatus) => {
        if (!window.confirm(`Are you sure you want to ${newStatus} this application?`)) {
            return;
        }

        setLoadingApplicationId(application.id);
        
        try {
            // Update application status
            const applicationRef = doc(db, 'schools', selectedHub.id, 'applications', application.id);
            await updateDoc(applicationRef, {
                status: newStatus
            });

            // If approved, add student to the course's enrolled students
            if (newStatus === 'approved') {
                // Find the course by desired program
                const courseRef = collection(db, 'schools', selectedHub.id, 'courses');
                const coursesSnapshot = await getDocs(courseRef);
                const course = coursesSnapshot.docs.find(doc => 
                    doc.data().courseName === application.desiredProgram
                );

                if (course) {
                    // Update the course with the new student email
                    await updateDoc(doc(db, 'schools', selectedHub.id, 'courses', course.id), {
                        enrolledStudentsEmail: arrayUnion(application.email)
                    });
                } else {
                    console.error("Course not found for the desired program");
                    // Optionally show an error message to the user
                }
            }

            // Optional: Show success message
            alert(`Application successfully ${newStatus}`);
        } catch (error) {
            console.error("Error updating status:", error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoadingApplicationId(null);
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case 'approved': return 'status-badge approved';
            case 'rejected': return 'status-badge rejected';
            default: return 'status-badge pending';
        }
    };

    return (
        <div className="dashboard">
            <Sidebar onHoverChange={setIsSidebarHovered} />
            <main className={`main-content ${isSidebarHovered ? 'sidebar-hovered' : ''}`}>
                <div className="hub-content">
                    <div className="overview-section">
                        <h1>Hub Content Management</h1>
                    </div>

                    {/* Search Bar */}
                    <div className="search-section">
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Search hubs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <span className="material-symbols-outlined">search</span>
                        </div>
                    </div>

                    {/* Updated Schools Table */}
                    <div className="hubs-table-section">
                        <table className="hubs-table">
                            <thead>
                                <tr>
                                    <th>School Name</th>
                                    <th>Email Address</th>
                                    <th>Address</th>
                                    <th>Token ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSchools.map((school) => (
                                    <tr
                                        key={school.id}
                                        onClick={() => setSelectedHub(school)}
                                        className={selectedHub?.id === school.id ? 'selected' : ''}
                                    >
                                        <td>{school.schoolName}</td>
                                        <td>{school.schoolEmail}</td>
                                        <td>{school.schoolAddress}</td>
                                        <td>{school.tokenId || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Section Tabs */}
                    {selectedHub && (
                        <div className="section-tabs">
                            <button 
                                className={`tab ${selectedSection === 'courses' ? 'active' : ''}`}
                                onClick={() => setSelectedSection('courses')}
                            >
                                Courses
                            </button>
                            <button 
                                className={`tab ${selectedSection === 'applications' ? 'active' : ''}`}
                                onClick={() => setSelectedSection('applications')}
                            >
                                Applications
                            </button>
                        </div>
                    )}

                    {/* Courses Section */}
                    {selectedHub && selectedSection === 'courses' && (
                        <div className="hub-files-section">
                            <h2>Courses - {selectedHub.schoolName}</h2>
                            <div className="courses-icon-grid">
                                {selectedSchoolCourses.map(course => (
                                    <div 
                                        key={course.id} 
                                        className="course-icon-wrapper"
                                        onClick={() => handleCourseClick(course)}
                                    >
                                        <div className="course-icon">
                                            <span className="material-symbols-outlined">folder</span>
                                            <p className="course-name">{course.courseName}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Course Details Modal */}
                            {selectedCourse && (
                                <div className="course-details-modal">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h3>{selectedCourse.courseName}</h3>
                                            <span 
                                                className="material-symbols-outlined close-button"
                                                onClick={() => setSelectedCourse(null)}
                                            >
                                                close
                                            </span>
                                        </div>
                                        <div className="modal-body">
                                            <p><strong>EDP Code:</strong> {selectedCourse.edpCode}</p>
                                            <p><strong>Description:</strong> {selectedCourse.courseDescription}</p>
                                            <p><strong>Year:</strong> {selectedCourse.year}</p>
                                            <p><strong>Teacher:</strong> {selectedCourse.teacherEmail}</p>
                                            <div className="enrolled-students">
                                                <p><strong>Enrolled Students:</strong></p>
                                                <ul>
                                                    {selectedCourse.enrolledStudentsEmail?.map((email, index) => (
                                                        <li key={index}>{email}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Applications Section */}
                    {selectedHub && selectedSection === 'applications' && (
                        <div className="applications-section">
                            <h2>Applications - {selectedHub.schoolName}</h2>
                            <div className="applications-table-wrapper">
                                <table className="applications-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Desired Program</th>
                                            <th>Previous School</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.map((application) => (
                                            <tr key={application.id}>
                                                <td>{`${application.firstName} ${application.lastName}`}</td>
                                                <td>{application.email}</td>
                                                <td>{application.phone}</td>
                                                <td>{application.desiredProgram}</td>
                                                <td>{application.previousSchool}</td>
                                                <td>{application.formattedDate}</td>
                                                <td>
                                                    <span className={getStatusBadgeClass(application.status)}>
                                                        {application.status}
                                                    </span>
                                                </td>
                                                <td className="action-buttons">
                                                    {application.status === 'pending' && (
                                                        <>
                                                            <button 
                                                                className={`approve-btn ${loadingApplicationId === application.id ? 'loading' : ''}`}
                                                                onClick={() => handleStatusUpdate(application, 'approved')}
                                                                disabled={loadingApplicationId === application.id}
                                                            >
                                                                {loadingApplicationId === application.id ? 'Processing...' : 'Approve'}
                                                            </button>
                                                            <button 
                                                                className="reject-btn"
                                                                onClick={() => handleStatusUpdate(application, 'rejected')}
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                    {application.status !== 'pending' && (
                                                        <span className="status-text">
                                                            {application.status === 'approved' ? 'Enrolled' : 'Rejected'}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default HubContent;
