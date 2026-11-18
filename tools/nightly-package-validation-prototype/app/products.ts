import type Stock from 'highcharts/highstock';
import type Maps from 'highcharts/highmaps';
import type Gantt from 'highcharts/highcharts-gantt';

export type ProductFactories = [
    typeof Stock.stockChart,
    typeof Maps.mapChart,
    typeof Gantt.ganttChart
];
