

Highcharts.setOptions({
    lang: {
        shortWeekdays: ['su', 'ma', 'ti', 'ke', 'to', 'pe', 'la']
    }
});

Highcharts.chart('container', {

    chart: {
        type: 'column'
    },

    title: {
        text: 'Short weekdays option'
    },

    subtitle: {
        text: 'Finnish uses lower case, two-letter abbreviations'
    },

    xAxis: {
        type: 'datetime',
        labels: {
            format: '{value:%a}'
        }
    },

    series: [{
        data: [5, 6, 4, 7, 6, 2, 1],
        pointStart: Date.UTC(2016, 3, 11),
        pointIntervalUnit: 'day'
    }]
});