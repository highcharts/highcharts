$(function () {
    var chart = Highcharts.chart('container', {
        title: {
            text: 'Browser market shares at a specific website, 2014Browser market shares at a specific website, 2014Browser market shares at a specific website, 2014Browser market shares at a specific website, 2014Browser market shares at a specific website, 2014'
        },
        series: [{
            type: 'pie',
            data: [1]
        }]
    });

    $('#small').click(function () {
        chart.setSize(300);
    });

});
