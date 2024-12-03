Highcharts.chart('container', {
    chart: {
        type: 'heatmap',
        inverted: true
    },

    accessibility: {
        description: 'We see how temperatures are usually warmer during the ' +
            'day, especially from around 9am to 9pm. June 4th through 9th ' +
            'are also overall colder days compared to the rest. Overall the ' +
            'temperatures range from around 6 degrees C to around 27 ' +
            'degrees C.'
    },

    data: {
        csv: document.getElementById('csv').innerHTML
    },

    title: {
        text: 'Highcharts heat map',
        align: 'left'
    },

    subtitle: {
        text: 'Temperature variation by day and hour through June 2024',
        align: 'left'
    },

    xAxis: {
        tickPixelInterval: 50,
        min: '2024-06-01',
        max: '2024-06-30'
    },

    yAxis: {
        accessibility: {
            description: 'Hours in the day'
        },
        title: {
            text: null
        },
        labels: {
            format: '{value}:00'
        },
        lineWidth: 1,
        minPadding: 0,
        maxPadding: 0,
        startOnTick: false,
        endOnTick: false,
        tickPositions: [0, 6, 12, 18, 24],
        tickWidth: 1,
        min: 0,
        max: 23
    },

    colorAxis: {
        stops: [
            [0, '#3060cf'],
            [0.5, '#fffbbc'],
            [0.9, '#c4463a']
        ]
    },

    series: [{
        borderWidth: 0,
        colsize: 24 * 36e5, // one day
        tooltip: {
            headerFormat: 'Temperature<br/>',
            pointFormat: '{point.x:%e %b, %Y} {point.y}:00: <b>{point.value} ' +
                '℃</b>'
        },
        accessibility: {
            enabled: false
        }
    }]
});
