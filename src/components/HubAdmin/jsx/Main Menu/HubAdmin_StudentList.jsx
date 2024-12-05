import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../../../firebase/firebaseConfig';
import '../../styles/Main Menu/HubAdmin_StudentList.css';
import HubAdminSidebar from '../HubAdminSidebar';

const SCHOOL_ID = '7kJvkewDYT1hTRKieGcQ';

const HubAdminStudentList = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 9;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsRef = collection(db, `schools/${SCHOOL_ID}/students`);
        const q = query(studentsRef, orderBy('timestamp', 'desc')); // Sort by newest first
        const studentsSnapshot = await getDocs(q);
        const studentsData = studentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setStudents(studentsData);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  // Search functionality
  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'on leave':
        return 'status-leave';
      case 'enrolled':
        return 'status-enrolled';
      default:
        return 'status-active';
    }
  };

  return (
    <div className="hub-admin-container">
      <HubAdminSidebar />
      <div className="main-content">
        <div className="users-management">
          <h1>Student Management</h1>
          <div className="search-container">
            <input 
              type="text" 
              className="search-bar" 
              placeholder="Search by name, email, or ID..." 
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>FIRST NAME, LAST NAME</th>
                <th>EMAIL ADDRESS</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.studentId}</td>
                  <td>{`${student.firstName} ${student.lastName}`}</td>
                  <td>{student.email}</td>
                  <td>
                    <span className={`status ${getStatusClass(student.status)}`}>
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <div className="pagination">
            <button 
              className="nav-button" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <span className="material-icons">←</span>
            </button>
            <span>{String(currentPage).padStart(2, '0')}/{String(totalPages).padStart(2, '0')}</span>
            <button 
              className="nav-button" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <span className="material-icons">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HubAdminStudentList;
