$(function () {
    $('#container').highcharts({

        chart: {
            type: 'column'
        },

        title: {
            text: 'Stacked columns on a log axis'
        },
		subtitle: {
            text: 'Issue #2104 caused error #10 and no visible data'
        },

        xAxis: {
            tickInterval: 1
        },

        yAxis: {
            type: 'logarithmic',
            minorTickInterval: 0.1
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },

        series: [{
            data: [{
                y: null
            }, {
                y: null
            }, {
                y: null
            }, {
                y: 17
            }, {
                y: null
            }],
            pointStart: 1
        }, {
            data: [{
                y: 34
            }, {
                y: 3
            }, {
                y: null
            }, {
                y: 1
            }],
            pointStart: 1
        }]
    });
});