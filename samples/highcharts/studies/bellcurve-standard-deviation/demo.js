(function (H) {
    function normalDensity(x, mean, standardDeviation) {
        const translation = x - mean;
        return Math.exp(
            -(translation * translation) /
            (2 * standardDeviation * standardDeviation)
        ) / (standardDeviation * Math.sqrt(2 * Math.PI));
    }
    H.seriesTypes.bellcurve.prototype.derivedData = function (
        mean,
        standardDeviation) {

        const intervals = this.options.intervals,
            pointsInInterval = this.options.pointsInInterval,
            stop = intervals * pointsInInterval * 2 + 1,
            increment = standardDeviation / pointsInInterval,
            data = [],
            zoneStops = [];

        let x = mean - intervals * standardDeviation,
            point;

        for (let i = 0; i < stop; i++) {

            point = [x, normalDensity(x, mean, standardDeviation)];
            data.push(point);

            // Calculate zones to present standard deviation.
            if (i && i % pointsInInterval === 0) {
                zoneStops.push(point[0]);
            }

            x += increment;
        }
        this.chart.zoneStops = zoneStops;

        return data;
    };
}(Highcharts));

const data = [3.5, 3, 3.2, 3.1, 3.6, 3.9, 3.4, 3.4, 2.9, 3.1, 3.7, 3.4, 3, 3, 4,
    4.4, 3.9, 3.5, 3.8, 3.8, 3.4, 3.7, 3.6, 3.3, 3.4, 3, 3.4, 3.5, 3.4, 3.2,
    3.1, 3.4, 4.1, 4.2, 3.1, 3.2, 3.5, 3.6, 3, 3.4, 3.5, 2.3, 3.2, 3.5, 3.8, 3,
    3.8, 3.2, 3.7, 3.3, 3.2, 3.2, 3.1, 2.3, 2.8, 2.8, 3.3, 2.4, 2.9, 2.7, 2, 3,
    2.2, 2.9, 2.9, 3.1, 3, 2.7, 2.2, 2.5, 3.2, 2.8, 2.5, 2.8, 2.9, 3, 2.8, 3,
    2.9, 2.6, 2.4, 2.4, 2.7, 2.7, 3, 3.4, 3.1, 2.3, 3, 2.5, 2.6, 3, 2.6, 2.3,
    2.7, 3, 2.9, 2.9, 2.5, 2.8, 3.3, 2.7, 3, 2.9, 3, 3, 2.5, 2.9, 2.5, 3.6,
    3.2, 2.7, 3, 2.5, 2.8, 3.2, 3, 3.8, 2.6, 2.2, 3.2, 2.8, 2.8, 2.7, 3.3, 3.2,
    2.8, 3, 2.8, 3, 2.8, 3.8, 2.8, 2.8, 2.6, 3, 3.4, 3.1, 3, 3.1, 3.1, 3.1, 2.7,
    3.2, 3.3, 3, 2.5, 3, 3.4, 3
];

Highcharts.setOptions({
    colors: [Highcharts.color(
        Highcharts.getOptions().colors[0]).brighten(-0.15).get()]
});

Highcharts.chart('container', {
    chart: {
        events: {
            render: function () {

                const chart = this,
                    zones = [],
                    renderer = chart.renderer,
                    sdColors = [
                        Highcharts.color(
                            Highcharts.getOptions().colors[0]
                        ).brighten(0.3).get(),
                        Highcharts.color(
                            Highcharts.getOptions().colors[0]
                        ).brighten(0.15).get(),
                        Highcharts.getOptions().colors[0]
                    ];

                let zoneStops,
                    zoneStopsLen,
                    xAxis,
                    base;

                chart.series.forEach(function (s) {
                    if (s.type === 'bellcurve') {

                        xAxis = s.xAxis;
                        zoneStops = chart.zoneStops;
                        base = zoneStops[1] - zoneStops[0];
                        zoneStopsLen = zoneStops.length;

                        if (!s.options.zones) {
                            for (let i = 0; i < zoneStopsLen; i++) {
                                zones.push({
                                    value: zoneStops[i],
                                    color: i < zoneStopsLen / 2 ?
                                        sdColors[i] : sdColors[(
                                            zoneStopsLen - 1) - i]
                                });
                            }

                            s.update({
                                zones: zones
                            });
                        }

                        if (s.stDevLabelsGroup) {
                            s.stDevLabels.forEach(function (label, i) {
                                label.attr({
                                    x: xAxis.toPixels(zoneStops[i] -
                                         (base / 2)) - (label.width / 2),
                                    y: chart.plotBox.y +
                                         s.yAxis.len - label.height
                                });
                            });
                        } else {
                            const percents = ['2.35%', '13.5%', '34.0%'];

                            s.stDevLabelsGroup = renderer.g('st-dev-labels').attr({
                                zIndex: 5
                            }).add();
                            s.stDevLabels = [];

                            for (let i = 0; i < zoneStopsLen; i++) {
                                const label = renderer.label(
                                    i < zoneStopsLen / 2 ? percents[i] :
                                        percents[(zoneStopsLen - 1) - i],
                                    0,
                                    0
                                ).add(s.stDevLabelsGroup);

                                label.attr({
                                    x: xAxis.toPixels(zoneStops[i] -
                                         (base / 2)) - (label.width / 2),
                                    y: chart.plotBox.y +
                                         s.yAxis.len - label.height
                                });
                                s.stDevLabels.push(label);
                            }
                        }

                    }
                });

            }
        }
    },
    title: {
        text: 'Bell curve with standard deviation'
    },

    xAxis: [{
        title: {
            text: 'Data'
        },
        alignTicks: false
    }, {
        title: {
            text: 'Bell curve'
        },
        alignTicks: false,
        opposite: true
    }],

    yAxis: [{
        title: {
            text: 'Data'
        }
    }, {
        title: {
            text: 'Bell curve'
        },
        opposite: true
    }],

    series: [{
        name: 'Bell curve',
        type: 'bellcurve',
        xAxis: 1,
        yAxis: 1,
        baseSeries: 1,
        zIndex: -1,
        zoneAxis: 'x'
    }, {
        name: 'Data',
        type: 'scatter',
        data: data,
        marker: {
            radius: 1.5
        }
    }]
});
