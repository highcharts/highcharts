$(function () {
    $('#container').highcharts({
        xAxis: {
            type: 'category'
        },
        series: [{
            data: [
                ['Apples', 1],
                ['Pears', 2],
                ['Oranges', 3]
            ]
        }]
    });

    $('#rotate').on('click', function () {
        var chart = $('#container').highcharts();
        chart.xAxis[0].update({ labels: { rotation: -90 } });
    });
});