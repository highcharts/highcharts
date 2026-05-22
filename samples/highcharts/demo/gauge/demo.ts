Highcharts.chart('container', {
    chart: {
        type: 'gauge'
    },

    title: {
        text: 'Revenue this month'
    },

    // Defines the gauge area
    pane: {
        startAngle: -90,
        endAngle: 90,
        background: null
    },

    // The value axis
    yAxis: {
        min: 0,
        max: 200000,
        plotBands: [{
            from: 0,
            to: 110000,
            color: 'rgba(128, 128, 128, 0.1)' // gray
        }, {
            from: 111000,
            to: 149000,
            color: '#FFBF00' // yellow
        }, {
            from: 150000,
            to: 200000,
            color: '#00A96B' // green
        }]
    },

    series: [{
        name: 'Revenue',
        data: [80000],
        tooltip: {
            valuePrefix: '$'
        },
        dataLabels: {
            format: '${y:,.0f}'
        }
    }]

});
