$(function () {
    
    Highcharts.setOptions({
        global: {
            /**
             * Use moment-timezone.js to return the timezone offset for individual 
             * timestamps, used in the X axis labels and the tooltip header.
             */
            getTimezoneOffset: function (timestamp) {
                var zone = moment.tz.zone('Europe/Oslo'),
                    timezoneOffset = zone.parse(timestamp);
                
                return timezoneOffset;
            }
        }
    });
    
    $('#container').highcharts({

        title: {
            text: 'getTimezoneOffset with local DST crossover'
        },
        
        subtitle: {
            text: 'From October 27, UTC midnight is 01:00 AM local time'
        },

        xAxis: {
            type: 'datetime'
        },

        series: [{
            data: (function () {
                var arr = [];
                for (var i = 0; i < 16; i++) {
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
            name: 'UTC Midnight'
        }]
    });
});