import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginForm from './components/Auth/LoginForm';
import PatientLogin from './components/Auth/PatientLogin';
import RegisterPaciente from './components/Auth/RegisterPaciente';
import Navbar from './components/Layout/Navbar';
import DoctorDashboard from './components/Doctor/Dashboard';
import AdminDashboard from './components/Admin/Dashboard';
import PatientDashboard from './components/Patient/Dashboard';

const App = () => {
  const [userType, setUserType] = useState(null);
  const [isPatient, setIsPatient] = useState(false);
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType');
    if (storedUserType) {
      setUserType(storedUserType);
    }

    const storedPaciente = localStorage.getItem('paciente');
    if (storedPaciente) {
      setPatientData(JSON.parse(storedPaciente));
      setIsPatient(true);
    }
  }, []);

  const handlePatientLogin = (data) => {
  setPatientData(data);
  setIsPatient(true);
  localStorage.setItem('paciente', JSON.stringify(data));
};


  const handlePatientLogout = () => {
    setIsPatient(false);
    setPatientData(null);
    localStorage.removeItem('paciente');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route
            path="/"
            element={
              <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col md:flex-row gap-8 p-4">
                  <LoginForm />
                  <PatientLogin onLogin={handlePatientLogin} />
                </div>
              </div>
            }
          />
          <Route path="/registro" element={<RegisterPaciente />} />
          <Route
            path="/dashboard"
            element={
              isPatient ? (
                <PatientDashboard patientData={patientData} onLogout={handlePatientLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/admin"
            element={
              userType === 'admin' ? (
                <>
                  <Navbar />
                  <AdminDashboard />
                </>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/doctor"
            element={
              userType === 'doctor' ? (
                <>
                  <Navbar />
                  <DoctorDashboard />
                </>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
