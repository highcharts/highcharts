import * as Highcharts from 'highcharts';

test_Chart();
test_Chart_resetZoomButton();
test_chart_promise();

function test_Chart() {
    let chart: Highcharts.Chart;
    chart = new Highcharts.Chart(
        'container',
        {}
    );
    chart = new Highcharts.Chart(
        {},
        function (chart) {
            chart.update({});
        }
    );
    chart = new Highcharts.Chart(
        'container',
        {},
        function (chart) {
            chart.update({});
        }
    );
}

function test_Chart_resetZoomButton() {
    const chart = new Highcharts.Chart('container', {
        chart: {
            resetZoomButton: { // #17703, deprecated but available
                position: {
                    align: 'center'
                }
            }
        }
    });
}

/**
 * Tests that `Highcharts.chart()` returns a promise of the chart when
 * the callback is `true`, and the chart otherwise. #25648
 */
function test_chart_promise() {
    const chart: Highcharts.Chart = Highcharts.chart('container', {});
    const withCallback: Highcharts.Chart = Highcharts.chart(
        'container',
        {},
        function (chart) {
            chart.redraw();
        }
    );
    const promise: Promise<Highcharts.Chart> = Highcharts.chart(
        'container',
        {},
        true
    );
    const promiseWithoutRenderTo: Promise<Highcharts.Chart> =
        Highcharts.chart({}, true);
    // @ts-expect-error: with `true`, the result is a promise, not a chart
    const notChart: Highcharts.Chart = Highcharts.chart('container', {}, true);
    promise.then((resolved) => resolved.redraw());
}
