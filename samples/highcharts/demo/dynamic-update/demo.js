// On chart load, start an interval that adds points to the chart and animate
// the pulsating marker.
const onChartLoad = function () {
    const chart = this,
        series = chart.series[0];

    setInterval(function () {
        const x = (new Date()).getTime(), // current time
            y = Math.random();

        series.addPoint([x, y], true, true);
    }, 1000);
};

// Create the initial data
const data = (function () {
    const data = [];
    const time = new Date().getTime();

    for (let i = -19; i <= 0; i += 1) {
        data.push({
            x: time + i * 1000,
            y: Math.random()
        });
    }
    return data;
}());

// Plugin to add a pulsating marker on add point
Highcharts.addEvent(Highcharts.Series, 'addPoint', e => {
    const point = e.point,
        series = e.target;

    if (!series.pulse) {
        series.pulse = series.chart.renderer.circle()
            .add(series.markerGroup);
    }

    setTimeout(() => {
        series.pulse
            .attr({
                x: series.xAxis.toPixels(point.x, true),
                y: series.yAxis.toPixels(point.y, true),
                r: series.options.marker.radius,
                opacity: 1,
                fill: series.color
            })
            .animate({
                r: 20,
                opacity: 0
            }, {
                duration: 1000
            });
    }, 1);
});


Highcharts.chart('container', {
    chart: {
        type: 'spline',
        events: {
            load: onChartLoad
        }
    },

    time: {
        useUTC: false
    },

    title: {
        text: 'Live random data'
    },

    accessibility: {
        announceNewData: {
            enabled: true,
            minAnnounceInterval: 15000,
            announcementFormatter: function (allSeries, newSeries, newPoint) {
                if (newPoint) {
                    return 'New point added. Value: ' + newPoint.y;
                }
                return false;
            }
        }
    },

    xAxis: {
        type: 'datetime',
        tickPixelInterval: 150,
        maxPadding: 0.1
    },

    yAxis: {
        title: {
            text: 'Value'
        },
        plotLines: [
            {
                value: 0,
                width: 1,
                color: '#808080'
            }
        ]
    },

    tooltip: {
        headerFormat: '<b>{series.name}</b><br/>',
        pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
    },

    legend: {
        enabled: false
    },

    exporting: {
        enabled: false
    },

    series: [
        {
            name: 'Random data',
            lineWidth: 2,
            color: Highcharts.getOptions().colors[2],
            data
        }
    ]
});
