$(function () {
    $('#container').highcharts({

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
            backgroundColor: '#a4edba'
        }

    });

    $('#update').click(function () {
        $('#container').highcharts().series[0].setData([{
            y: 1,
            name: 'A with a longer series name'
        }]);
    });
});