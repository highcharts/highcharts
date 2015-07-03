window.onload = function () {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
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