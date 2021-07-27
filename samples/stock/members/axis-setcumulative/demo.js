Highcharts.stockChart('container', {

    rangeSelector: {
        selected: 4
    },

    tooltip: {
        changeDecimals: 2,
        valueDecimals: 2
    },

    series: [{
        data: [5, 3, 5, 5, 5, 5]
    }, {
        data: [1, 2, 3, 4, 5, 6]
    }, {
        data: [6, 5, 4, 3, 2, 1]
    }]

}, function (chart) {
    // Buttons behaviour
    document.querySelector('button.enable-cumulative')
        .addEventListener('click', function () {
            chart.yAxis[0].setCumulative(true, false);
            chart.update({
                tooltip: {
                    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.cumulativeSum})<br/>'
                }
            });
        });

    document.querySelector('button.disable-cumulative')
        .addEventListener('click', function () {
            chart.yAxis[0].setCumulative(false, false);
            chart.update({
                tooltip: {
                    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>'
                }
            });
        });
});