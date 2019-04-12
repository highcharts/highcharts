// Custom announce formatter - only report if there is a new point and it is
// above 10. Returning empty string stops announcement, returning false uses
// default announcement.
function onAnnounce(updatedSeries, newSeries, newPoint) {
    return newPoint && newPoint.y > 10 ? 'Alert: ' + newPoint.y : '';
}

// Create the chart
Highcharts.chart('container', {
    title: {
        text: 'Live updating data'
    },
    subtitle: {
        text: 'Points above 10 trigger alert by screen reader'
    },
    accessibility: {
        description: 'A test case for dynamic data in charts.',
        announceNewData: {
            enabled: true,
            interruptUser: true,
            minAnnounceInterval: 0,
            announcementFormatter: onAnnounce
        }
    },
    chart: {
        type: 'spline',
        events: {
            load: function () {
                // Set up the updating of the chart each second
                var series = this.series[0];
                setInterval(function () {
                    series.addPoint(
                        Math.round(Math.random() * 110) / 10,
                        true,
                        series.points.length > 20
                    );
                }, 2000);
            }
        }
    },
    yAxis: {
        min: 0,
        max: 12,
        plotLines: [{
            value: 10,
            width: 2,
            color: '#e33'
        }]
    },
    series: [{
        name: 'Random data',
        dataLabels: {
            enabled: true
        },
        data: [1.1]
    }]
});
