$(function () {

    $('#container').highcharts({

        chart: {
            type: 'solidgauge'
        },

        pane: {
            startAngle: -90,
            endAngle: 90,
            background: {
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        yAxis: {
            min: -5,
            max: 5
        },

        series: [{
            data: [38]
        }]
    });
});

