$(function () {

    var chart,
        btnRemove = $('#remove'),
        btnAdd = $('#add'),
        btnShow = $('#showCustom');

    btnAdd.click(function () {
        chart.series[0].addPoint(Math.floor(Math.random() * 10 + 1)); // Return random integer between 1 and 10.
    });

    btnRemove.click(function () {
        if (chart.series[0].points[0]) {
            chart.series[0].points[0].remove();
        }
    });

    btnShow.click(function () {
        if (!chart.hasData()) {
            chart.hideNoData();
            chart.showNoData("Your custom error message");
        }
    });

    $('#container').highcharts({
        title: {
            text: 'No data in line chart - with custom options'
        },
        series: [{
            type: 'line',
            name: 'Random data',
            data: []
        }],
        lang: {
            noData: "Nichts zu anzeigen"
        },
        noData: {
            style: {
                fontWeight: 'bold',
                fontSize: '15px',
                color: '#303030'
            }
        }
    });

    chart = $('#container').highcharts();
});

