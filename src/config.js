import fs from 'fs';
import { Logger } from './logger.js';

let config;

const defaultConfig = {
    port: 8080,
    git: {
        branch: 'main',
        secret: 'abcdef123456!@#$%^&*()',
        token: 'abcdefghijklmnopqrstuvwxyz',
        repo: 'https://github.com/example/example.git'
    }
}

function equal(obj1, obj2) {
    return JSON.stringify(obj1, Object.keys(obj1).sort()) === JSON.stringify(obj2, Object.keys(obj2).sort());
}

try {
    if (!fs.existsSync('./config.json') || equal(JSON.parse(fs.readFileSync('./config.json', 'utf-8').trim()), defaultConfig)) {
        fs.writeFileSync('./config.json', JSON.stringify(defaultConfig, null, 4));
        Logger.info("Please update config.json!");
        process.exit(1);
    } else {
        config = JSON.parse(fs.readFileSync('./config.json'));
    }
} catch (err) {
    Logger.severe(`Error loading config.json: ${err.message}`);
}

export default config;