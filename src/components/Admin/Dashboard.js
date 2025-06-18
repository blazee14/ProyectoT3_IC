import React, { useState } from 'react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Dr. Roberto Sánchez', email: 'roberto@meditrack.com', role: 'doctor', status: 'active' },
    { id: 2, name: 'Dra. Ana Martínez', email: 'ana@meditrack.com', role: 'doctor', status: 'active' },
    { id: 3, name: 'Admin Principal', email: 'admin@meditrack.com', role: 'admin', status: 'active' },
  ]);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'doctor',
    password: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) {
      return;
    }
    
    const userToAdd = {
      ...newUser,
      id: users.length + 1,
      status: 'active'
    };
    
    setUsers([...users, userToAdd]);
    setNewUser({
      name: '',
      email: '',
      role: 'doctor',
      password: ''
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Panel de Administración</h1>
      
      {showSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg">
          Usuario creado exitosamente!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Agregar Nuevo Usuario</h2>
          <form onSubmit={handleAddUser}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Nombre Completo</label>
              <input
                type="text"
                name="name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newUser.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newUser.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Tipo de Usuario</label>
              <select
                name="role"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newUser.role}
                onChange={handleInputChange}
              >
                <option value="doctor">Doctor</option>
                <option value="admin">Administrador</option>
                <option value="patient">Paciente</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Contraseña Temporal</label>
              <input
                type="password"
                name="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newUser.password}
                onChange={handleInputChange}
                required
                minLength="6"
              />
              <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Agregar Usuario
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Usuarios Registrados</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Correo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.role === 'doctor' ? 'Doctor' : 
                       user.role === 'admin' ? 'Administrador' : 'Paciente'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">Editar</button>
                      <button className="text-red-600 hover:text-red-800">Desactivar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;