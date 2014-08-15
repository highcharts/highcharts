$(function () {
    Highcharts.setOptions({
        global: {
            timezoneOffset: -60
        }
    });

    $('#container').highcharts({
        xAxis: {
            type: 'datetime'
        },

        title: {
            text: 'Midnight ticks should show date'
        },

        series: [{
            data: Highcharts.map(new Array(48), Math.random),
            pointStart: Date.UTC(2013, 0, 1, 12),
            pointInterval: 36e5 // one hour
        }]
    });
});