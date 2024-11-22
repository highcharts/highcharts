Highcharts.chart('container', {

    chart: {
        type: 'column'
    },

    title: {
        text: 'Locale from parent element <em>lang</em> attribute',
        align: 'left'
    },

    caption: {
        text: 'In the axis labels, German uses two-letter weekday ' +
            'abbreviations. In the tooltip, the full weekday is spelled out. ' +
            'Data labels uses the locale\'s thousands separator and decimal ' +
            'point.',
        align: 'left'
    },

    xAxis: {
        type: 'datetime',
        labels: {
            // The %a signifies short weekday
            format: '{value:%a}'
        }
    },

    series: [{
        data: [5223, 6433, 4687, 7432, 6342, 2455, 1345],
        dataLabels: {
            enabled: true,
            format: '{y:,.1f}'
        },
        pointStart: Date.UTC(2016, 3, 11),
        pointIntervalUnit: 'day'
    }]
});