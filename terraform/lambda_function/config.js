const DB_CONFIG = {
    host: process.env.DB_HOST,       // Database host
    port: process.env.DB_PORT,       // Database port
    user: process.env.DB_USER,       // Database user
    password: process.env.DB_PASS,   // Database password
    database: process.env.DB_NAME,    // Database name
    ssl: {
        rejectUnauthorized: false, // Use false unless you have a custom CA certificate
      },
    LLAMA_API_KEY: process.env.LLAMA_API_KEY,  
};

export default DB_CONFIG;



