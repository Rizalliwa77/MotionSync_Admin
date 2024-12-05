import React, { useState, useEffect } from 'react';
import { getFirestore, doc, setDoc, collection, getDocs, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
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

  const SCHOOL_ID = '7kJvkewDYT1hTRKieGcQ'; // Your school ID

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
    setModalData(item);
    setModalType(type);
    setShowModal(true);
    setEditingId(item.id);
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
    try {
      if (modalType === 'teacher') {
        const teacherData = {
          teacherId: generateStaticId(), // Use static ID generator
          teacherFName: formData.firstName.trim(),
          teacherMName: formData.middleInitial ? formData.middleInitial.trim() : '',
          teacherLName: formData.lastName.trim(),
          teacherEmail: formData.email.trim(),
          teacherGender: formData.gender,
          specialization: formData.specialization.trim(),
          yearsTeaching: formData.yearsOfTeaching.toString(),
        };

        const teachersRef = collection(db, `schools/7kJvkewDYT1hTRKieGcQ/teacher`);
        const docRef = await addDoc(teachersRef, teacherData);
        
        setTeachers(prevTeachers => [
          ...prevTeachers,
          { id: docRef.id, ...teacherData }
        ]);

      } else if (modalType === 'subject') {
        const subjectData = {
          courseId: generateStaticId(), // Use static ID generator
          courseName: formData.courseName.trim(),
          edpCode: formData.edpCode.trim(),
          courseDescription: formData.courseDescription.trim(),
          teacherEmail: formData.teacherEmail.trim(),
          year: formData.year.toString(),
          enrolledStudentsEmail: formData.enrolledStudentsEmail || []
        };

        const subjectsRef = collection(db, `schools/7kJvkewDYT1hTRKieGcQ/courses`);
        const docRef = await addDoc(subjectsRef, subjectData);
        
        setCourses(prevCourses => [
          ...prevCourses,
          { id: docRef.id, ...subjectData }
        ]);
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
      alert(`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} added successfully`);
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
          studentId: `#${currentStudentId++}`, // Static ID starting from #110
          firstName: application.firstName,
          lastName: application.lastName,
          email: application.email,
          status: getRandomStatus(), // Random status: 'Active', 'On Leave', or 'Enrolled'
          timestamp: new Date().toISOString(),
          // You can add more fields as needed
        };

        // Add to students collection in Firebase
        const studentsRef = collection(db, `schools/${SCHOOL_ID}/students`);
        await addDoc(studentsRef, studentData);

        // Update local state
        setApplications(applications.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        ));

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
                <span className="material-symbols-outlined">add</span>
                Add New Subject
              </button>
            </div>
            <div className="subjects-grid">
              {courses.map((course) => (
                <div key={course.id} className="subject-card">
                  <div className="subject-header">
                    <h3>{course.courseName}</h3>
                    <span className="course-id">{course.courseId}</span>
                  </div>
                  <div className="subject-details">
                    <p className="edp-code">{course.edpCode}</p>
                    <p className="description">{course.courseDescription}</p>
                    <div className="stats">
                      <div className="stat">
                        <span className="material-symbols-outlined">person</span>
                        <p>Teacher: {course.teacherEmail}</p>
                      </div>
                      <div className="stat">
                        <span className="material-symbols-outlined">group</span>
                        <p>{course.enrolledStudentsEmail?.length || 0} Students</p>
                      </div>
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
              ))}
            </div>
          </div>
        );
      
      case 'teachers':
        return (
          <div className="teachers-container">
            <div className="container-header">
              <h2>Teachers</h2>
              <button className="primary-button" onClick={() => handleAdd('teacher')}>
                <span className="material-symbols-outlined">add</span>
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
                    <button 
                      className="icon-button edit"
                      onClick={() => handleEdit(teacher, 'teacher')}
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button 
                      className="icon-button delete"
                      onClick={() => handleDelete(teacher, 'teacher')}
                    >
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

const CourseModal = ({ data, onClose, onSave, modalType }) => {
  const initialTeacherData = {
    teacherId: '',
    firstName: '',
    middleInitial: '',
    lastName: '',
    email: '',
    gender: '',
    specialization: '',
    yearsOfTeaching: '',
  };

  const initialSubjectData = {
    courseId: '',
    courseName: '',
    edpCode: '',
    courseDescription: '',
    teacherEmail: '',
    year: new Date().getFullYear().toString(),
    enrolledStudentsEmail: []
  };

  const initialStudentData = {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    userId: '',
  };

  const [formData, setFormData] = useState(
    data || (modalType === 'teacher' ? initialTeacherData : modalType === 'subject' ? initialSubjectData : initialStudentData)
  );
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      // Teacher validations
      case 'teacherId':
        return value.trim() ? '' : 'Teacher ID is required';
      case 'firstName':
        return value.trim() ? '' : 'First name is required';
      case 'lastName':
        return value.trim() ? '' : 'Last name is required';
      case 'email':
        return value.includes('@') ? '' : 'Valid email is required';
      case 'gender':
        return value ? '' : 'Gender is required';
      case 'specialization':
        return value.trim() ? '' : 'Specialization is required';
      case 'yearsOfTeaching':
        return !isNaN(value) && value >= 0 ? '' : 'Valid years of teaching required';
      
      // Subject validations
      case 'courseId':
        return value.trim() ? '' : 'Course ID is required';
      case 'courseName':
        return value.trim() ? '' : 'Course name is required';
      case 'edpCode':
        return value.trim() ? '' : 'EDP code is required';
      case 'courseDescription':
        return value.trim() ? '' : 'Course description is required';
      case 'teacherEmail':
        return value.includes('@') ? '' : 'Valid teacher email is required';
      case 'year':
        return !isNaN(value) && value >= 0 ? '' : 'Valid year is required';
      
      // Student validations
      case 'email':
        return value.includes('@') ? '' : 'Valid email is required';
      case 'phone':
        return value.length === 10 ? '' : 'Valid phone number is required';
      case 'userId':
        return value.trim() ? '' : 'Student ID is required';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{data ? `Edit ${modalType}` : `Add New ${modalType}`}</h2>
          <button className="close-button" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-layout">
            {modalType === 'teacher' ? (
              <>
                <div className="form-section">
                  <h3>Personal Information</h3>
                  <div className="form-group">
                    <label>Teacher ID*</label>
                    <input
                      type="text"
                      name="teacherId"
                      value={formData.teacherId}
                      onChange={handleChange}
                      placeholder="Enter teacher ID"
                      required
                    />
                    {errors.teacherId && <span className="error">{errors.teacherId}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name*</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter first name"
                        required
                      />
                      {errors.firstName && <span className="error">{errors.firstName}</span>}
                    </div>

                    <div className="form-group middle-initial">
                      <label>M.I.</label>
                      <input
                        type="text"
                        name="middleInitial"
                        value={formData.middleInitial}
                        onChange={handleChange}
                        placeholder="M.I."
                        maxLength="1"
                      />
                    </div>

                    <div className="form-group">
                      <label>Last Name*</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter last name"
                        required
                      />
                      {errors.lastName && <span className="error">{errors.lastName}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Gender*</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    {errors.gender && <span className="error">{errors.gender}</span>}
                  </div>

                  <div className="form-group">
                    <label>Email*</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      required
                    />
                    {errors.email && <span className="error">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-section">
                  <h3>Professional Information</h3>
                  <div className="form-group">
                    <label>Specialization*</label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      placeholder="Enter specialization"
                      required
                    />
                    {errors.specialization && <span className="error">{errors.specialization}</span>}
                  </div>

                  <div className="form-group">
                    <label>Years of Teaching*</label>
                    <input
                      type="number"
                      name="yearsOfTeaching"
                      value={formData.yearsOfTeaching}
                      onChange={handleChange}
                      placeholder="Enter years of teaching"
                      min="0"
                      required
                    />
                    {errors.yearsOfTeaching && <span className="error">{errors.yearsOfTeaching}</span>}
                  </div>
                </div>
              </>
            ) : modalType === 'subject' ? (
              <>
                <div className="form-section">
                  <h3>Course Information</h3>
                  <div className="form-group">
                    <label>Course ID*</label>
                    <input
                      type="text"
                      name="courseId"
                      value={formData.courseId}
                      onChange={handleChange}
                      placeholder="Enter course ID"
                      required
                    />
                    {errors.courseId && <span className="error">{errors.courseId}</span>}
                  </div>

                  <div className="form-group">
                    <label>Course Name*</label>
                    <input
                      type="text"
                      name="courseName"
                      value={formData.courseName}
                      onChange={handleChange}
                      placeholder="Enter course name"
                      required
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
                      placeholder="Enter EDP code"
                      required
                    />
                    {errors.edpCode && <span className="error">{errors.edpCode}</span>}
                  </div>

                  <div className="form-group">
                    <label>Course Description*</label>
                    <textarea
                      name="courseDescription"
                      value={formData.courseDescription}
                      onChange={handleChange}
                      placeholder="Enter course description"
                      rows="4"
                      required
                    />
                    {errors.courseDescription && <span className="error">{errors.courseDescription}</span>}
                  </div>

                  <div className="form-group">
                    <label>Teacher Email*</label>
                    <input
                      type="email"
                      name="teacherEmail"
                      value={formData.teacherEmail}
                      onChange={handleChange}
                      placeholder="Enter teacher's email"
                      required
                    />
                    {errors.teacherEmail && <span className="error">{errors.teacherEmail}</span>}
                  </div>

                  <div className="form-group">
                    <label>Year*</label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      placeholder="Enter year"
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="form-section">
                  <h3>Student Information</h3>
                  <div className="form-group">
                    <label>First Name*</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      required
                    />
                    {errors.firstName && <span className="error">{errors.firstName}</span>}
                  </div>

                  <div className="form-group">
                    <label>Last Name*</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      required
                    />
                    {errors.lastName && <span className="error">{errors.lastName}</span>}
                  </div>

                  <div className="form-group">
                    <label>Email*</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      required
                    />
                    {errors.email && <span className="error">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label>Phone*</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      required
                    />
                    {errors.phone && <span className="error">{errors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label>Student ID*</label>
                    <input
                      type="text"
                      name="userId"
                      value={formData.userId}
                      onChange={handleChange}
                      placeholder="Enter student ID"
                      required
                    />
                    {errors.userId && <span className="error">{errors.userId}</span>}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-button">
              {data ? 'Save Changes' : `Add ${modalType}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HubAdmin_Classroom;

