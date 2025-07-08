// logging-middleware/index.js
const axios = require('axios');

const LOG_SERVER_URL = 'http://20.244.56.144/evaluation-service/logs';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhYmhheTAyZGVsaGlAZ21haWwuY29tIiwiZXhwIjoxNzUxOTUxNDUzLCJpYXQiOjE3NTE5NTA1NTMsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI4MDcyYjViZi0xNjMzLTRmZjUtODI4Zi01YWZmYjc5NTkyNTAiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJhYmhheSByYWoiLCJzdWIiOiJiZDczYWUwMC00NDdkLTQwNjQtYWRkNi03MGZkMzRmOGY0ZjQifSwiZW1haWwiOiJhYmhheTAyZGVsaGlAZ21haWwuY29tIiwibmFtZSI6ImFiaGF5IHJhaiIsInJvbGxObyI6IjAwOTc2ODAzMTIyIiwiYWNjZXNzQ29kZSI6IlZQcHNtVCIsImNsaWVudElEIjoiYmQ3M2FlMDAtNDQ3ZC00MDY0LWFkZDYtNzBmZDM0ZjhmNGY0IiwiY2xpZW50U2VjcmV0IjoiWUh4Q2pjUHRaYUNEVXVOciJ9.98MjoPItgzEHXhIEpprFApHfHPt2d3ny4r5wCVYznHk';

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

    const res = await axios.post(
      LOG_SERVER_URL,
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );

    console.log(`[LOG SUCCESS]: ${res.data.message} | ID: ${res.data.logID}`);
  } catch (err) {
    console.error(`[LOG FAILURE]: ${err.response?.data?.message || err.message}`);
  }
}

module.exports = Log;
