$(function () {
    /**
     * Add custom date formats
     */
    Highcharts.dateFormats = {
        W: function (timestamp) {
            var date = new Date(timestamp),
                day = date.getUTCDay() === 0 ? 7 : date.getUTCDay(),
                dayNumber;
            date.setDate(date.getUTCDate() + 4 - day);
            dayNumber = Math.floor((date.getTime() - new Date(date.getUTCFullYear(), 0, 1, -6)) / 86400000);
            return 1 + Math.floor(dayNumber / 7);

        }
    };

    $('#container').highcharts({

        title: {
            text: 'Custom date format'
        },

        xAxis: {
            type: 'datetime',
            tickInterval: 7 * 24 * 36e5, // one week
            labels: {
                format: '{value:Week %W/%Y}',
                align: 'right',
                rotation: -30
            }
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            pointInterval: 7 * 24 * 36e5,
            pointStart: Date.UTC(2013, 0, 7)

        }]

    });
});