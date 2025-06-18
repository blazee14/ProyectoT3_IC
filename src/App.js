import { useState, useEffect } from 'react';
import LoginForm from './components/Auth/LoginForm';
import PatientLogin from './components/Auth/PatientLogin';
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
  }, []);

  const handlePatientLogin = (credentials) => {
    // Simulación de autenticación
    setPatientData({
      id: 1,
      name: 'Juan Pérez',
      username: credentials.username
    });
    setIsPatient(true);
  };

  const handlePatientLogout = () => {
    setIsPatient(false);
    setPatientData(null);
  };

  if (isPatient) {
    return <PatientDashboard patientData={patientData} onLogout={handlePatientLogout} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {userType ? (
        <>
          <Navbar />
          {userType === 'doctor' ? <DoctorDashboard /> : <AdminDashboard />}
        </>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col md:flex-row gap-8 p-4">
            <LoginForm />
            <PatientLogin onLogin={handlePatientLogin} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

// DONE