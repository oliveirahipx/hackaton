
const { Pool } = require('pg'); // Importa o pacote PostgreSQL

// Configuração da pool de conexões
const pool = new Pool({
    connectionString: 'postgresql://miguel:dQggLdluNKj90DLTK4SGBxaJoAKxhhob@dpg-cte6v568ii6s73b72sq0-a.oregon-postgres.render.com/bdcei',
    ssl: {
        rejectUnauthorized: false, // Necessário para conexões seguras no Render
    },
});

module.exports = pool; // Exporta a pool para ser usada em outras partes da aplicação
