import crypto from 'crypto';
import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import config from './config.js';
import { Logger } from './logger.js';

function getIP(req) {
    const connectingIP = req.headers['cf-connecting-ip'];
    const forwardedFor = req.headers['x-forwarded-for'];
    const realIP = req.headers['x-real-ip'];
    const directIP = req.connection.remoteAddress || req.socket.remoteAddress;
  
    const ip = connectingIP || forwardedFor || realIP || directIP;
  
    return ip.split(',')[0];
}

function validateData(data, req) {
    const signature = `sha256=${crypto.createHmac("sha256", config.git.secret).update(JSON.stringify(req.body)).digest("hex")}`;
    if (config.git.branch !== "*" && data.branch !== config.git.branch) {
        Logger.warn(`Branch mismatch: expected ${config.git.branch} but got ${data.branch}`);
        return false;
    }
    if (signature !== data.secret) {
        Logger.warn(`Secret mismatch: expected ${signature} but got ${data.secret}`);
        return false;
    }
    return true;
}

async function updateRepo() {
    try {
        const dir = path.join(process.cwd(), "data");
        const repo = `https://${config.git.token}@${config.git.repo}`;
        console.log(repo)
        if (!fs.existsSync(dir)) {
            Logger.info("Cloning repository...");
            execSync(`git clone ${repo} data -b ${config.git.branch} --single-branch`, { stdio: 'ignore' });
            execSync(`git -C ${dir} submodule update --init --recursive`, { stdio: 'ignore' });
        } else {
            Logger.info("Updating repository...");
            execSync(`git -C ${dir} pull --force origin ${config.git.branch}`, { stdio: 'ignore' });
            execSync(`git -C ${dir} reset --hard origin/${config.git.branch}`, { stdio: 'ignore' });
            execSync(`git -C ${dir} submodule update --init --recursive`, { stdio: 'ignore' });
            Logger.info("Repository updated successfully!");
        }
    } catch {
        Logger.error("Failed to update repository!");
    }
}

export { getIP, validateData, updateRepo };