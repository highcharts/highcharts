const liveServer = require('live-server');
const path = require('path');
const fs = require('fs');

const distOrigin = path.resolve(__dirname, '..', 'dist');
const distDestin = path.resolve(__dirname, 'sample', 'dist');

console.log(distDestin, distOrigin);

fs.rmSync(distDestin, { recursive: true, force: true });
fs.cpSync(distOrigin, distDestin, { recursive: true });

const params = {
    port: 8080,
    root: path.resolve(__dirname, 'sample'),
    open: true,
    file: 'index.html',
    wait: 500
};

liveServer.start(params);
