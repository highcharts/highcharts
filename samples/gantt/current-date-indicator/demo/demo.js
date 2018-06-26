var today = new Date(),
    day = 1000 * 60 * 60 * 24;

// Set to 00:00:00:000 today
today.setUTCHours(0);
today.setUTCMinutes(0);
today.setUTCSeconds(0);
today.setUTCMilliseconds(0);

// THE CHART
Highcharts.chart('container', {
    title: {
        text: 'Current Date Indicator'
    },
    xAxis: [{
        id: 'bottom-datetime-axis',
        currentDateIndicator: true,
        type: 'datetime',
        tickInterval: day,
        labels: {
            format: '{value:%a}'
        },
        min: today.getTime() - (3 * day),
        max: today.getTime() + (3 * day)
    }],
    series: [{
        name: 'Project 1',
        borderRadius: 3,
        xAxis: 0,
        data: [{
            x: today.getTime() - (2 * day),
            y: 0
        }, {
            x: today.getTime() - day,
            y: 1
        }, {
            x: today.getTime() + day,
            y: 0
        }, {
            x: today.getTime() + (2 * day),
            y: 2
        }]
    }]
});
