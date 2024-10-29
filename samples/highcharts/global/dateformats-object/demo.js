/**
 * Add a custom date format string representing an internationalized format.
 */
Highcharts.dateFormats.z = function (timestamp) {
    return this.dateFormat({
        day: 'numeric',
        month: 'long'
    }, timestamp);
};

Highcharts.chart('container', {

    title: {
        text: 'Custom date format relaying to <em>Intl.DateTimeFormat</em>'
    },

    xAxis: {
        type: 'datetime',
        tickInterval: 7 * 24 * 36e5, // one week
        labels: {
            format: '{value:%z}'
        }
    },

    series: [{
        data: [
            29.9, 71.5,
            106.4, 129.2,
            144.0, 176.0,
            135.6, 148.5,
            216.4, 194.1,
            95.6, 54.4
        ],
        pointInterval: 7 * 24 * 36e5,
        pointStart: Date.UTC(2013, 0, 7)

    }]

});