var toggle = true;
$(function () {

    Highcharts.Chart.prototype.toggleDataLabels = function () {
        $.each(this.series, function (i, el) {
            el.update({
                dataLabels: {
                    enabled: toggle
                }
            }, false);

        });
        toggle = !toggle;
        this.redraw();
    };
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

    Highcharts.chart('container', {
        title: {
            text: 'Linked series bug'
        },
        subtitle: {
            text: 'Series.update caused the last series to become unlinked'
        },
        series: series
    });
});