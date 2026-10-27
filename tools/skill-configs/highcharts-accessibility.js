'use strict';
const path = require('node:path');

module.exports = function (repoRoot) {
    return {
        name: 'highcharts-accessibility',
        docs: {
            include: [
                'accessibility/',
                'sonification/',
                'react/components/modules/accessibility.md',
                'react/getting-started.md',
                'react/bundling-and-tree-shaking.md'
            ],
            exclude: []
        },
        destinations: [
            { path: path.join(repoRoot, 'skills', 'highcharts-accessibility') }
        ]
    };
};
