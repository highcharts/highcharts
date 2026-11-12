// On chart load, start an interval that adds points to the chart and animate
// the pulsating marker.
const onChartLoad = function (this: Highcharts.Chart): void {
    setInterval(() => {
        const x = (new Date()).getTime(), // current time
            y = Math.random();

        this.series[0].addPoint([x, y], true, true);
    }, 1000);
};

// Create the initial data
const data: Highcharts.PointOptionsObject[] = (function () {
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
(({ addEvent, Series }) => {
    const pulseMap = new WeakMap<Highcharts.Series, Highcharts.SVGElement>();
    addEvent(Series, 'addPoint', (
        e: Highcharts.SeriesAddPointEventObject
    ) => {
        const series = e.target,
            options = series.options as Highcharts.SeriesScatterOptions,
            x = e.point.x;

        let pulse = pulseMap.get(series);
        pulse ||= series.chart.renderer.circle()
            .add(series.markerGroup);
        pulseMap.set(series, pulse);

        setTimeout(() => {
            pulse
                .attr({
                    r: options.marker.radius,
                    opacity: 1,
                    fill: series.color
                })
                .animate({
                    r: 20,
                    opacity: 0
                }, {
                    duration: 1000,
                    step: () => {
                        const point = series.points[series.points.length - 1],
                            graphic = point?.graphic;
                        if (point && point.x === x && graphic) {
                            pulse.attr({
                                x: Number(graphic.attr('x')) +
                                    Number(graphic.attr('width')) / 2,
                                y: Number(graphic.attr('y')) +
                                    Number(graphic.attr('height')) / 2
                            });
                        }
                    }
                });
        }, 1);
    });
})(Highcharts);


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
            color: 'var(--highcharts-color-2)',
            data
        }
    ]
} satisfies Highcharts.Options);
