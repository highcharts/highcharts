const chart = Highcharts.chart('container', {
    title: {
        text: 'Audio Chart',
        align: 'left',
        margin: 15
    },
    legend: {
        enabled: false
    },
    sonification: {
        duration: 9500,
        afterSeriesWait: 1100,
        events: {
            // Announce first series before playing
            beforePlay: function (e: { chart: Highcharts.Chart }) {
                e.chart.sonification.speak('Revenue');
            },
            // Announce second series after first one ends
            onSeriesEnd: function (e: { series: Highcharts.Series }) {
                if (e.series.index === 0) {
                    e.series.chart.sonification.speak('Profit margin', {}, 150);
                }
            }
        },
        defaultInstrumentOptions: {
            mapping: {
                playDelay: 750, // Give room for beforePlay announcement
                noteDuration: 400
            }
        }
    },
    tooltip: {
        positioner: function (x, y, ctx) {
            const bBox = this.getLabel().getBBox();
            y = this.chart.plotTop + ctx.plotY - bBox.height - 10;
            if (y < this.chart.plotTop) {
                // Go below point
                y = this.chart.plotTop + ctx.plotY + 10;
            }
            return {
                x: Math.min(
                    this.chart.plotLeft + ctx.plotX - bBox.width / 2,
                    this.chart.chartWidth - bBox.width - 10
                ),
                y
            };
        }
    },
    accessibility: {
        landmarkVerbosity: 'one',
        point: {
            describeNull: false
        }
    },
    yAxis: [{
        top: '0%',
        height: '72%',
        title: {
            text: 'Revenue (millions)'
        },
        lineWidth: 1
    }, {
        top: '85%',
        height: '15%',
        offset: 0,
        title: {
            text: 'Profit margin'
        },
        labels: {
            format: '{text}%'
        },
        plotBands: [{
            from: 0,
            to: 30,
            color: 'var(--highcharts-neutral-color-3, #f6f7f8)'
        }]
    }],
    xAxis: {
        minPadding: 0.04,
        maxPadding: 0.04,
        accessibility: {
            rangeDescription: '2017 to 2024'
        }
    },
    plotOptions: {
        series: {
            states: {
                inactive: {
                    enabled: false
                }
            }
        }
    },
    data: {
        csv: document.getElementById('csv').textContent
    },
    series: [{
        type: 'spline',
        sonification: {
            tracks: [{
                roundToMusicalNotes: false
            }]
        }
    }, {
        type: 'column',
        yAxis: 1,
        pointWidth: 30
    }]
} satisfies Highcharts.Options);

document.getElementById('sonify').onclick = function () {
    chart.toggleSonify();
};

// Populate preset dropdown
Object.keys(
    Highcharts.sonification.InstrumentPresets
).forEach(function (preset) {
    const option = document.createElement('option');
    option.textContent = option.value = preset;
    document.getElementById('preset').appendChild(option);
});

(document.getElementById('preset') as HTMLSelectElement)
    .addEventListener('change', function () {
        chart.update({
            sonification: {
                defaultInstrumentOptions: {
                    instrument: this.value
                }
            }
        }, false);
    });
