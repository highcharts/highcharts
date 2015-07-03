$(function () {
    var chart = new Highcharts.Chart({

        chart: {
            renderTo: 'container',
            zoomType: 'x'
        },

        title: {
            text: 'Highcharts <= 3.0.9: Zooming outside the data range had unexpected effects.'
        },

        xAxis: {
            min: 0,
            max: 20
        },

        series: [{
            data: [
                [5, 1],
                [6, 2],
                [7, 1],
                [8, 3],
                [9, 2],
                [10, 1]
            ]
        }]

    });
});
