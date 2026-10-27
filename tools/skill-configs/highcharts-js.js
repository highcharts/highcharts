'use strict';
const path = require('node:path');

module.exports = function (repoRoot) {
    return {
        name: 'highcharts-js',
        docs: {
            include: [
                'getting-started/',
                'chart-concepts/',
                'chart-and-series-types/',
                'chart-design-and-style/',
                'accessibility/accessibility-module-feature-overview.md',
                'advanced-chart-features/boost-module.md',
                'advanced-chart-features/data-sorting.md',
                'advanced-chart-features/highcharts-typescript-declarations.md',
                'advanced-chart-features/internationalization.md',
                'advanced-chart-features/stacking-charts.md'
            ],
            exclude: [
                'react/',
                'stock/',
                'maps/',
                'gantt/',
                'dashboards/',
                'grid/'
            ]
        },
        destinations: [
            { path: path.join(repoRoot, 'skills', 'highcharts-js') }
        ]
    };
};
