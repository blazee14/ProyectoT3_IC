import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const PatientLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate(); // <-- esta línea falta
  const [validation, setValidation] = useState({
    usernameValid: null,
    passwordValid: null
  });

  // SVG Icons as components
  const UserIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const LockIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  const CheckIcon = ({ valid }) => (
    <svg className={`w-4 h-4 ml-2 ${valid ? 'text-green-500' : 'text-red-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      {valid ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      )}
    </svg>
  );

  const validateField = (name, value) => {
    if (name === 'username') {
      return value.length >= 5;
    }
    if (name === 'password') {
      return value.length >= 6;
    }
    return false;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    setValidation(prev => ({
      ...prev,
      [`${name}Valid`]: validateField(name, value)
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validation.usernameValid || !validation.passwordValid) {
    setError('Por favor completa correctamente todos los campos');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/login/paciente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (response.ok) {
      const data = await response.json();

      // 🔹 Guardar los datos del paciente en localStorage
      localStorage.setItem('paciente', JSON.stringify(data));

      onLogin(data); 
      navigate('/dashboard'); 


    } else {
      const resText = await response.text();
      setError('Credenciales inválidas: ' + resText);
    }
  } catch (error) {
    setError('Error al conectar con el servidor');
    console.error(error);
  }
};

  return (
  <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8">
    <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
      Acceso Pacientes
    </h2>

    {error && (
      <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
        <CheckIcon valid={false} />
        <span className="ml-2">{error}</span>
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-2 flex items-center">
          <UserIcon />
          Usuario
          {validation.usernameValid !== null && (
            <CheckIcon valid={validation.usernameValid} />
          )}
        </label>
        <input
          type="text"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            validation.usernameValid === false
              ? 'border-red-500 focus:ring-red-200'
              : validation.usernameValid
              ? 'border-green-500 focus:ring-green-200'
              : 'border-gray-300 focus:ring-blue-200'
          }`}
          placeholder="Tu nombre de usuario"
        />
        {validation.usernameValid === false && (
          <p className="text-xs text-red-500 mt-1">Mínimo 5 caracteres</p>
        )}
      </div>

      <div>
        <label className="block text-gray-700 mb-2 flex items-center">
          <LockIcon />
          Contraseña
          {validation.passwordValid !== null && (
            <CheckIcon valid={validation.passwordValid} />
          )}
        </label>
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            validation.passwordValid === false
              ? 'border-red-500 focus:ring-red-200'
              : validation.passwordValid
              ? 'border-green-500 focus:ring-green-200'
              : 'border-gray-300 focus:ring-blue-200'
          }`}
          placeholder="Tu contraseña"
        />
        {validation.passwordValid === false && (
          <p className="text-xs text-red-500 mt-1">Mínimo 6 caracteres</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2"
      >
        <LockIcon />
        Ingresar
      </button>
    </form>

    {/* Botón Crear cuenta con separación y centrado */}
    <div className="mt-4 flex justify-center">
      <a
        href="/registro"
        className="w-full text-center bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded-lg shadow"
      >
        Crear cuenta
      </a>
    </div>

    {/* Enlace de olvidaste tu contraseña */}
    <div className="mt-4 text-center">
      <button className="text-blue-600 hover:underline text-sm">
        ¿Olvidaste tu contraseña?
      </button>
    </div>
  </div>
);
}


export default PatientLogin;

// DONE