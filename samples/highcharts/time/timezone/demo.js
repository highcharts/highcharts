

Highcharts.setOptions({
    time: {
        timezone: 'Europe/Oslo'
    }
});

Highcharts.chart('container', {

    title: {
        text: 'timezone with local DST crossover'
    },

    subtitle: {
        text: 'From October 30 2016, UTC midnight is 01:00 AM in Oslo'
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
        pointStart: Date.UTC(2016, 9, 22),
        pointInterval: 24 * 36e5,
        name: 'UTC Midnight',
        tooltip: {
            pointFormat: 'UTC midnight = {point.x:%H:%M} local time'
        }
    }]
});
