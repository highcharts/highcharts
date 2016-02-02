$(function () {

    var chart = $('#container').highcharts({

        chart: {
            plotBackgroundColor: '#E0FFFF',
            zoomType: 'x'
        },

        legend: {
            enabled: false
        },

        xAxis: {
            min: 0,
            max: 10
        },

        scrollbar: {
            enabled: true
        },


        series: [{
            name: 'blue',
            color: '#0000FF',
            data: [1,4,3,4,5,5,4],
            pointStart: 3
        }]
    });

});