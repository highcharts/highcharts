$(function () {

    $('#container').highcharts({

        chart: {
            type: 'column'
        },

        title: {
            text: 'Round legend symbols'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr']
        },

        legend: {
            symbolHeight: 12,
            symbolWidth: 12,
            symbolRadius: 6
        },

        series: [{
            data: [1,3,2,4]
        }, {
            data: [6,4,5,3]
        }, {
            data: [2,7,6,5]
        }]

    });

});