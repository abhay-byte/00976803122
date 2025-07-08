// index.js
const axios = require('axios');

const LOG_SERVER_URL = 'http://20.244.56.144/evaluation-service/logs';

const allowedStacks = ['frontend', 'backend'];
const allowedLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
const allowedPackages = [
  'auth', 'config', 'middleware', 'utils',
  'cache', 'controller', 'cron_job', 'domain', 'handler', 'repository', 'route', 'service',
  'api', 'component', 'page', 'state', 'style',
];

/**
 * Logs app activity to test server.
 * @param {'frontend' | 'backend'} stack 
 * @param {'debug' | 'info' | 'warn' | 'error' | 'fatal'} level 
 * @param {string} pkg 
 * @param {string} message 
 */
async function Log(stack, level, pkg, message) {
  try {
    if (
      !allowedStacks.includes(stack) ||
      !allowedLevels.includes(level) ||
      !allowedPackages.includes(pkg)
    ) {
      console.warn(`[INVALID LOG PARAMETERS]: ${stack}, ${level}, ${pkg}`);
      return;
    }

    const res = await axios.post(LOG_SERVER_URL, {
      stack,
      level,
      package: pkg,
      message,
    });

    console.log(`[LOG SUCCESS]: ${res.data.message} | ID: ${res.data.logID}`);
  } catch (err) {
    console.error(`[LOG FAILURE]: ${err.message}`);
  }
}

module.exports = Log;
