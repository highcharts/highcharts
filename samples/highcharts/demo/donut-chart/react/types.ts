import type Highcharts from 'highcharts/es-modules/masters/highcharts.src.js';

export type DonutChartOptions = Highcharts.ChartOptions & {
    custom: { label?: Highcharts.SVGElement };
};
