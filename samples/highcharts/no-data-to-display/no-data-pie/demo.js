$(function () {

    var chart,
        btnRemove = $('#remove'),
        btnAdd = $('#add');

    btnAdd.click(function () {
        chart.series[0].addPoint(Math.floor(Math.random() * 10 + 1)); // Return random integer between 1 and 10.
    });

    btnRemove.click(function () {
        if (chart.series[0].points[0]) {
            chart.series[0].points[0].remove();
        }
    });

    $('#container').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: 'No data in pie chart'
        },
        series: [{
            type: 'pie',
            name: 'Random data',
            data: []
        }]
    });

    chart = $('#container').highcharts();
});

