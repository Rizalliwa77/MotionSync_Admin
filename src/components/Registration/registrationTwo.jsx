import React, { useState } from 'react';
import { doc, setDoc, collection } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../firebase/firebaseConfig";
import "../../assets/Registration/registrationTwo.css";
import MotionSyncLogo from "../../assets/media/motionsync.png";
import { useNavigate } from 'react-router-dom';

const RegistrationTwo = () => {
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([
    { name: '', modeOfDelivery: '', overview: '' }
  ]);

  const [educators, setEducators] = useState([
    { name: '', position: '', qualifications: '', yearsOfExperience: '' }
  ]);

  const [developmentPrograms, setDevelopmentPrograms] = useState(['']);
  const [selectedFiles, setSelectedFiles] = useState({
    curriculum: null,
    certifications: {}
  });

  const [errors, setErrors] = useState({
    programs: [],
    educators: [],
    developmentPrograms: []
  });

  const handleProgramChange = (index, field, value) => {
    const newPrograms = [...programs];
    newPrograms[index][field] = value;
    setPrograms(newPrograms);
  };

  const handleEducatorChange = (index, field, value) => {
    const newEducators = [...educators];
    newEducators[index][field] = value;
    setEducators(newEducators);
  };

  const handleDevelopmentProgramChange = (index, value) => {
    const newPrograms = [...developmentPrograms];
    newPrograms[index] = value;
    setDevelopmentPrograms(newPrograms);
  };

  const addProgram = () => {
    setPrograms([...programs, { name: '', modeOfDelivery: '', overview: '' }]);
  };

  const addEducator = () => {
    setEducators([...educators, { name: '', position: '', qualifications: '', yearsOfExperience: '' }]);
  };

  const addDevelopmentProgram = () => {
    setDevelopmentPrograms([...developmentPrograms, '']);
  };

  const handleFileSelect = (type, educatorIndex = null) => (event) => {
    const file = event.target.files[0];
    if (file) {
      if (type === 'curriculum') {
        setSelectedFiles(prev => ({ ...prev, curriculum: file }));
      } else if (type === 'certification') {
        setSelectedFiles(prev => ({
          ...prev,
          certifications: {
            ...prev.certifications,
            [educatorIndex]: file
          }
        }));
      }
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      programs: [],
      educators: [],
      developmentPrograms: []
    };

    // Validate programs
    programs.forEach((program, index) => {
      const programErrors = {};
      if (!program.name.trim()) {
        programErrors.name = 'Program name is required';
        isValid = false;
      }
      if (!program.modeOfDelivery) {
        programErrors.modeOfDelivery = 'Mode of delivery is required';
        isValid = false;
      }
      if (!program.overview.trim()) {
        programErrors.overview = 'Program overview is required';
        isValid = false;
      }
      newErrors.programs[index] = programErrors;
    });

    // Validate educators
    educators.forEach((educator, index) => {
      const educatorErrors = {};
      if (!educator.name.trim()) {
        educatorErrors.name = 'Educator name is required';
        isValid = false;
      }
      if (!educator.position.trim()) {
        educatorErrors.position = 'Position is required';
        isValid = false;
      }
      if (!educator.qualifications.trim()) {
        educatorErrors.qualifications = 'Qualifications are required';
        isValid = false;
      }
      if (!educator.yearsOfExperience.trim()) {
        educatorErrors.yearsOfExperience = 'Years of experience is required';
        isValid = false;
      }
      newErrors.educators[index] = educatorErrors;
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const storage = getStorage();
      let curriculumUrl = null;
      let certificationUrls = {};

      // Upload program curriculum if exists
      if (selectedFiles.curriculum) {
        const curriculumRef = ref(storage, `program_curriculum/${selectedFiles.curriculum.name}`);
        await uploadBytes(curriculumRef, selectedFiles.curriculum);
        curriculumUrl = await getDownloadURL(curriculumRef);
      }

      // Upload educator certifications
      for (const [index, file] of Object.entries(selectedFiles.certifications)) {
        const certRef = ref(storage, `educator_certifications/${educators[index].name}_${file.name}`);
        await uploadBytes(certRef, file);
        certificationUrls[index] = await getDownloadURL(certRef);
      }

      // Save to Firestore with proper structure
      const form2Ref = doc(collection(db, "register"), "Form 2");
      
      // Create Program Information subcollection
      const programsCollectionRef = collection(form2Ref, "Form 2.1");
      const programInfoDoc = doc(programsCollectionRef, "Program Information");
      await setDoc(programInfoDoc, {
        programs: programs.map(program => ({
          programName: program.name,
          modeOfDelivery: program.modeOfDelivery,
          programOverview: program.overview
        })),
        curriculumUrl: curriculumUrl
      });

      // Create Educator Information subcollection
      const educatorInfoDoc = doc(programsCollectionRef, "Educator Information");
      await setDoc(educatorInfoDoc, {
        educators: educators.map((educator, index) => ({
          name: educator.name,
          position: educator.position,
          qualifications: educator.qualifications,
          yearsOfExperience: educator.yearsOfExperience,
          certificationUrl: certificationUrls[index] || null
        }))
      });

      console.log("Form 2 data saved successfully");
      navigate('/registration-three');
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const removeProgram = (indexToRemove) => {
    if (programs.length > 1) {
      setPrograms(programs.filter((_, index) => index !== indexToRemove));
      // Also remove any errors for this program
      setErrors(prev => ({
        ...prev,
        programs: prev.programs.filter((_, index) => index !== indexToRemove)
      }));
    }
  };

  const removeEducator = (indexToRemove) => {
    if (educators.length > 1) {
      setEducators(educators.filter((_, index) => index !== indexToRemove));
      // Remove certification file if exists
      if (selectedFiles.certifications[indexToRemove]) {
        const newCertifications = { ...selectedFiles.certifications };
        delete newCertifications[indexToRemove];
        setSelectedFiles(prev => ({
          ...prev,
          certifications: newCertifications
        }));
      }
      // Remove errors for this educator
      setErrors(prev => ({
        ...prev,
        educators: prev.educators.filter((_, index) => index !== indexToRemove)
      }));
    }
  };

  const removeCurriculumFile = () => {
    setSelectedFiles(prev => ({
      ...prev,
      curriculum: null
    }));
  };

  const removeCertificationFile = (index) => {
    setSelectedFiles(prev => ({
      ...prev,
      certifications: {
        ...prev.certifications,
        [index]: null
      }
    }));
  };

  return (
    <>
      <div className="white-background"></div>
      <div className="registration-container">
        <div className="header-container">
          <img src={MotionSyncLogo} alt="MotionSync Logo" className="motionsync-logo" />
          <h1>PROGRAMS AND EDUCATORS INFORMATION</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <section>
            <h2>Educational Programs Overview</h2>
            <p className="section-description">Please input all the available programs and courses in your hub here.</p>

            <div className="programs-container">
              {programs.map((program, index) => (
                <div key={index} className="program-entry">
                  <div className="entry-header">
                    <h3>Program {index + 1}</h3>
                    {programs.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeProgram(index)}
                        className="remove-button"
                        aria-label="Remove program"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Sign Language Program/Course Name"
                      value={program.name}
                      onChange={(e) => handleProgramChange(index, 'name', e.target.value)}
                      className={errors.programs[index]?.name ? 'error' : ''}
                    />
                    {errors.programs[index]?.name && (
                      <span className="error-message">{errors.programs[index].name}</span>
                    )}
                    <div className="select-wrapper">
                      <select
                        value={program.modeOfDelivery}
                        onChange={(e) => handleProgramChange(index, 'modeOfDelivery', e.target.value)}
                        className={errors.programs[index]?.modeOfDelivery ? 'error' : ''}
                      >
                        <option value="">Mode of Delivery</option>
                        <option value="online">Online</option>
                        <option value="inPerson">In Person</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                      <span className="more-options">⋮</span>
                    </div>
                  </div>
                  <textarea
                    placeholder="Program Overview"
                    value={program.overview}
                    onChange={(e) => handleProgramChange(index, 'overview', e.target.value)}
                    className={errors.programs[index]?.overview ? 'error' : ''}
                  />
                </div>
              ))}
            </div>

            <button type="button" onClick={addProgram} className="add-button">
              Add more courses
            </button>

            <div className="file-upload">
              <input
                type="file"
                onChange={handleFileSelect('curriculum')}
                id="curriculum-upload"
                accept=".pdf,.doc,.docx"
              />
              <label htmlFor="curriculum-upload">
                {selectedFiles.curriculum ? (
                  <div className="file-selected">
                    <span>{selectedFiles.curriculum.name}</span>
                    <button 
                      type="button" 
                      onClick={removeCurriculumFile}
                      className="remove-file-button"
                      aria-label="Remove file"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  "Upload Program Curriculum (If applicable)"
                )}
              </label>
            </div>
          </section>

          <section>
            <h2>Educator/s Information</h2>
            <div className="educators-table">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Educator Name</th>
                    <th>Position</th>
                    <th>Qualifications/Certifications</th>
                    <th>Years of Experience</th>
                  </tr>
                </thead>
                <tbody>
                  {educators.map((educator, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <input
                          type="text"
                          value={educator.name}
                          onChange={(e) => handleEducatorChange(index, 'name', e.target.value)}
                          className={errors.educators[index]?.name ? 'error' : ''}
                        />
                        {errors.educators[index]?.name && (
                          <span className="error-message">{errors.educators[index].name}</span>
                        )}
                      </td>
                      <td><input type="text" value={educator.position} onChange={(e) => handleEducatorChange(index, 'position', e.target.value)} /></td>
                      <td><input type="text" value={educator.qualifications} onChange={(e) => handleEducatorChange(index, 'qualifications', e.target.value)} /></td>
                      <td><input type="text" value={educator.yearsOfExperience} onChange={(e) => handleEducatorChange(index, 'yearsOfExperience', e.target.value)} /></td>
                      <td>
                        {educators.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => removeEducator(index)}
                            className="remove-button"
                            aria-label="Remove educator"
                          >
                            ×
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button type="button" onClick={addEducator} className="add-button">
              Add more educators
            </button>

            {educators.map((educator, index) => (
              <div key={index} className="certification-upload">
                <input
                  type="file"
                  onChange={handleFileSelect('certification', index)}
                  id={`certification-${index}`}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <label htmlFor={`certification-${index}`}>
                  <div className="file-label-content">
                    <span>
                      {selectedFiles.certifications[index] 
                        ? selectedFiles.certifications[index].name 
                        : `Upload Certification Documents for Educator ${index + 1}`}
                    </span>
                    {selectedFiles.certifications[index] && (
                      <button 
                        type="button" 
                        onClick={() => removeCertificationFile(index)}
                        className="remove-file-button"
                        aria-label="Remove file"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </label>
              </div>
            ))}
          </section>

          <section>
            <h2>Professional Development Programs for Educators (if any):</h2>
            {developmentPrograms.map((program, index) => (
              <textarea
                key={index}
                placeholder="Describe any ongoing training or development programs for your educators"
                value={program}
                onChange={(e) => handleDevelopmentProgramChange(index, e.target.value)}
              />
            ))}

            <button type="button" onClick={addDevelopmentProgram} className="add-button">
              Add more
            </button>
          </section>

          <div className="footer-navigation">
            <button type="submit">2/4 | Continue register ➔</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegistrationTwo;
