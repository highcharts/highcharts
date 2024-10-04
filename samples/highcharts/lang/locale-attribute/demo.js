Highcharts.chart('container', {

    chart: {
        type: 'column'
    },

    title: {
        text: 'Locale from parent element <em>lang</em> attribute',
        align: 'left'
    },

    subtitle: {
        text: 'In the axis labels, German uses two-letter weekday ' +
            'abbreviations. In the tooltip, the full weekday is spelled out.',
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
        data: [5, 6, 4, 7, 6, 2, 1],
        pointStart: Date.UTC(2016, 3, 11),
        pointIntervalUnit: 'day'
    }]
});