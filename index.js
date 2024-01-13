import { createServer } from 'http';
import './app/helpers/env.load.js';
import logger from './app/helpers/logger.js';
import app from './app/app.js';

const PORT = process.env.PORT ?? 3000;

const server = createServer(app);

server.listen(PORT, () => {
  logger.debug(`Server listening on http://localhost:${PORT}`);
});
