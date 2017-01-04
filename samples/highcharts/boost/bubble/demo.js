$(function () {

    // Prepare the data
    var data = [],
        n = 50000,
        i;
    for (i = 0; i < n; i += 1) {
        data.push([
            Math.pow(Math.random(), 2) * 100,
            Math.pow(Math.random(), 2) * 100,
            Math.pow(Math.random(), 2) * 100
        ]);
    }

    if (!Highcharts.Series.prototype.renderCanvas) {
        console.error('Module not loaded');
        return;
    }

    console.time('bubble');
    console.time('asyncRender');
    Highcharts.chart('container', {

        chart: {
            zoomType: 'xy'
        },

        xAxis: {
            gridLineWidth: 1,
            minPadding: 0,
            maxPadding: 0,
            startOnTick: false,
            endOnTick: false
        },

        yAxis: {
            minPadding: 0,
            maxPadding: 0,
            startOnTick: false,
            endOnTick: false
        },

        title: {
            text: 'Bubble chart with ' + Highcharts.numberFormat(data.length, 0, ' ') + ' points'
        },
        legend: {
            enabled: false
        },
        series: [{
            type: 'bubble',
            color: 'rgba(152,0,67,0.01)',
            data: data,
            minSize: 1,
            maxSize: 10,
            tooltip: {
                followPointer: false,
                pointFormat: '[{point.x:.1f}, {point.y:.1f}]'
            },
            events: {
                renderedCanvas: function () {
                    console.timeEnd('asyncRender');
                }
            }
        }]

    });
    console.timeEnd('bubble');

});