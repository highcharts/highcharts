import type Highcharts from 'highcharts/es-modules/masters/highcharts.src.js';

export type HighchartsWithTemplating = typeof Highcharts & {
    Templating: { helpers: Record<string, (...args: unknown[]) => unknown> };
};
