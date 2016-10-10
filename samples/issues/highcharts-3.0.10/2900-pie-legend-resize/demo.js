$(function () {
    var chart = Highcharts.chart('container', {

        series: [{
            type: 'pie',
            data: [{
                y: 1,
                name: 'A'
            }],
            showInLegend: true,
            dataLabels: {
                enabled: false
            }
        }],
        legend: {
            backgroundColor: '#bada55'
        }

    });

    $('#update').click(function () {
        chart.series[0].setData([{
            y: 1,
            name: 'A with a longer series name'
        }]);
    });
});
