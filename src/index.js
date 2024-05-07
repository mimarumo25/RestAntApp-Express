// Importa las configuraciones de la base de datos y la aplicación
import { pool } from './database/database.js'; // Asegúrate de que el nombre del archivo coincida con tu clase de conexión a la base de datos
import app from './app.js';

// Función para verificar la conexión a la base de datos
async function checkDatabaseConnection() {
    try {
        // Intenta obtener una conexión de la piscina de conexiones
        const connection = await pool.getConnection();
        // Libera la conexión
        connection.release();
        console.log('Conexión a la base de datos establecida correctamente.');
        // Si la conexión es exitosa, inicia el servidor
        app.listen(process.env.PORT || 4001, () => {
            console.log(`Servidor escuchando en el puerto: ${process.env.PORT || 4001}`);
        });
    } catch (error) {
        // Si hay un error al conectarse a la base de datos, muestra un mensaje de error
        console.error('Error al conectar con la base de datos:', error);
        console.error('Asegúrate de que la base de datos esté disponible y las credenciales sean correctas.');
        process.exit(1); // Termina el proceso con un código de salida diferente de cero para indicar un error
    }
}

// Llama a la función para verificar la conexión a la base de datos
checkDatabaseConnection();
