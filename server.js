import app from './src/app.js';
import configuration from './src/configuration/configuration.js';
import EmailService from './src/service/email.service.js';
import DatabaseService from './src/service/database.service.js';

const startServer = async () => {
    try {
        await EmailService.connect();
        await DatabaseService.connect();

        // Uppercase the first letter of the environment
        const envCapitalized =
            configuration.env.charAt(0).toUpperCase() +
            configuration.env.slice(1);

        app.listen(configuration.port, () => {
            console.info(
                `${envCapitalized} server started on port ${configuration.port}`
            );
        });
    } catch (error) {
        console.error('Failed to start the server:', error);

        process.exit(1); // Exit the process with failure
    }
};

startServer();
