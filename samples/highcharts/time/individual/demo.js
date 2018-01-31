Highcharts.chart('container1', {

    title: {
        text: 'Berlin time'
    },

    time: {
        timezone: 'Europe/Berlin'
    },
    xAxis: {
        type: 'datetime'
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        pointStart: Date.UTC(2017, 0, 1),
        pointInterval: 36e5
    }]

});

Highcharts.chart('container2', {

    title: {
        text: 'New York time'
    },

    time: {
        timezone: 'America/New_York'
    },
    xAxis: {
        type: 'datetime'
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        pointStart: Date.UTC(2017, 0, 1),
        pointInterval: 36e5
    }]

});
