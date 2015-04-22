$(function () {

    // Prepare the data
    var data = [],
        n = 500000,
        i;
    for (i = 0; i < n; i += 1) {
        data.push([
            Math.pow(Math.random(), 2) * 100,
            Math.pow(Math.random(), 2) * 100
        ]);
    }


    console.time('scatter');
    $('#container').highcharts({

        chart: {
            zoomType: 'xy'
        },

        xAxis: {
            gridLineWidth: 1
        },

        yAxis: {
            minPadding: 0,
            maxPadding: 0
        },

        title: {
            text: 'Scatter chart with ' + data.length + ' points'
        },
        legend: {
            enabled: false
        },
        series: [{
            type: 'scatter',
            animation: false,
            color: 'rgba(152,0,67,0.2)',
            data: data,
            marker: {
                radius: 1
            },
            tooltip: {
                followPointer: false,
                pointFormat: '[{point.x:.1f}, {point.y:.1f}]'
            }
        }]

    });
    console.timeEnd('scatter');

});