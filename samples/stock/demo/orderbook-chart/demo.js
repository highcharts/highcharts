// Custom template helper
Highcharts.Templating.helpers.abs = value => Math.abs(value);

// Age categories
const categories = [];

Highcharts.chart('container', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Orderbook chart'
    },
    xAxis: [{
        categories: categories,
        reversed: false,
        labels: {
            step: 1
        }
    }, {
        opposite: true,
        reversed: false,
        categories: categories,
        linkedTo: 0,
        labels: {
            step: 1
        }
    }],
    yAxis: {
        visible: false
    },
    legend: {
        enabled: false
    },

    plotOptions: {
        series: {
            stacking: 'normal',
            pointPadding: 0,
            groupPadding: 0
        }
    },

    series: [{
        name: 'Bids',
        color: 'blue',
        data: [
            -8.98, -7.52, -6.65, -5.72, -4.85,
            -3.71, -2.76, -2.07, -1.70, -1.47
        ]
    }, {
        name: 'Asks',
        color: 'red',
        data: [
            8.84, 7.42, 6.57, 5.68, 4.83,
            3.74, 2.80, 2.14, 1.79, 1.59
        ]
    }]
});
