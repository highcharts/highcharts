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
            { path: path.join(repoRoot, '.agents', 'skills', 'highcharts-exporting') },
            { path: path.join(repoRoot, '.claude', 'skills', 'highcharts-exporting') }
        ],
        skillMd: {
            description: '"Highcharts chart exporting: browser-side downloads, printing, data export, fallback behavior, privacy, and optional export-server workflows."',
            title: 'Highcharts Exporting',
            scope: 'Use this for exporting Highcharts charts or data to PNG, JPEG, SVG, PDF, CSV, XLS, or HTML tables; printing charts; configuring client-side export; and evaluating optional server-side rendering.',
            workflow: [
                'Start with `references/docs/index.md` and select the export overview, client-side export, privacy, server setup, rendering, and relevant React docs.',
                'Prefer client-side exporting: PNG, JPEG, and SVG are local by default from v12.3; add offline exporting for local PDF and verify its library and browser requirements.',
                'Check fallback behavior, `exporting.local`, `exporting.fallbackToExportServer`, external images, fonts, and third-party PDF dependencies before promising a fully local export.',
                'Treat server-side export as a separate path. Read the server setup and rendering docs when browser support, batch rendering, automated reports, or privacy requirements justify it.',
                'Use the API reference for exact exporting options and chart methods; the workflow is complete when the chosen format, execution path, fallback, and data-handling implications are documented.'
            ],
            boundaries: [
                'Default to browser-side export guidance; do not imply that every format or browser export remains local.',
                'For PDF, images, older browsers, or missing client-side dependencies, account for documented fallback-to-server behavior.',
                'For the public export server, read its terms, fair-use, security, and temporary PDF-storage disclosures before sending chart data.',
                'Prefer the current Node export server documentation; legacy PhantomJS, Java, and PHP server material is deprecated reference material.',
                'For React component syntax and bundling, use the React exporting and bundling docs alongside this skill; for general chart options and non-export modules, use `highcharts-js`.'
            ],
            references: [
                'Live docs: https://www.highcharts.com/docs/export-module/export-module-overview',
                'Client-side export: https://www.highcharts.com/docs/export-module/client-side-export',
                'API reference: https://api.highcharts.com/highcharts/exporting',
                'Export server terms and privacy: https://www.highcharts.com/docs/export-module/privacy-disclaimer-export',
                'Node export server: https://github.com/highcharts/node-export-server',
                'React exporting: https://www.highcharts.com/docs/react/components/modules/exporting',
                'React bundling: https://www.highcharts.com/docs/react/bundling-and-tree-shaking'
            ]
        }
    };
};
