const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de conexión
const config = {
  user: 'sa',
  password: '1409', // la que usaste para conectarte correctamente
  server: 'localhost\\BLAZE',
  database: 'regMedic',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};


// Crear conexión
let pool;
sql.connect(config).then((p) => {
  pool = p;
  console.log('✅ Conectado a SQL Server');
}).catch(err => {
  console.error('❌ Error al conectar a SQL Server:', err);
});

app.get('/api/citas/:idPaciente', async (req, res) => {
  try {
    const { idPaciente } = req.params;
    const result = await pool.request()
      .input('idPaciente', sql.Int, idPaciente)
      .query(`
        SELECT C.*, M.nombre AS nombreMedico, M.cmp, M.especialidad
        FROM Cita C
        JOIN Medico M ON C.id_medico = M.id
        WHERE C.id_paciente = @idPaciente
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener citas:', err);
    res.status(500).json({ error: 'Error al obtener citas' });
  }
});

app.post('/api/login/paciente', async (req, res) => {
  const { username, password } = req.body;

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('usuario', sql.VarChar, username)
      .input('clave', sql.VarChar, password)
      .query(`
        SELECT L.id, L.usuario, L.nombres, L.apellidos, P.id AS id_paciente
        FROM Login L
        JOIN Paciente P ON L.id = P.id_login
        WHERE L.usuario = @usuario AND L.clave = @clave AND L.tipo = 'P'
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const paciente = result.recordset[0];
    res.json(paciente);

  } catch (error) {
    console.error('Error al iniciar sesión del paciente:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});


// Ruta para registrar cita
app.post('/api/citas', async (req, res) => {
  const { idPaciente, idMedico, idClinica, fecha, estado, motivo, numero } = req.body;

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('idPaciente', sql.Int, idPaciente)
      .input('idMedico', sql.Int, idMedico)
      .input('idClinica', sql.Int, idClinica)
      .input('fecha', sql.Date, fecha)
      .input('estado', sql.VarChar(1), estado)
      .input('motivo', sql.VarChar(255), motivo)
      .input('numero', sql.Int, numero)
      .query(`
        INSERT INTO Cita (id_paciente, id_medico, id_clinica, fecha, estado, motivo, numero)
        OUTPUT INSERTED.id
        VALUES (@idPaciente, @idMedico, @idClinica, @fecha, @estado, @motivo, @numero)
      `);

    const newId = result.recordset[0].id;
    res.json({ id: newId }); // ✅ Esta línea es clave
    
    console.log('✅ Cita registrada correctamente');  
    res.status(200).json({ message: '✅ Cita registrada correctamente' });
  } catch (error) {
    console.error('❌ Error al registrar cita:', error);
    res.status(500).json({ error: 'Error al registrar cita' });
  }
});

app.post('/api/pacientes/registro', async (req, res) => {
  const { usuario, clave, nombres, apellidos, dni, telefono } = req.body;

  try {
    const pool = await sql.connect(config);

    // Insertar en Login
    const resultLogin = await pool.request()
      .input('usuario', sql.VarChar, usuario)
      .input('clave', sql.VarChar, clave)
      .input('tipo', sql.Char(1), 'P') // Tipo Paciente
      .input('nombres', sql.VarChar, nombres)
      .input('apellidos', sql.VarChar, apellidos)
      .input('dni', sql.VarChar, dni)
      .query(`
        INSERT INTO Login (usuario, clave, tipo, nombres, apellidos, dni)
        OUTPUT INSERTED.id
        VALUES (@usuario, @clave, @tipo, @nombres, @apellidos, @dni)
      `);

    const id_login = resultLogin.recordset[0].id;

    // Insertar en Paciente
    await pool.request()
      .input('id_login', sql.Int, id_login)
      .input('telefono', sql.VarChar, telefono)
      .query(`
        INSERT INTO Paciente (id_login, telefono)
        VALUES (@id_login, @telefono)
      `);

    res.status(201).json({ message: 'Registro exitoso', id_login });
  } catch (error) {
    console.error('Error registrando paciente:', error);
    res.status(500).json({ error: 'Error al registrar paciente' });
  }
});


// Puerto
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
