Highcharts.chart('container', {

    chart: {
        type: 'column'
    },

    legend: {
        enabled: false
    },

    title: {
        text: 'Tooltip follow pointer comparison'
    },

    subtitle: {
        text: 'Hover over the series to see different behaviours of tooltip'
    },

    tooltip: {
        headerFormat: '',
        pointFormat: 'tooltip.followPointer: <b>{series.tooltipOptions.followPointer}</b>'
    },

    series: [{
        tooltip: {
            followPointer: true
        },
        data: [70, 55, 60]
    }, {
        tooltip: {
            followPointer: false
        },
        data: [45, 25, 40]
    }]

});
