import sql from 'mssql';

const config: sql.config = {
    user: 'sa',
    password: 'ed308',
    server: 'localhost',
    database: 'Cinema',
    options: {
        cryptoCredentialsDetails: {
            minVersion: 'TLSv1'
        },
        trustServerCertificate: true
    }
}

export default config;