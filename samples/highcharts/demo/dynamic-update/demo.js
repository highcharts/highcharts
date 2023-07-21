Highcharts.chart('container', {
    chart: {
        type: 'spline',
        animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10,
        events: {
            load: function () {
                const series = this.series[0];
                const chart = this;

                setInterval(function () {
                    const x = (new Date()).getTime(); // current time
                    const y = Math.random();

                    // Add the original data point
                    series.addPoint({
                        x,
                        y,
                        marker: { radius: 0.03 }
                    },
                    true, true);

                    setTimeout(function () {
                        series.points[series.points.length - 1].update(
                            {
                                marker: {
                                    radius: 5,
                                    fillColor: Highcharts.getOptions().colors[1]
                                }
                            }
                        );
                    }, 450);

                    // Add the data point that grows and fades
                    const point = chart.renderer
                        .circle(
                            series.xAxis.toPixels(x), series.yAxis.toPixels(y),
                            0.03)
                        .attr({ fill: Highcharts.getOptions().colors[1] })
                        .add();

                    // Animate the marker size to grow and fade away
                    point.animate(
                        {
                            r: 20,
                            opacity: 0
                        },
                        {
                            duration: 1300,
                            complete: function () {
                                point.destroy();
                            }
                        }
                    );

                }, 1000);
            }
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
        tickPixelInterval: 150
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
            color: Highcharts.getOptions().colors[7],
            lineWidth: 3,
            data: (function () {
                const data = [];
                const time = new Date().getTime();

                for (let i = -19; i <= 0; i += 1) {
                    data.push({
                        x: time + i * 1000,
                        y: Math.random()
                    });
                }
                return data;
            }()),
            marker: {
                fillColor: Highcharts.getOptions().colors[1],
                radius: 5
            }
        }
    ]
});
