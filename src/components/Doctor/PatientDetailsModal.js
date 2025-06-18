import React, { useState } from 'react';

const PatientDetailsModal = ({ patient, onClose, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: patient.name,
    lastVisit: patient.lastVisit,
    status: patient.status,
    medicalHistory: patient.medicalHistory || 'No hay historial médico registrado',
    allergies: patient.allergies || 'Ninguna conocida',
    currentMedication: patient.currentMedication || 'No registrada'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(patient.id, formData);
    setEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              {editing ? 'Editar Historia Clínica' : 'Historia Clínica Completa'}
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium">Nombre Completo</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium">Última Visita</label>
                  <input
                    type="date"
                    name="lastVisit"
                    value={formData.lastVisit}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium">Estado de Salud</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Estable">Estable</option>
                    <option value="Mejorando">Mejorando</option>
                    <option value="Crítico">Crítico</option>
                    <option value="En observación">En observación</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium">Alergias</label>
                  <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">Medicación Actual</label>
                <input
                  type="text"
                  name="currentMedication"
                  value={formData.currentMedication}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Indique dosis y frecuencia"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">Historial Médico</label>
                <textarea
                  name="medicalHistory"
                  rows={8}
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-gray-500">Nombre del Paciente</p>
                  <p className="text-lg font-semibold">{patient.name}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-500">Última Visita</p>
                  <p className="text-lg font-semibold">{patient.lastVisit}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-500">Estado Actual</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    patient.status === 'Crítico' ? 'bg-red-100 text-red-800' :
                    patient.status === 'Estable' ? 'bg-green-100 text-green-800' :
                    patient.status === 'Mejorando' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {patient.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-500">Alergias</p>
                  <p className="text-lg font-semibold">{patient.allergies || 'Ninguna conocida'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-gray-500">Medicación Actual</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800">{patient.currentMedication || 'No registrada'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-gray-500">Historial Médico Completo</p>
                <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-line">
                  {patient.medicalHistory || 'No hay historial médico registrado'}
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  onClick={() => setEditing(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Editar Historia</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsModal;

// DONE