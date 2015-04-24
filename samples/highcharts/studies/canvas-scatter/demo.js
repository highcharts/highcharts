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
            min: 0,
            max: 100,
            gridLineWidth: 1
        },

        yAxis: {
            // Renders faster when we don't have to compute min and max
            min: 0, 
            max: 100,
            minPadding: 0,
            maxPadding: 0
        },

        title: {
            text: 'Scatter chart with ' + Highcharts.numberFormat(data.length, 0, ' ') + ' points'
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