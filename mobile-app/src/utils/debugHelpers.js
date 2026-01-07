// Debug utility for development
function debugHelper(msg) {
    console.log('[DEBUG]:', msg);
    console.log('[TIMESTAMP]:', new Date().toISOString());
}

function logPerformance(label, data) {
    console.time(label);
    console.log('Data:', data);
    console.timeEnd(label);
}

const devMode = true;

module.exports = { debugHelper, logPerformance, devMode };
