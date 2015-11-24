var toggle = true;

function toggleDataLabels(chart) {
    $.each(chart.series, function (i, el) {
        el.update({
            dataLabels: {
                enabled: toggle
            }
        }, false);

    });
    toggle = !toggle;
    chart.redraw();
}
$(function () {
    var ids = ['a', 'b', 'c'],
        series = [],
        i = 0;


    for (; i < 3; i += 1) {
        series[i] = {
            data: [Math.random(), Math.random()],
            id: ids[i]
        };
    }
    for (; i < 9; i += 1) {
        series[i] = {
            data: [Math.random(), Math.random()],
            linkedTo: ids[i % 3]
        };
    }

    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container'
        },
        title: {
            text: 'Linked series bug'
        },
        subtitle: {
            text: 'Series.update caused the last series to become unlinked'
        },
        series: series
    });
});