import * as Highcharts from 'highcharts';

test_Chart();
test_Chart_resetZoomButton();

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
