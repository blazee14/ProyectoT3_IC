const sql = require('mssql');

const config = {
    user: 'sa',
    password: '1409',
    server: 'localhost',
    port: 1433,
    database: 'regMedic',
    options: {
        encrypt: false, // desactiva SSL
        trustServerCertificate: true // acepta certificados no confiables
    }
};

sql.connect(config)
    .then(() => {
        console.log('✅ Conectado correctamente a SQL Server');
        return sql.close();
    })
    .catch(err => {
        console.error('❌ Error al conectar a SQL Server:', err);
    });
