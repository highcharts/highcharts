import HighchartsType from '../ts/Dashboards/highcharts';

declare global {
    interface Window {
        Highcharts: typeof HighchartsType.Chart;
    }
}
