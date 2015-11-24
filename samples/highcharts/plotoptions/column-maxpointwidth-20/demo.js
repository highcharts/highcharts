$(function () {
    $('#container').highcharts({

        chart: {
            type: 'column'
        },

        title: {
            text: 'Max point width in Highcharts'
        },

        xAxis: {
            categories: ['One', 'Two', 'Three']
        },

        series: [{
            data: [1, 2, 3],
            maxPointWidth: 50
        }]

    });

});