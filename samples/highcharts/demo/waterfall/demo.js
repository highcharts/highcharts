Highcharts.chart('container', {
    chart: {
        type: 'waterfall'
    },

    title: {
        text: 'Highcharts Waterfall'
    },

    xAxis: {
        type: 'category'
    },

    yAxis: {
        title: {
            text: 'USD'
        }
    },

    legend: {
        enabled: false
    },

    tooltip: {
        pointFormat: '<b>${point.y:,.2f}</b> USD'
    },

    series: [{
        upColor: 'var(--highcharts-color-2)',
        color: 'var(--highcharts-color-3)',
        data: [{
            name: 'Start',
            y: 120000
        }, {
            name: 'Product Revenue',
            y: 569000
        }, {
            name: 'Service Revenue',
            y: 231000
        }, {
            name: 'Positive Balance',
            isIntermediateSum: true,
            color: 'var(--highcharts-color-1)'
        }, {
            name: 'Fixed Costs',
            y: -342000
        }, {
            name: 'Variable Costs',
            y: -233000
        }, {
            name: 'Balance',
            isSum: true,
            color: 'var(--highcharts-color-1)'
        }],
        dataLabels: {
            enabled: true,
            format: '{divide y 1000}k'
        },
        pointPadding: 0
    }]
});
