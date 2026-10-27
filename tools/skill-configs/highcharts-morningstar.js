'use strict';
const path = require('node:path');

module.exports = function (repoRoot) {
    return {
        name: 'highcharts-morningstar',
        docs: {
            include: ['morningstar/'],
            exclude: []
        },
        destinations: [
            { path: path.join(repoRoot, 'skills', 'highcharts-morningstar') }
        ]
    };
};
