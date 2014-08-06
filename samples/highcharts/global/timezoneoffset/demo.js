$(function () {
    Highcharts.setOptions({
        global: {
            timezoneOffset: 5 * 60
        }
    });

    $('#container').highcharts({
        title: {
            text: 'Timezone offset is 5 hours (=EST). The data series starts at midnight UTC, which is 7 PM EST.'
        },

        xAxis: {
            type: 'datetime'
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            pointStart: Date.UTC(2013, 0, 1),
            pointInterval: 36e5 // one hour
        }]
    });
});