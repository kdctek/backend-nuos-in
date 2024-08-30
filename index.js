const { app } = require('./src/app');
const { database } = require('./src/config/db');
const { logger } = require('./src/shared');
const { port, env } = require('./src/config');
const { seedDB } = require('./src/seeders');
const { mqttBroker } = require('./src/broker');

async function bootstrap() {
  try {
    await database.authenticate().then(() => {
      seedDB();
      logger.info({
        action: 'Database',
        message: `Database connected 🔥 on ${env} mode...`,
      });
    });
    app.listen(port, () => {
      logger.info({
        action: 'Bootstrap',
        message: `Server running 🚀 on port:${port} in ${env} mode...`,
      });
    });
  } catch (error) {
    console.log(error);
    logger.error({
      action: 'Database',
      message: `Database not connected: ${error?.message}`,
    });
    process.exit(1);
  }
}

bootstrap();
mqttBroker();
