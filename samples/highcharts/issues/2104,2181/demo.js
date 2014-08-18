$(function () {
    $('#container').highcharts({

        chart: {
            type: 'column'
        },

        title: {
            text: 'Stacking on a log axis'
        },
        subtitle: {
            text: '#2104 caused error #10 and no visible columns.<br/>' +
                '#2181 caused the lower area stack not to display.'
        },

        xAxis: {
            tickInterval: 1
        },

        yAxis: [{
            type: 'logarithmic',
            minorTickInterval: 0.1
        }, {
            type: 'logarithmic',
            opposite: true,
            id: 'area-stack'
        }],
        plotOptions: {
            series: {
                stacking: 'normal'
            },
            area: {
                fillOpacity: 0.2
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
            }]
        }, {
            data: [{
                y: 34
            }, {
                y: 3
            }, {
                y: null
            }, {
                y: 1
            }]
        }, {
            data: [1, 20, 10, 30, 1],
            type: 'area',
            yAxis: 'area-stack'
        }, {
            data: [30, 10, 20, 1, 30],
            type: 'area',
            yAxis: 'area-stack'
        }]
    });
});