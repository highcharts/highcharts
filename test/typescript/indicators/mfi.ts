import * as Highcharts from 'highcharts';
import MfiIndicator from 'highcharts/indicators/mfi';

MfiIndicator(Highcharts);

test_PlotMfiParamsOptions();

function test_PlotMfiParamsOptions() {
    // $ExpectError
    const options: Highcharts.PlotMfiParamsOptions = {
        index: 123
    };
}
