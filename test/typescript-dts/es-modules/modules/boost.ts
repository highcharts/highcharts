import Highcharts from 'highcharts/es-modules/masters/highcharts.src.js';
import 'highcharts/es-modules/masters/modules/boost.src.js';

const chart = Highcharts.chart('container', {});

// Highcharts.Chart should be composed with boost functions:
chart.isChartSeriesBoosting(chart);
