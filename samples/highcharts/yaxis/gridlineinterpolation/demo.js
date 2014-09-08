$(function () {

    $('#container').highcharts({

        chart: {
            polar: true
        },

        title: {
            text: 'Highcharts Polar Chart'
        },
        subtitle: {
            text: 'Showing <em>circle</em> and <em>polygon</em> grid line interpolation'
        },

        pane: [{
            startAngle: 0,
            endAngle: 360,
            center: ["25%", "50%"],
            size: '60%'
        }, {
            startAngle: 0,
            endAngle: 360,
            center: ["75%", "50%"],
            size: '60%'
        }],

        xAxis: [{
            tickInterval: 45,
            min: 0,
            max: 360,
            pane: 0,
            lineWidth: 0
        }, {
            tickInterval: 45,
            min: 0,
            max: 360,
            pane: 1,
            lineWidth: 0
        }],

        yAxis: [{
            min: 0,
            tickInterval: 2,
            gridLineInterpolation: 'circle',
            pane: 0
        }, {
            min: 0,
            tickInterval: 3,
            gridLineInterpolation: 'polygon',
            pane: 1
        }],

        plotOptions: {
            series: {
                pointStart: 0,
                pointInterval: 45
            },
            column: {
                pointPadding: 0,
                groupPadding: 0
            }
        },

        series: [{
            type: 'column',
            name: 'Column',
            data: [8, 7, 6, 5, 4, 3, 2, 1],
            pointPlacement: 'between',
            yAxis: 0,
            xAxis: 0
        }, {
            type: 'area',
            name: 'Area',
            yAxis: 1,
            xAxis: 1,
            data: [1, 8, 2, 7, 3, 6, 4, 5]
        }]
    });
});