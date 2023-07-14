// Lint type tests
import * as Highcharts from 'highcharts';
import MfiIndicator from 'highcharts/indicators/mfi';

MfiIndicator(Highcharts);

test_PlotMfiParamsOptions();
test_SeriesOptions();

function test_PlotMfiParamsOptions() {
    // $ExpectError
    const options: Highcharts.PlotMfiParamsOptions = {
        index: 123
    };
}

function test_SeriesOptions() {
    // $ExpectError
    const options: Highcharts.SeriesOptions = {
        stacking: 'invalid-value'
    };
}
