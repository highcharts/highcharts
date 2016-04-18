$(function () {

    $('#container').highcharts({

        chart: {
            type: 'gauge'
        },

        title: {
            text: 'Failed with JS error in 3.0.7'
        },

        pane: {
            startAngle: -150,
            endAngle: 150
        },

        // the value axis
        yAxis: {
            min: 0,
            max: 200,
            labels: {
                step: 2,
                rotation: 'auto'
            },
            title: {
                text: 'km/h'
            }
        },

        series: [{
            name: 'Speed',
            data: [80],
            tooltip: {
                valueSuffix: ' km/h'
            }
        }]

    });
});