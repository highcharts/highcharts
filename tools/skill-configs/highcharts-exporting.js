'use strict';
const path = require('node:path');

module.exports = function (repoRoot) {
    return {
        name: 'highcharts-exporting',
        docs: {
            include: [
                'export-module/',
                'react/components/modules/exporting.md',
                'react/getting-started.md',
                'react/bundling-and-tree-shaking.md'
            ],
            exclude: []
        },
        destinations: [
            { path: path.join(repoRoot, 'skills', 'highcharts-exporting') }
        ]
    };
};
