window.onload = function () {
    Highcharts.chart('container', {
        chart: {
            type: 'pie'
        },

        title: {
            text: 'Tooltip position using standalone framework in a scrollable container'
        },

        series: [{
            data: [1]
        }],

        tooltip: {
            animation: false
        }

    });
};