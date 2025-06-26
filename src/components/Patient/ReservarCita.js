import React, { useState } from 'react';

function ReservarCita() {
  const [fecha, setFecha] = useState('');
  const [idMedico, setIdMedico] = useState('');
  const [motivo, setMotivo] = useState('');

  const idPaciente = 1;
  const idClinica = 1;
  const estado = 'A';
  const numero = Math.floor(Math.random() * 9000) + 1000;

const enviarCita = async () => {

  console.log('📦 id_paciente:', idPaciente);

  const datos = {
    id_paciente: 1,
    id_medico: parseInt(idMedico, 10),
    id_clinica: 1,
    estado:'A',
    fecha,
    motivo,
    numero: 1
  };

   console.log("📩 Datos enviados al backend:", datos);

  try {
    const res = await fetch('http://localhost:5000/api/citas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
  idPaciente: 1,
  idMedico: 1,
  idClinica: 1,
  estado: 'A',
  fecha,
  motivo,
  numero: 1
})
});
    
    const resultado = await res.json();
    if (res.ok) {
      alert('✅ ' + (resultado.mensaje || 'Cita registrada'));
      setFecha('');
      setIdMedico('');
      setMotivo('');
    } else {
      alert('❌ Error: ' + (resultado.error || 'Error al registrar la cita'));
    }
  } catch (error) {
    console.error('Error al conectar:', error);
    alert('❌ No se pudo conectar con el servidor.');
  }
};

  return (
    <div className="p-4 bg-white rounded shadow-md max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Reservar Nueva Cita</h2>

      <label>Fecha de la cita</label>
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />

      <label>Seleccionar Doctor</label>
      <select
        value={idMedico}
        onChange={(e) => setIdMedico(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      >
        <option value="">Seleccione un doctor</option>
        <option value="1">Dr. Rodríguez</option>
        <option value="2">Dra. Gómez</option>
      </select>

      <label>Motivo de la consulta</label>
      <textarea
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
        placeholder="Describa brevemente el motivo de su consulta"
      />

      <button
        onClick={enviarCita}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Reservar Cita
      </button>
    </div>
  );
}

export default ReservarCita;
