import chalk from 'chalk';

const colorMappings = {
    log: chalk.green,
    warn: chalk.yellow,
    error: chalk.red
};

function log(msg, type) {
    try {
        const color = colorMappings[type] || chalk.white;
        console[type](`[${chalk.blue(new Date().toLocaleTimeString())}] ${color(msg)}`);
    } catch (error) {
        console.error(`Logging failed: ${error.message}`);
    }
}

class Logger {
    static info(msg) {
        log(msg, "log");
    }
    static warn(msg) {
        log(msg, "warn");
    }
    static error(msg) {
        log(msg, "error");
    }
    static severe(msg) {
        log(`***SEVERE ERROR*** ${msg}`, "error");
        process.exit(1);
    }
}

export { Logger };