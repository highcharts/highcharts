import HighchartsType from '../ts/Dashboards/highcharts';
import Defaults from '../ts/Core/Defaults';

declare global {
    interface Window {
        Highcharts: typeof HighchartsType.Chart & typeof Defaults;
    }
}
