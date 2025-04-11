import { Router } from 'express';
import { getIP, validateData, updateRepo } from './functions.js';
import { Logger } from './logger.js';

const router = Router();

router.post('/webhook', async(req, res) => {
    try {
        const body = req.body;
        const ip = getIP(req);

        Logger.info(`Received request from ${ip}`);

        const data = {
            branch: body.ref?.split('/').pop(),
            message: body.head_commit?.message,
            user: body.head_commit?.author?.username || body.pusher?.name,
            secret: req.headers["x-hub-signature-256"] || null
        }

        for (const [k, v] of Object.entries(data)) {
            if (!v || v === '' || v === null || v === undefined) {
                Logger.warn(`Missing ${k} in request body`);
                return res.sendStatus(400);
            }
        }

        if (!validateData(data, req)) {
            return res.sendStatus(400);
        }

        Logger.info("Request validated successfully!");
        await updateRepo();
        res.sendStatus(200);
    } catch (error) {
        Logger.error(error);
        res.sendStatus(500);
    }
});

export default router;