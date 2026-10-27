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
            { path: path.join(repoRoot, 'skills', 'highcharts-react') }
        ],
        skillMd: {
            description: 'Highcharts React `@highcharts/react` components, series components, modules, TypeScript, bundling, chart instances, and Next.js from the bundled docs.',
            title: 'Highcharts React',
            scope: [
                'Use this for the `@highcharts/react` package: component setup, Chart and series-type components, chart elements, modules, data handling, TypeScript, bundling, chart instances, and Next.js integration.',
                '',
                '## Import example',
                '',
                'Use named imports for `Chart` and chart elements, and dedicated subpaths for series and module components. Import only the components your chart uses.',
                '',
                '```tsx',
                'import { Chart, Title, XAxis, YAxis } from \'@highcharts/react\';',
                'import { ColumnSeries } from \'@highcharts/react/series/Column\';',
                'import { Data } from \'@highcharts/react/modules/Data\';',
                'import { Exporting } from \'@highcharts/react/modules/Exporting\';',
                'import { Accessibility } from \'@highcharts/react/modules/Accessibility\';',
                '```',
                '',
                '`Chart` is a named export from the package root. Module components load their Highcharts modules automatically; render them inside `Chart` without separately importing or calling module initializers. Render series components as direct children of `Chart`.'
            ].join('\n'),
            workflow: [
                'Start with the mixed-series example in `references/docs/react/getting-started.md`; use `references/docs/index.md` to find a guide for a specific integration or unfamiliar behavior.',
                'Read the relevant example or section before implementing it. Use installed TypeScript declarations or the API reference for exact options and signatures.',
                'Build the chart declaratively: use the relevant child component first, including JSX children where supported; use chart-level props or the `options` prop only when no child component expresses the behavior. Drive dynamic values through React state and props. Use chart instance APIs only when neither declarative route works.',
                'Render series as direct children of `Chart`. Prefer dedicated series components; use the generic `Series` component when series are dynamic or a dedicated component is impractical.',
                'Use dedicated series and module components and import only what the chart renders. Import a module from `highcharts/es-modules/masters/...` only when no React component exists; load a complete product bundle only when its feature set is required.'
            ],
            boundaries: [
                'Use companion skills when installed: `highcharts-js` for core chart behavior, or `highcharts-stock`, `highcharts-maps`, `highcharts-gantt`, and `highcharts-morningstar` for their product-specific behavior.',
                'When a companion skill is unavailable, use the installed package declarations and official Highcharts API documentation for the requested product. Continue without requiring companion skill installation.',
                'For custom component wrappers, read `references/docs/react/component-wrapping.md`; keep hooks and state in the parent and pass values through props.',
                'For JSX children inside option components, read `references/docs/react/options-component-format.md` and `references/docs/react/component-children.md`; verify child support and static parsing behavior before preferring children over chart-level options.',
                'For TypeScript options or refs, read `references/docs/react/typescript.md`; use `ChartOptions` for the `Chart` `options` prop and `HighchartsReactRefObject` for chart refs.',
                'For local chart or container instance access, read `references/docs/react/chart-instance.md`; use a `Chart` ref only when the behavior cannot be expressed through child components or chart props/options. For global methods or options, read `references/docs/react/highcharts-instance.md`; global options affect every chart using that instance.',
                'For Next.js App Router/RSC usage, read `references/docs/react/nextjs.md`. Add \'use client\' to files containing Highcharts components or modules; keep Highcharts imports and rendering in the client component. Server code may fetch or stream data into that component but must not instantiate Highcharts.'
            ],
            references: [
                'Live docs: https://www.highcharts.com/docs/react/',
                'API references: https://api.highcharts.com/'
            ]
        }
    };
};
