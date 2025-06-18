import React, { useState } from 'react';
import PatientDetailsModal from './PatientDetailsModal';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([
    { 
      id: 1, 
      name: 'Juan Pérez', 
      lastVisit: '2023-05-15', 
      status: 'Estable',
      medicalHistory: 'Paciente con hipertensión controlada. Última revisión: presión 120/80. Medicación: Losartan 50mg 1x día.'
    },
    { 
      id: 2, 
      name: 'María García', 
      lastVisit: '2023-05-10', 
      status: 'Mejorando',
      medicalHistory: 'Recuperación post-operatoria de apendicectomía. Herida cicatrizando adecuadamente.'
    },
    { 
      id: 3, 
      name: 'Carlos López', 
      lastVisit: '2023-05-05', 
      status: 'Crítico',
      medicalHistory: 'Paciente diabético con niveles de glucosa elevados (280 mg/dL). Requiere ajuste de medicación.'
    },
  ]);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const handleSavePatient = (id, updatedData) => {
    setPatients(patients.map(patient => 
      patient.id === id ? { ...patient, ...updatedData } : patient
    ));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Panel del Doctor</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Lista de Pacientes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Visita
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {patient.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.lastVisit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      patient.status === 'Crítico' ? 'bg-red-100 text-red-800' :
                      patient.status === 'Estable' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      onClick={() => handleViewPatient(patient)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      Ver
                    </button>
                    <button 
                      onClick={() => handleEditPatient(patient)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedPatient && (
        <PatientDetailsModal
          patient={selectedPatient}
          onClose={handleCloseModal}
          onSave={handleSavePatient}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;

// DONE