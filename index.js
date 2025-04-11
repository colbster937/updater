import express from 'express';
import cors from 'cors';
import config from './src/config.js';
import { updateRepo } from './src/functions.js';
import { Logger } from './src/logger.js';
import router from './src/routes.js';

await updateRepo();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('data'));
app.use('/updater', router);

const port = config.port || 8070;

app.listen(port, () => {
    Logger.info(`Server is running on port ${port}`);
});
