const colors = ['#6CDDCA', '#C771F3', '#4D90DB', '#FAB776'];

Highcharts.chart('container', {
    chart: {
        type: 'bubble',
        polar: true,
        height: 600,
        events: {
            render() {
                const chart = this,
                    pieSeries = chart.series[1];
                pieSeries.customLabel = fillCenter(100, '1990s-2020s', chart,
                    pieSeries.customLabel);
            }
        }
    },
    data: {
        csv: document.getElementById('csv').innerHTML,
        seriesMapping: [{
            name: 0,
            x: 1,
            y: 2,
            z: 3,
            'custom.lightYears': 4,
            'custom.planetMass': 5,
            'custom.stellarMagnitude': 6,
            'custom.discoveryDate': 7
        }]
    },
    title: {
        text: 'The 240 Closest Planets to the Earth other than our solar system'
    },
    subtitle: {
        text: 'Using bubble series in polar coordinate system along with pie series'
    },
    colorAxis: {
        min: 0,
        max: 12,
        stops: [
            [0, colors[0]],
            [1 / 3, colors[1]],
            [2 / 3, colors[2]],
            [1, colors[3]]
        ]
    },
    legend: {
        enabled: false
    },
    pane: {
        innerSize: '42%',
        size: '95%',
        background: [{
            backgroundColor: '#f7f7f7',
            borderWidth: 0
        }, {
            backgroundColor: '#fff',
            borderWidth: 0,
            outerRadius: '42%'
        }]
    },
    xAxis: {
        tickInterval: 1,
        min: 0,
        max: 30,
        gridLineWidth: 0,
        labels: {
            enabled: false
        },
        lineWidth: 0
    },
    yAxis: {
        tickInterval: 1,
        labels: {
            enabled: false
        },
        gridLineWidth: 0.5,
        gridLineColor: '#BBBAC5',
        gridLineDashStyle: 'longdash'
    },
    tooltip: {
        borderWidth: 1,
        backgroundColor: '#fff',
        shadow: false,
        outside: true,
        hideDelay: 20,
        formatter: function (tooltip) {
        // Hide tooltip for pie series
            if (this.series.options.type === 'pie') {
                return false;
            }
            // If not null, use the default formatter
            return tooltip.defaultFormatter.call(this, tooltip);
        }
    },
    plotOptions: {
        series: {
            states: {
                inactive: {
                    enabled: false
                }
            }
        },
        pie: {
            states: {
                hover: {
                    halo: 0
                }
            }
        }
    },
    series: [{
        colorKey: 'custom.stellarMagnitude',
        maxSize: 14,
        minSize: 3,
        tooltip: {
            pointFormat: '<span class="smaller">Name:</span> {point.name}<br><span class="smaller">Mass:</span> {point.custom.planetMass}<br><span class="smaller">Distance:</span> {point.custom.lightYears} Light Years<br><span class="smaller">Stellar Magnitude:</span> {point.custom.stellarMagnitude}'
        }
    }, {
        type: 'pie',
        dataLabels: {
            enabled: false
        },
        size: '40%',
        innerSize: '85%',
        zIndex: -1,
        point: {
            events: {
                mouseOver() {
                    const {
                            minDate,
                            maxDate
                        } = this.options,
                        point = this,
                        series = this.series,
                        chart = series.chart,
                        bubbleSeries = chart.series[0];

                    bubbleSeries.points.forEach(point => {
                        if (
                            point.options.custom.discoveryDate < minDate ||
                            point.options.custom.discoveryDate >= maxDate
                        ) {
                            point.graphic.attr({
                                opacity: 0.2
                            });
                        }
                    });

                    series.customLabel = fillCenter(point.percentage,
                        point.options.custom.info, chart, series.customLabel);
                },
                mouseOut() {
                    const chart = this.series.chart,
                        series = this.series,
                        bubbleSeries = chart.series[0];

                    bubbleSeries.points.forEach(point => {
                        point.graphic.attr({
                            opacity: 1
                        });
                    });
                    series.customLabel = fillCenter(100, '1990s-2020s', chart,
                        series.customLabel);
                }
            }
        },

        data: [{
            y: 12,
            color: '#6CDDCA',
            custom: {
                info: '1990s',
                minDate: 1990,
                maxDate: 2000
            }
        },
        {
            y: 47,
            color: '#C771F3',
            custom: {
                info: '2000s',
                minDate: 2000,
                maxDate: 2010
            }
        },
        {
            y: 117,
            color: '#4D90DB',
            custom: {
                info: '2010s',
                minDate: 2010,
                maxDate: 2020
            }
        },
        {
            y: 64,
            color: '#FAB776',
            custom: {
                info: '2020s',
                minDate: 2020,
                maxDate: 2030
            }
        }
        ]
    }]
});

function fillCenter(percentage, info, chart, customLabel) {
    const labelText = `<span style='font-size: 2em'>☉</span><span
    class='uppercase'><br><span class='decade'>${info}</span><br>
    Planets discovered</span><br><span class='percentage'>
    ${percentage.toFixed(2)}<sup style='font-size: 0.5em;'>%</sup></span>`;

    if (!customLabel) {
        customLabel = chart.renderer.label(labelText, 0, 0, void 0, void 0,
            void 0, true
        ).css({
            color: '#000',
            textAlign: 'center',
            'pointer-events': 'none'
        }).add();
    } else {
        customLabel.attr({
            text: labelText
        });
    }
    customLabel.attr({
        x: (chart.chartWidth / 2) - customLabel.attr('width') / 2,
        y: (chart.chartHeight / 2) - (customLabel.attr('height') / 2) + 10
    });
    return customLabel;
}
