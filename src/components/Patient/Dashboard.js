import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// SVG Icons
const CalendarIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const PatientDashboard = ({ patientData }) => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [appointmentData, setAppointmentData] = useState({ date: '', doctor: '', reason: '' });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [paciente, setPaciente] = useState(null);
  const [bookedAppointments, setBookedAppointments] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedPaciente = localStorage.getItem('paciente');
    if (storedPaciente) {
      setPaciente(JSON.parse(storedPaciente));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('paciente');
    navigate('/login');
  };

  const doctors = [
    { id: 1, name: 'Dr. Roberto Sánchez', specialty: 'Cardiología', license: 'CMP 12345', available: true },
    { id: 2, name: 'Dra. Ana Martínez', specialty: 'Pediatría', license: 'CMP 54321', available: true },
    { id: 3, name: 'Dr. Carlos López', specialty: 'Ortopedia', license: 'CMP 67890', available: false },
  ];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/citas/paciente/${patientData.id}`);
        if (response.ok) {
          const data = await response.json();
          const citas = data.map(cita => ({
            id: cita.id,
            date: cita.fecha,
            doctor: cita.nombre_medico,
            doctorId: cita.id_medico,
            reason: cita.motivo,
            status: cita.estado === 'A' ? 'Pendiente' : (cita.estado === 'C' ? 'Cancelada' : 'Confirmada')
          }));
          setBookedAppointments(citas);
        } else {
          console.error('Error al cargar citas del backend.');
        }
      } catch (error) {
        console.error('Error de red al obtener citas:', error);
      }
    };

    fetchAppointments();
  }, [patientData.id]);

  const handleAppointmentChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData(prev => ({ ...prev, [name]: value }));
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!appointmentData.date || !appointmentData.doctor) return;

    const selectedDoctor = doctors.find(d => d.id.toString() === appointmentData.doctor);

    const citaPayload = {
      idPaciente: patientData.id,
      idMedico: selectedDoctor.id,
      idClinica: 1,
      fecha: appointmentData.date,
      estado: 'A',
      motivo: appointmentData.reason,
      numero: Math.floor(Math.random() * 9000) + 1000
    };

    try {
      const response = await fetch('http://localhost:5000/api/citas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(citaPayload)
      });

      if (response.ok) {
        const responseData = await response.json();

        const nuevaCita = {
          id: responseData.id,
          date: appointmentData.date,
          doctor: selectedDoctor.name,
          doctorId: selectedDoctor.id,
          reason: appointmentData.reason,
          status: 'Pendiente'
        };

        setBookedAppointments(prev => [...prev, nuevaCita]);

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
        setAppointmentData({ date: '', doctor: '', reason: '' });
      } else {
        alert('Error al registrar la cita.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión con el servidor.');
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailModal(true);
  };

  const handleCancelAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const confirmCancelAppointment = () => {
    if (!selectedAppointment) return;

    const updatedAppointments = bookedAppointments.map(app => 
      app.id === selectedAppointment.id ? { ...app, status: 'Cancelada' } : app
    );

    setBookedAppointments(updatedAppointments);
    setShowCancelModal(false);
    setSelectedAppointment(null);
  };

  const getDoctorInfo = (doctorId) => {
    return doctors.find(d => d.id === doctorId) || {};
  };


  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                {paciente ? `${paciente.nombres} ${paciente.apellidos}` : 'Paciente'}</h1>
                <p className="text-gray-600">Bienvenido a su portal médico</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white rounded-lg shadow p-4">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('appointments')}
                className={`w-full flex items-center px-3 py-2 rounded-lg ${
                  activeTab === 'appointments' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <CalendarIcon className="mr-3" />
                Reservar Cita
              </button>
              <button
                onClick={() => setActiveTab('myAppointments')}
                className={`w-full flex items-center px-3 py-2 rounded-lg ${
                  activeTab === 'myAppointments' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Mis Citas
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-white rounded-lg shadow p-6">
            {activeTab === 'appointments' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Reservar Nueva Cita</h2>
                
                {showSuccess && (
                  <div className="p-4 bg-green-100 text-green-800 rounded-lg flex items-center">
                    <CheckIcon />
                    <span className="ml-2">¡La reserva fue exitosa! Pronto recibirá un correo de confirmación.</span>
                  </div>
                )}

                <form onSubmit={handleBookAppointment} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Fecha de la cita</label>
                    <input
                      type="date"
                      name="date"
                      value={appointmentData.date}
                      onChange={handleAppointmentChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Seleccionar Doctor</label>
                    <select
                      name="doctor"
                      value={appointmentData.doctor}
                      onChange={handleAppointmentChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Seleccione un doctor</option>
                      {doctors.map(doctor => (
                        <option 
                          key={doctor.id} 
                          value={doctor.id}
                          disabled={!doctor.available}
                        >
                          {doctor.name} - {doctor.specialty}
                          {doctor.available ? ' (Disponible)' : ' (No disponible)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Motivo de la consulta</label>
                    <textarea
                      name="reason"
                      rows="3"
                      value={appointmentData.reason}
                      onChange={handleAppointmentChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describa brevemente el motivo de su consulta"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Reservar Cita
                    </button>
                  </div>
                </form>

                <div className="pt-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Doctores Disponibles</h3>
                  <div className="space-y-3">
                    {doctors.map(doctor => (
                      <div key={doctor.id} className="flex items-center p-3 border rounded-lg">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          doctor.available ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <div className="flex-1">
                          <p className="font-medium">{doctor.name}</p>
                          <p className="text-sm text-gray-600">{doctor.specialty}</p>
                        </div>
                        <div className="flex items-center">
                          {doctor.available ? (
                            <>
                              <CheckIcon />
                              <span className="ml-1 text-sm text-green-600">Disponible</span>
                            </>
                          ) : (
                            <>
                              <ClockIcon />
                              <span className="ml-1 text-sm text-yellow-600">No disponible</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'myAppointments' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Mis Citas Reservadas</h2>
                
                {bookedAppointments.length === 0 ? (
                  <div className="bg-gray-50 p-6 rounded-lg text-center">
                    <p className="text-gray-600">No tienes citas reservadas</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookedAppointments.map(appointment => (
                      <div key={appointment.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-blue-50 px-4 py-3 border-b flex justify-between items-center">
                          <h3 className="font-bold text-blue-800">Cita #{appointment.id}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            appointment.status === 'Confirmada' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                            appointment.status === 'Cancelada' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Fecha</p>
                              <p className="font-medium">{appointment.date}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Doctor</p>
                              <p className="font-medium">{appointment.doctor}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Motivo</p>
                              <p className="font-medium">{appointment.reason}</p>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end space-x-2">
                            <button 
                              onClick={() => handleViewDetails(appointment)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Ver detalles
                            </button>
                            {appointment.status !== 'Cancelada' && (
                              <button 
                                onClick={() => handleCancelAppointment(appointment)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Cancelar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="fixed bottom-6 right-6">
        <button 
          onClick={() => setShowLogoutModal(true)}
          className="bg-white p-4 rounded-full shadow-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
          aria-label="Cerrar sesión"
        >
          <LogoutIcon />
        </button>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Cerrar Sesión</h3>
              <button onClick={() => setShowLogoutModal(false)} className="text-gray-500 hover:text-gray-700">
                <CloseIcon />
              </button>
            </div>
            <p className="text-gray-600 mb-6">¿Estás seguro que deseas cerrar tu sesión?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
             <button
              onClick={handleLogout}
               className="text-red-600 hover:underline text-sm ml-4"
>
               Cerrar sesión
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Appointment Detail Modal */}
      {showDetailModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Detalles de la Cita</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-500 hover:text-gray-700">
                <CloseIcon />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Fecha de la cita</p>
                <p className="font-medium">{selectedAppointment.date}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Doctor</p>
                <p className="font-medium">{selectedAppointment.doctor}</p>
                {selectedAppointment.doctorId && (
                  <p className="text-sm text-gray-600">
                    Colegiatura: {getDoctorInfo(selectedAppointment.doctorId).license}
                  </p>
                )}
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Especialidad</p>
                <p className="font-medium">
                  {selectedAppointment.doctorId && getDoctorInfo(selectedAppointment.doctorId).specialty}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Motivo de la consulta</p>
                <p className="font-medium">{selectedAppointment.reason}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedAppointment.status === 'Confirmada' ? 'bg-green-100 text-green-800' :
                  selectedAppointment.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedAppointment.status}
                </span>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Appointment Modal */}
      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Cancelar Cita</h3>
              <button onClick={() => setShowCancelModal(false)} className="text-gray-500 hover:text-gray-700">
                <CloseIcon />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              ¿Estás seguro que deseas cancelar tu cita con {selectedAppointment.doctor} programada para el {selectedAppointment.date}?
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                No, mantener
              </button>
              <button
                onClick={confirmCancelAppointment}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;

// DONE