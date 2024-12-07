import React, { useState, useEffect } from 'react';
import { getFirestore, doc, setDoc, collection, getDocs, deleteDoc, updateDoc, addDoc, writeBatch } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { db } from "../../../../firebase/firebaseConfig";
import HubAdminSidebar from '../HubAdminSidebar';
import '../../styles/Management/HubAdmin_Classroom.css';

let currentId = 100; // Initialize the starting ID

const generateStaticId = () => {
    return currentId++;
};

// Initialize Firebase Storage
const storage = getStorage();

const SCHOOL_ID = '7kJvkewDYT1hTRKieGcQ';

const HubAdmin_Classroom = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('subjects');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showApplications, setShowApplications] = useState(false);
  const [students, setStudents] = useState([]);
  let currentStudentId = 110;
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  // Fetch courses from Firebase
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesRef = collection(db, `schools/${SCHOOL_ID}/courses`);
        const coursesSnapshot = await getDocs(coursesRef);
        const coursesData = coursesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCourses(coursesData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchData = async (type, setState) => {
      try {
        const ref = collection(db, `schools/7kJvkewDYT1hTRKieGcQ/${type}`);
        const snapshot = await getDocs(ref);
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setState(list);
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
      }
    };

    fetchData('subject', setSubjects);
    fetchData('teacher', setTeachers);
    fetchData('applications', setApplications);
  }, []);

  // Fetch students from Firebase
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsRef = collection(db, `schools/${SCHOOL_ID}/students`);
        const studentsSnapshot = await getDocs(studentsRef);
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

  const handleSidebarHover = (isHovered) => {
    setIsSidebarExpanded(isHovered);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredCourses = courses.filter(course => 
    course.courseName.toLowerCase().includes(searchQuery) ||
    course.edpCode.toLowerCase().includes(searchQuery)
  );

  const handleAdd = (type) => {
    setModalType(type);
    setModalData(null); // Clear any existing data
    setShowModal(true);
  };

  const handleAddNewTeacher = () => {
    setModalData(null);
    setModalType('teacher');
    setShowModal(true);
  };

  const handleAddNewStudent = () => {
    setModalData(null);
    setModalType('student');
    setShowModal(true);
  };

  const handleEdit = (item, type) => {
    setModalData({...item}); // Create a copy of the item
    setModalType(type);
    setShowModal(true);
    setEditingId(item.id);
    setOriginalData(item); // Store the original item directly, not stringified
    setHasChanges(false);
  };

  const handleFormChange = (formData) => {
    // Compare new data with original data
    const isChanged = JSON.stringify(formData) !== JSON.stringify(originalData);
    setHasChanges(isChanged);
  };

  const handleDelete = async (item, type, setState) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        const collectionPath = type === 'subject' 
          ? `schools/${SCHOOL_ID}/courses` 
          : `schools/${SCHOOL_ID}/${type}`;
        
        const ref = doc(db, collectionPath, item.id);
        await deleteDoc(ref);
        
        if (type === 'subject') {
          setCourses(prev => prev.filter(i => i.id !== item.id));
        } else if (type === 'teacher') {
          setTeachers(prev => prev.filter(i => i.id !== item.id));
        } else if (type === 'student') {
          setStudents(prev => prev.filter(i => i.id !== item.id));
        }
        
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
        alert(`Error deleting ${type}. Please try again.`);
      }
    }
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteDoc(doc(db, `schools/${SCHOOL_ID}/courses`, itemToDelete.id));
        setCourses(courses.filter(c => c.id !== itemToDelete.id));
        setShowDeleteConfirm(false);
        setItemToDelete(null);
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };

  const handleSave = async (formData) => {
    if (!hasChanges) {
      setShowModal(false);
      return;
    }

    try {
      if (modalType === 'teacher') {
        const teacherData = {
          teacherId: formData.teacherId || generateStaticId(),
          teacherFName: String(formData.teacherFName || '').trim(),
          teacherMName: String(formData.teacherMName || '').trim(),
          teacherLName: String(formData.teacherLName || '').trim(),
          teacherEmail: String(formData.teacherEmail || '').trim(),
          specialization: String(formData.specialization || '').trim(),
          yearsTeaching: Number(formData.yearsTeaching || 0),
          timestamp: new Date().toISOString()
        };

        if (modalData?.id) {
          // Update existing teacher
          const teacherRef = doc(db, `schools/${SCHOOL_ID}/teacher`, modalData.id);
          await updateDoc(teacherRef, teacherData);
          
          // Update local state
          setTeachers(prevTeachers =>
            prevTeachers.map(teacher =>
              teacher.id === modalData.id ? { ...teacherData, id: modalData.id } : teacher
            )
          );
        } else {
          // Add new teacher
          const teachersRef = collection(db, `schools/${SCHOOL_ID}/teacher`);
          const docRef = await addDoc(teachersRef, teacherData);
          
          setTeachers(prevTeachers => [
            ...prevTeachers,
            { id: docRef.id, ...teacherData }
          ]);
        }

      } else if (modalType === 'subject') {
        const subjectData = {
          courseId: formData.courseId || generateStaticId(),
          courseName: String(formData.courseName || '').trim(),
          edpCode: String(formData.edpCode || '').trim(),
          courseDescription: String(formData.courseDescription || '').trim(),
          teacherEmail: String(formData.teacherEmail || '').trim(),
          teacherName: String(formData.teacherName || ''),
          year: Number(formData.year || new Date().getFullYear()),
          enrolledStudentsEmail: formData.enrolledStudentsEmail || [],
          timestamp: new Date().toISOString()
        };

        if (modalData?.id) {
          // Update existing subject
          const subjectRef = doc(db, `schools/${SCHOOL_ID}/courses`, modalData.id);
          await updateDoc(subjectRef, subjectData);
          
          // Update local state
          setCourses(prevCourses =>
            prevCourses.map(course =>
              course.id === modalData.id ? { ...subjectData, id: modalData.id } : course
            )
          );
        } else {
          // Add new subject
          const subjectsRef = collection(db, `schools/${SCHOOL_ID}/courses`);
          const docRef = await addDoc(subjectsRef, subjectData);
          
          setCourses(prevCourses => [
            ...prevCourses,
            { id: docRef.id, ...subjectData }
          ]);
        }
      } else if (modalType === 'student') {
        const studentData = {
          userId: generateStaticId(), // Use static ID generator
          email: formData.email.trim(),
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phone: formData.phone.trim(),
          formattedDate: new Date().toLocaleDateString(),
          timestamp: new Date().toISOString()
        };

        if (editingId) {
          const studentRef = doc(db, `schools/7kJvkewDYT1hTRKieGcQ/applications`, editingId);
          await updateDoc(studentRef, studentData);
          
          setStudents(prevStudents =>
            prevStudents.map(student =>
              student.id === editingId ? { id: editingId, ...studentData } : student
            )
          );
        } else {
          const applicationsRef = collection(db, `schools/7kJvkewDYT1hTRKieGcQ/applications`);
          const docRef = await addDoc(applicationsRef, studentData);
          
          setStudents(prevStudents => [
            ...prevStudents,
            { id: docRef.id, ...studentData }
          ]);
        }

        setShowModal(false);
        alert(editingId ? 'Student updated successfully' : 'Student added successfully');
      }

      setShowModal(false);
      setHasChanges(false);
      alert(`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} ${modalData ? 'updated' : 'added'} successfully`);
    } catch (error) {
      console.error(`Error saving ${modalType}:`, error);
      alert(`Error saving ${modalType}. Please try again.`);
    }
  };

  const generateStudentId = () => {
    return `#${currentStudentId++}`;
  };

  const getRandomStatus = () => {
    const statuses = ['Active', 'On Leave', 'Enrolled'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      // Update application status
      const applicationRef = doc(db, `schools/${SCHOOL_ID}/applications`, applicationId);
      await updateDoc(applicationRef, {
        status: newStatus
      });

      if (newStatus === 'approved') {
        // Get the application data
        const application = applications.find(app => app.id === applicationId);
        
        // Create new student data
        const studentData = {
          studentId: `#${currentStudentId++}`,
          firstName: application.firstName,
          lastName: application.lastName,
          email: application.email,
          status: getRandomStatus(),
          timestamp: new Date().toISOString(),
        };

        // Add to students collection
        const studentsRef = collection(db, `schools/${SCHOOL_ID}/students`);
        await addDoc(studentsRef, studentData);

        // Update all courses to include this student's email
        const coursesRef = collection(db, `schools/${SCHOOL_ID}/courses`);
        const coursesSnapshot = await getDocs(coursesRef);
        
        // Batch update for better performance
        const batch = writeBatch(db);
        
        coursesSnapshot.docs.forEach(courseDoc => {
          const courseRef = doc(db, `schools/${SCHOOL_ID}/courses`, courseDoc.id);
          const currentEmails = courseDoc.data().enrolledStudentsEmail || [];
          
          // Only add email if it's not already in the array
          if (!currentEmails.includes(application.email)) {
            batch.update(courseRef, {
              enrolledStudentsEmail: [...currentEmails, application.email]
            });
          }
        });

        // Commit the batch update
        await batch.commit();

        // Update local state
        setApplications(applications.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        ));

        // Update courses state to reflect new enrollment
        setCourses(courses.map(course => ({
          ...course,
          enrolledStudentsEmail: course.enrolledStudentsEmail 
            ? [...course.enrolledStudentsEmail, application.email]
            : [application.email]
        })));

        alert('Application approved and student added successfully');
      } else {
        // Just update the application status for rejected applications
        setApplications(applications.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        ));
        
        alert(`Application ${newStatus}`);
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      alert("Error updating application status");
    }
  };

  const viewSupportingDocuments = async (applicationId) => {
    setIsLoading(true);
    try {
      const storageRef = ref(storage, `applications/${applicationId}/supportingDocuments`);
      const url = await getDownloadURL(storageRef);

      // Try to open in modal first
      setCurrentDocument(url);
      setShowDocumentModal(true);

      // Add error handler for iframe load failure
      const iframe = document.querySelector('.document-viewer');
      if (iframe) {
        iframe.onerror = () => {
          handleDownload(url);
        };
      }
    } catch (error) {
      console.error("Error accessing documents:", error);
      alert("Error viewing documents. Trying to download instead...");
      handleDownload(url);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (url) => {
    try {
      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.download = 'supporting-documents.pdf'; // Default name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading document:", error);
      alert("Error downloading documents. Please try again later.");
    }
  };

  const handleDeleteDeniedApplication = async (applicationId) => {
    try {
      if (window.confirm('Are you sure you want to delete this denied application?')) {
        // Delete from Firebase
        const applicationRef = doc(db, `schools/${SCHOOL_ID}/applications`, applicationId);
        await deleteDoc(applicationRef);

        // Update local state
        setApplications(prevApplications => 
          prevApplications.filter(app => app.id !== applicationId)
        );

        alert('Denied application deleted successfully');
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("Error deleting application");
    }
  };

  const handleDeleteApprovedApplication = async (applicationId) => {
    try {
      if (window.confirm('Are you sure you want to delete this approved application?')) {
        // Delete from Firebase
        const applicationRef = doc(db, `schools/${SCHOOL_ID}/applications`, applicationId);
        await deleteDoc(applicationRef);

        // Update local state
        setApplications(prevApplications => 
          prevApplications.filter(app => app.id !== applicationId)
        );

        alert('Approved application deleted successfully');
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("Error deleting application");
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="loading-spinner">Loading...</div>;
    }

    switch (activeTab) {
      case 'subjects':
        return (
          <div className="subjects-container">
            <div className="container-header">
              <h2>Subjects</h2>
              <button className="primary-button" onClick={() => handleAdd('subject')}>
                Add New Subject
              </button>
            </div>
            <div className="subjects-grid">
              {courses.map((course) => {
                // Find the teacher details
                const teacher = teachers.find(t => t.teacherEmail === course.teacherEmail);
                
                // Find enrolled students
                const enrolledStudents = students.filter(student => 
                  course.enrolledStudentsEmail?.includes(student.email)
                );

                return (
                  <div key={course.id} className="subject-card">
                    <div className="subject-header">
                      <h3>{course.courseName}</h3>
                      <span className="course-id">{course.courseId}</span>
                    </div>
                    <div className="subject-details">
                      <p className="edp-code">{course.edpCode}</p>
                      <p className="description">{course.courseDescription}</p>
                      
                      {/* Teacher Section */}
                      <div className="teacher-info">
                        <h4>Teacher</h4>
                        {teacher ? (
                          <div className="teacher-detail">
                            <span className="material-symbols-outlined">person</span>
                            <p>{`${teacher.teacherFName} ${teacher.teacherLName}`}</p>
                            <p className="teacher-email">{teacher.teacherEmail}</p>
                          </div>
                        ) : (
                          <p className="no-teacher">No teacher assigned</p>
                        )}
                      </div>

                      {/* Students Section */}
                      <div className="students-info">
                        <h4>Enrolled Students ({enrolledStudents.length})</h4>
                        <div className="students-list">
                          {enrolledStudents.length > 0 ? (
                            enrolledStudents.map(student => (
                              <div key={student.id} className="student-detail">
                                <span className="material-symbols-outlined">school</span>
                                <p>{`${student.firstName} ${student.lastName}`}</p>
                                <p className="student-email">{student.email}</p>
                              </div>
                            ))
                          ) : (
                            <p className="no-students">No students enrolled</p>
                          )}
                        </div>
                      </div>

                      <div className="stats">
                        <div className="stat">
                          <span className="material-symbols-outlined">calendar_today</span>
                          <p>Year: {course.year}</p>
                        </div>
                      </div>
                    </div>
                    <div className="card-actions">
                      <button 
                        className="icon-button edit"
                        onClick={() => handleEdit(course, 'subject')}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button 
                        className="icon-button delete"
                        onClick={() => handleDelete(course, 'subject')}
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      
      case 'teachers':
        return (
          <div className="teachers-container">
            <div className="container-header">
              <h2>Teachers</h2>
              <button className="primary-button" onClick={handleAddNewTeacher}>
                Add New Teacher
              </button>
            </div>
            
            <div className="teachers-grid">
              {teachers.map((teacher) => (
                <div key={teacher.id} className="teacher-card">
                  <div className="teacher-header">
                    <h3>{`${teacher.teacherFName} ${teacher.teacherMName || ''} ${teacher.teacherLName}`}</h3>
                    <span className="teacher-id">{teacher.teacherId}</span>
                  </div>
                  <div className="teacher-details">
                    <p className="specialization">{teacher.specialization}</p>
                    <div className="teacher-stats">
                      <div className="stat">
                        <span className="material-symbols-outlined">mail</span>
                        <p>{teacher.teacherEmail}</p>
                      </div>
                      <div className="stat">
                        <span className="material-symbols-outlined">school</span>
                        <p>{teacher.yearsTeaching} Years Teaching</p>
                      </div>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button className="icon-button edit" onClick={() => handleEdit(teacher, 'teacher')}>
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button className="icon-button delete" onClick={() => handleDelete(teacher, 'teacher')}>
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderApplications = () => {
    const pendingApplications = applications.filter(app => app.status === 'pending');
    const approvedApplications = applications.filter(app => app.status === 'approved');
    const deniedApplications = applications.filter(app => app.status === 'rejected');

    return (
      <div className="applications-section">
        {/* Pending Applications Section */}
        {pendingApplications.length > 0 && (
          <div className="pending-applications">
            <h3>Pending Applications</h3>
            <div className="applications-grid">
              {pendingApplications.map((application) => (
                <div key={application.id} className="application-card">
                  <div className="application-header">
                    <h3>{`${application.firstName} ${application.lastName}`}</h3>
                    <span className="application-id">{application.userId}</span>
                  </div>
                  <div className="application-details">
                    <div className="detail-row">
                      <span className="material-symbols-outlined">school</span>
                      <p>{application.desiredProgram || 'No Program Specified'}</p>
                    </div>
                    <div className="detail-row">
                      <span className="material-symbols-outlined">mail</span>
                      <p>{application.email}</p>
                    </div>
                    <div className="detail-row">
                      <span className="material-symbols-outlined">phone</span>
                      <p>{application.phone}</p>
                    </div>
                    <div className="detail-row">
                      <span className="material-symbols-outlined">history_edu</span>
                      <p>{application.previousSchool || 'No Previous School'}</p>
                    </div>
                    <div className="detail-row">
                      <span className="material-symbols-outlined">calendar_today</span>
                      <p>Applied: {application.formattedDate}</p>
                    </div>
                    <div className="detail-row documents-row">
                      <span className="material-symbols-outlined">attach_file</span>
                      <button 
                        className="view-documents-btn"
                        onClick={() => viewSupportingDocuments(application.id)}
                      >
                        View Supporting Documents
                      </button>
                    </div>
                    <div className="application-actions">
                      <div className="status-badge" data-status={application.status || 'pending'}>
                        {application.status || 'Pending'}
                      </div>
                      {(!application.status || application.status === 'pending') && (
                        <div className="action-buttons">
                          <button 
                            className="accept-btn"
                            onClick={() => handleStatusChange(application.id, 'approved')}
                          >
                            <span className="material-symbols-outlined">check_circle</span>
                            Accept
                          </button>
                          <button 
                            className="deny-btn"
                            onClick={() => handleStatusChange(application.id, 'rejected')}
                          >
                            <span className="material-symbols-outlined">cancel</span>
                            Deny
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approved Applications Section */}
        {approvedApplications.length > 0 && (
          <div className="approved-applications">
            <h3>Approved Applications</h3>
            <div className="approved-grid">
              {approvedApplications.map((application) => (
                <div key={application.id} className="approved-card">
                  <div className="approved-content">
                    <span className="material-symbols-outlined">check_circle</span>
                    <p>{`${application.firstName} ${application.lastName}`}</p>
                  </div>
                  <button 
                    className="delete-btn delete-approved"
                    onClick={() => handleDeleteApprovedApplication(application.id)}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Denied Applications Section */}
        {deniedApplications.length > 0 && (
          <div className="denied-applications">
            <h3>Denied Applications</h3>
            <div className="denied-grid">
              {deniedApplications.map((application) => (
                <div key={application.id} className="denied-card">
                  <div className="denied-content">
                    <span className="material-symbols-outlined">folder</span>
                    <p>{`${application.firstName} ${application.lastName}`}</p>
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteDeniedApplication(application.id)}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const DocumentModal = () => {
    if (!showDocumentModal) return null;

    return (
      <div className="document-modal-overlay">
        <div className="document-modal">
          <div className="document-modal-header">
            <h3>Supporting Documents</h3>
            <div className="modal-actions">
              {currentDocument && (
                <button 
                  className="download-btn"
                  onClick={() => handleDownload(currentDocument)}
                >
                  <span className="material-symbols-outlined">download</span>
                  Download
                </button>
              )}
              <button 
                className="close-modal-btn"
                onClick={() => setShowDocumentModal(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>
          <div className="document-modal-content">
            {isLoading ? (
              <div className="loading-spinner">Loading document...</div>
            ) : (
              currentDocument && (
                <iframe
                  className="document-viewer"
                  src={currentDocument}
                  title="Supporting Documents"
                  width="100%"
                  height="100%"
                  onError={() => handleDownload(currentDocument)}
                />
              )
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`hub-admin-classroom ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
      <HubAdminSidebar onHoverChange={handleSidebarHover} />
      <div className="classroom-page">
        <div className="classroom-header">
          <h1>Classroom Management</h1>
          
          <div className="header-controls">
            <div className="tab-navigation">
              {['subjects', 'teachers'].map(tab => (
                <button 
                  key={tab}
                  className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  <span className="material-symbols-outlined">
                    {tab === 'subjects' ? 'book' : 'person'}
                  </span>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="search-wrapper">
              <span className="material-symbols-outlined">search</span>
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>

        <div className="classroom-content">
          {renderContent()}
        </div>

        {renderApplications()}
      </div>

      {showModal && (
        <CourseModal 
          data={modalData}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          modalType={modalType}
          teachers={teachers}
          students={students}
          onFormChange={handleFormChange}
          hasChanges={hasChanges}
        />
      )}

      {showDeleteConfirm && (
        <div className="modal delete-confirm-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button 
                className="close-button"
                onClick={() => setShowDeleteConfirm(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete {itemToDelete?.courseName}?</p>
              <p>This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button 
                className="secondary-button"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="delete-button"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <DocumentModal />
    </div>
  );
};

const CourseModal = ({ 
  data, 
  onClose, 
  onSave, 
  modalType, 
  teachers, 
  students, 
  onFormChange,
  hasChanges
}) => {
  const initialTeacherData = {
    teacherId: generateStaticId(),
    teacherFName: '',
    teacherLName: '',
    teacherMName: '',
    teacherEmail: '',
    specialization: '',
    yearsTeaching: '',
    timestamp: new Date().toISOString()
  };

  const initialSubjectData = {
    courseId: generateStaticId(),
    courseName: '',
    edpCode: '',
    courseDescription: '',
    teacherEmail: '',
    teacherName: '',
    year: new Date().getFullYear(),
    enrolledStudentsEmail: [],
    timestamp: new Date().toISOString()
  };

  const [formData, setFormData] = useState(
    modalType === 'teacher' ? (data || initialTeacherData) : (data || initialSubjectData)
  );

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [errors, setErrors] = useState({});

  // Add useEffect to track changes
  useEffect(() => {
    onFormChange(formData);
  }, [formData, onFormChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'teacherEmail') {
      const selectedTeacher = teachers.find(teacher => teacher.teacherEmail === value);
      setFormData(prev => ({
        ...prev,
        teacherEmail: value,
        teacherName: selectedTeacher ? 
          `${selectedTeacher.teacherFName} ${selectedTeacher.teacherLName}` : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleStudentSelection = (e) => {
    // Get all selected options
    const selectedEmails = Array.from(e.target.selectedOptions).map(option => option.value);
    
    // Add new selections to existing enrolledStudentsEmail array
    setFormData(prev => ({
      ...prev,
      enrolledStudentsEmail: [...new Set([...(prev.enrolledStudentsEmail || []), ...selectedEmails])]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (modalType === 'teacher') {
      if (!formData.teacherFName?.trim()) newErrors.teacherFName = 'First name is required';
      if (!formData.teacherLName?.trim()) newErrors.teacherLName = 'Last name is required';
      if (!formData.teacherEmail?.trim()) newErrors.teacherEmail = 'Email is required';
      if (!formData.specialization?.trim()) newErrors.specialization = 'Specialization is required';
      if (!formData.yearsTeaching?.toString().trim()) newErrors.yearsTeaching = 'Years teaching is required';
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.teacherEmail && !emailRegex.test(formData.teacherEmail.trim())) {
        newErrors.teacherEmail = 'Invalid email format';
      }
    } else {
      if (!formData.courseName?.trim()) newErrors.courseName = 'Course name is required';
      if (!formData.edpCode?.trim()) newErrors.edpCode = 'EDP code is required';
      if (!formData.courseDescription?.trim()) newErrors.courseDescription = 'Description is required';
      if (!formData.teacherEmail?.trim()) newErrors.teacherEmail = 'Teacher email is required';
      
      // Validate enrolled students
      if (formData.enrolledStudentsEmail?.length > 1) {
        newErrors.enrolledStudentsEmail = 'Only one student can be enrolled';
      }

      // Check for duplicate email
      const existingCourse = courses.find(course => 
        course.id !== formData.id && // Exclude current course when editing
        course.enrolledStudentsEmail?.includes(formData.enrolledStudentsEmail?.[0])
      );
      
      if (existingCourse) {
        newErrors.enrolledStudentsEmail = 'This student is already enrolled in another course';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  const handleTeacherSelection = (e) => {
    const value = e.target.value;
    // Allow deselecting teacher by selecting the empty option
    setFormData(prev => ({
      ...prev,
      teacherEmail: value,
      teacherName: value ? teachers.find(t => t.teacherEmail === value)?.teacherFName : ''
    }));
  };

  const handleRemoveStudent = (emailToRemove) => {
    setFormData(prev => ({
      ...prev,
      enrolledStudentsEmail: prev.enrolledStudentsEmail.filter(email => email !== emailToRemove)
    }));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{data ? `Edit ${modalType === 'teacher' ? 'Teacher' : 'Subject'}` : `Add New ${modalType === 'teacher' ? 'Teacher' : 'Subject'}`}</h2>
          <button className="close-button" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={`form-layout ${modalType}-form`}>
          {modalType === 'teacher' ? (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name*</label>
                  <input
                    type="text"
                    name="teacherFName"
                    value={formData.teacherFName}
                    onChange={handleChange}
                    className={errors.teacherFName ? 'error' : ''}
                  />
                  {errors.teacherFName && <span className="error">{errors.teacherFName}</span>}
                </div>

                <div className="form-group middle-initial">
                  <label>M.I.</label>
                  <input
                    type="text"
                    name="teacherMName"
                    value={formData.teacherMName}
                    onChange={handleChange}
                    maxLength="1"
                  />
                </div>

                <div className="form-group">
                  <label>Last Name*</label>
                  <input
                    type="text"
                    name="teacherLName"
                    value={formData.teacherLName}
                    onChange={handleChange}
                    className={errors.teacherLName ? 'error' : ''}
                  />
                  {errors.teacherLName && <span className="error">{errors.teacherLName}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email*</label>
                  <input
                    type="email"
                    name="teacherEmail"
                    value={formData.teacherEmail}
                    onChange={handleChange}
                    className={errors.teacherEmail ? 'error' : ''}
                  />
                  {errors.teacherEmail && <span className="error">{errors.teacherEmail}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Specialization*</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className={errors.specialization ? 'error' : ''}
                  />
                  {errors.specialization && <span className="error">{errors.specialization}</span>}
                </div>

                <div className="form-group">
                  <label>Years Teaching*</label>
                  <input
                    type="number"
                    name="yearsTeaching"
                    value={formData.yearsTeaching}
                    onChange={handleChange}
                    min="0"
                    className={errors.yearsTeaching ? 'error' : ''}
                  />
                  {errors.yearsTeaching && <span className="error">{errors.yearsTeaching}</span>}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Course Name*</label>
                  <input
                    type="text"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleChange}
                    className={errors.courseName ? 'error' : ''}
                    placeholder="Enter course name"
                  />
                  {errors.courseName && <span className="error">{errors.courseName}</span>}
                </div>

                <div className="form-group">
                  <label>EDP Code*</label>
                  <input
                    type="text"
                    name="edpCode"
                    value={formData.edpCode}
                    onChange={handleChange}
                    className={errors.edpCode ? 'error' : ''}
                    placeholder="Enter EDP code"
                  />
                  {errors.edpCode && <span className="error">{errors.edpCode}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Description*</label>
                <textarea
                  name="courseDescription"
                  value={formData.courseDescription}
                  onChange={handleChange}
                  className={errors.courseDescription ? 'error' : ''}
                  rows="3"
                  placeholder="Enter course description"
                />
                {errors.courseDescription && <span className="error">{errors.courseDescription}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="dropdown-label">Assign Teacher</label>
                  <div className="custom-dropdown">
                    <select
                      name="teacherEmail"
                      value={formData.teacherEmail || ''}
                      onChange={handleTeacherSelection}
                      className={`dropdown-select ${errors.teacherEmail ? 'error' : ''}`}
                    >
                      <option value="">Select a teacher</option>
                      {teachers.map(teacher => (
                        <option 
                          key={teacher.id} 
                          value={teacher.teacherEmail}
                        >
                          {`${teacher.teacherFName} ${teacher.teacherLName} (${teacher.teacherEmail})`}
                        </option>
                      ))}
                    </select>
                    <span className="dropdown-arrow">▼</span>
                  </div>
                  {errors.teacherEmail && <span className="error-message">{errors.teacherEmail}</span>}
                </div>

                <div className="form-group">
                  <label>Year</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    min={new Date().getFullYear()}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-section">
                <div className="form-group">
                  <label className="dropdown-label">
                    Currently Enrolled Students ({formData.enrolledStudentsEmail?.length || 0})
                  </label>
                  <div className="custom-dropdown">
                    <select 
                      multiple 
                      className="dropdown-select multiple"
                      value={formData.enrolledStudentsEmail || []}
                      onChange={(e) => {
                        const selectedEmails = Array.from(e.target.selectedOptions).map(opt => opt.value);
                        setFormData(prev => ({
                          ...prev,
                          enrolledStudentsEmail: selectedEmails
                        }));
                      }}
                    >
                      {formData.enrolledStudentsEmail?.map(email => {
                        const student = students.find(s => s.email === email);
                        return (
                          <option key={email} value={email}>
                            {student ? `${student.firstName} ${student.lastName} (${email})` : email}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <button
                    type="button"
                    className="remove-selected-btn"
                    onClick={() => {
                      const select = document.querySelector('.dropdown-select.multiple');
                      const selectedOptions = Array.from(select.selectedOptions);
                      const emailsToRemove = selectedOptions.map(opt => opt.value);
                      setFormData(prev => ({
                        ...prev,
                        enrolledStudentsEmail: prev.enrolledStudentsEmail.filter(
                          email => !emailsToRemove.includes(email)
                        )
                      }));
                    }}
                  >
                    Remove Selected Students
                  </button>
                </div>

                {/* Add Students Section */}
                <div className="form-group">
                  <label className="dropdown-label">Add Students</label>
                  <div className="custom-dropdown">
                    <select
                      multiple
                      className="dropdown-select multiple"
                      onChange={handleStudentSelection}
                    >
                      {students
                        .filter(student => !formData.enrolledStudentsEmail?.includes(student.email))
                        .map(student => (
                          <option key={student.id} value={student.email}>
                            {`${student.firstName} ${student.lastName} (${student.email})`}
                          </option>
                        ))
                      }
                    </select>
                  </div>
                  <span className="helper-text">Hold Ctrl/Cmd to select multiple students</span>
                </div>
              </div>
            </>
          )}

          <div className="modal-actions">
            <button 
              className="secondary-button" 
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button 
              className="primary-button" 
              onClick={() => onSave(formData)}
              disabled={!hasChanges}
              type="button"
            >
              {data ? 'Save Changes' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HubAdmin_Classroom;

