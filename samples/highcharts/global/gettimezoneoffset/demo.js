$(function () {

    Highcharts.setOptions({
        global: {
            /**
             * Use moment-timezone.js to return the timezone offset for individual
             * timestamps, used in the X axis labels and the tooltip header.
             */
            getTimezoneOffset: function (timestamp) {
                var zone = 'Europe/Oslo',
                    timezoneOffset = -moment.tz(timestamp, zone).utcOffset();

                return timezoneOffset;
            }
        }
    });

    $('#container').highcharts({

        title: {
            text: 'getTimezoneOffset with local DST crossover'
        },

        subtitle: {
            text: 'From October 27, UTC midnight is 01:00 AM in Oslo'
        },

        xAxis: {
            type: 'datetime'
        },

        series: [{
            data: (function () {
                var arr = [],
                    i;
                for (i = 0; i < 16; i = i + 1) {
                    arr.push(i);
                }
                return arr;
            }()),
            dataLabels: {
                enabled: true,
                format: '{x:%H:%M}'
            },
            pointStart: Date.UTC(2014, 9, 15),
            pointInterval: 24 * 36e5,
            name: 'UTC Midnight',
            tooltip: {
                pointFormat: 'UTC midnight = {point.x:%H:%M} local time'
            }
        }]
    });
});