import Highcharts from 'highcharts/es-modules/masters/highcharts.src.js';
import 'highcharts/es-modules/masters/modules/boost.src.js';

const chart = new Highcharts.Chart('container', {});

// Highcharts should be decorated with boost types:
chart.isChartSeriesBoosting(chart);
