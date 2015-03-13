$(function () {
    $('#container').highcharts({
        chart: {
            type: 'pie'
        },

        title: {
            text: 'Regression causes legend item height problems'
        },

        legend: {
            layout: 'horizontal',
            width: 200,
            itemWidth: 100,
            align: 'right',
            verticalAlign: 'middle'
        },

        series: [{
            data: [{
                y: 1
            }, {
                y: 1
            }, {
                name: 'Series<br>- line 2',
                y: 1
            }, {
                y: 1
            }, {
                y: 1
            }, {
                y: 1
            }, {
                y: 1
            }, {
                y: 1
            }],
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }]

    });
});