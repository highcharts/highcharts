'use strict';
const path = require('node:path');

module.exports = function (repoRoot) {
    return {
        name: 'highcharts-react',
        docs: {
            include: ['react/'],
            exclude: []
        },
        destinations: [
            { path: path.join(repoRoot, '.agents', 'skills', 'highcharts-react') },
            { path: path.join(repoRoot, '.claude', 'skills', 'highcharts-react') },
            {
                path: path.resolve(repoRoot, '..', 'highcharts-dist', '.claude', 'skills', 'highcharts-react'),
                requireParent: path.resolve(repoRoot, '..', 'highcharts-dist', 'package.json')
            }
        ],
        skillMd: {
            description: 'Highcharts React `@highcharts/react` components, series components, modules, TypeScript, bundling, chart instances, and Next.js from the bundled docs.',
            title: 'Highcharts React',
            scope: 'Use this for the `@highcharts/react` package: component setup, Chart and series-type components, chart elements, modules, data handling, TypeScript, bundling, chart instances, and Next.js integration.',
            workflow: [
                'Start with `references/docs/index.md` and select every entry that matches the requested React feature.',
                'Read the selected docs before coding; the docs step is complete when every component, module, wrapper API, framework integration, or chart instance behavior you plan to use is covered by docs or named as an API/declaration lookup.',
                'Use local TypeScript declarations or the API reference only for exact signatures and options not covered by the docs.',
                'Drive dynamic chart data and option changes through React state and props; keep static configuration constant. Use chart instance APIs only for behavior that cannot be expressed through components or props.',
                'Use dedicated series and module components and import only what the chart renders. Import a module from `highcharts/es-modules/masters/...` only when no React component exists; load a complete product bundle only when its feature set is required.'
            ],
            boundaries: [
                'For core Highcharts JS concepts such as axes, series behavior, styling, accessibility, exporting, and non-React chart setup, use the `highcharts-js` skill.',
                'For Stock, Maps, Gantt, or Morningstar domain behavior, use the `highcharts-stock`, `highcharts-maps`, `highcharts-gantt`, or `highcharts-morningstar` skill in addition to React wrapper docs.',
                'For custom component wrappers, read `references/docs/react/component-wrapping.md`; keep hooks and state in the parent and pass values through props.',
                'For JSX children inside option components, read `references/docs/react/options-component-format.md` and `references/docs/react/component-children.md`; verify child support and static parsing behavior.',
                'For TypeScript options or refs, read `references/docs/react/typescript.md`; use `ChartOptions` for the `Chart` `options` prop and `HighchartsReactRefObject` for chart refs.',
                'For local chart or container instance access, read `references/docs/react/chart-instance.md` and use a `Chart` ref. For global methods or options, read `references/docs/react/highcharts-instance.md`; global options affect every chart using that instance.',
                'For Next.js or SSR, read `references/docs/react/nextjs.md`. Keep Highcharts imports and rendering in a client component; server code may fetch or stream data into that component but must not instantiate Highcharts.'
            ],
            references: [
                'Live docs: https://www.highcharts.com/docs/react/'
            ]
        }
    };
};
