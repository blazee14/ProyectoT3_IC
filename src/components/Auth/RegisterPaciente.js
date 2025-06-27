import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPaciente = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    usuario: '',
    clave: '',
    nombres: '',
    apellidos: '',
    dni: '',
    telefono: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const { usuario, clave, nombres, apellidos, dni, telefono } = form;

  const paciente = {
    usuario,
    clave,
    nombres,
    apellidos,
    dni,
    telefono
  };

  try {
    const response = await fetch('http://localhost:5000/api/pacientes/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paciente)
    });

    const data = await response.json();

    if (response.ok) {
      alert('Paciente registrado exitosamente');
      navigate('/'); // Redirige al login
    } else {
      alert('Error al registrar: ' + data.error);
    }
  } catch (error) {
    console.error('Error al registrar paciente:', error);
    alert('Hubo un problema al registrar el paciente');
  }
};


  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Registro de Paciente</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="usuario" placeholder="Nombre de usuario" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input type="password" name="clave" placeholder="Contraseña" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input type="text" name="nombres" placeholder="Nombres" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input type="text" name="apellidos" placeholder="Apellidos" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input type="text" name="dni" placeholder="DNI" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input type="text" name="telefono" placeholder="Teléfono" className="w-full p-2 border rounded" onChange={handleChange} required />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Registrarse
        </button>
      </form>
      <button onClick={() => navigate('/')} className="mt-4 text-sm text-blue-600 hover:underline block text-center">
        ← Volver al login
      </button>
    </div>
  );
};

export default RegisterPaciente;
