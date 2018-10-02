$(function () {

    $('#container-rpm').highcharts({

        chart: {
            type: 'gauge'
        },

        title: {
            text: 'Negative yAxis.min on solid gauge (#3010)'
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
            data: [-1]
        }]
    });
});
