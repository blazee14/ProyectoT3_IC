const config = {
    server: 'localhost\\BLAZE',
    database: 'regMedic',
    user: 'sa', // Cambia por tu usuario SQL Server
    password: '1409', // Cambia por tu contraseña
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};
exports.config = config;
