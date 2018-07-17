

Highcharts.setOptions({
    global: {
        useUTC: false
    }
});

// Create the chart
Highcharts.stockChart('container', {
    chart: {
        events: {
            load: function () {

                // set up the updating of the chart each second
                var series = this.series[0];
                setInterval(function () {
                    var y = Math.round(Math.random() * 100);
                    series.addPoint(y, true, true);
                }, 1000);
            }
        }
    },

    rangeSelector: {
        buttons: [{
            count: 1,
            type: 'minute',
            text: '1M'
        }, {
            count: 5,
            type: 'minute',
            text: '5M'
        }, {
            type: 'all',
            text: 'All'
        }],
        inputEnabled: false,
        selected: 0
    },

    title: {
        text: 'Live random data with overscroll'
    },

    exporting: {
        enabled: false
    },

    xAxis: {
        overscroll: 10 * 1000 // 10 seconds
    },

    navigator: {
        xAxis: {
            overscroll: 10 * 1000 // 10 seconds
        }
    },

    series: [{
        name: 'Random data',
        pointStart: Date.UTC(2017, 0, 1),
        pointInterval: 1000, // 1s
        data: (function () {
            // generate an array of random data
            var data = [],
                i;

            for (i = 0; i <= 1000; i += 1) {
                data.push(
                    Math.round(Math.random() * 100)
                );
            }
            return data;
        }())
    }]
});


