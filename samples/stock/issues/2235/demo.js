$(function () {
    $('#container').highcharts({

        title: {
            text: 'Regression since 3.0.3 caused gap not to apply'
        },

        series: [{
            data: [
                [Date.UTC(2013, 8, 1),1],
                [Date.UTC(2013, 8, 2),1],
                // gap
                [Date.UTC(2013, 8, 4),1],
                [Date.UTC(2013, 8, 5),1]
            ],
            gapSize: 1,
            type: 'area'
        }],

        xAxis: {
            ordinal: false,
            type: 'datetime'
        }
    });
});