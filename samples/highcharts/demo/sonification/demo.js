// Sonification options
var sdInstruments = [{
        instrument: 'sineMajor',
        instrumentMapping: {
            duration: 200,
            frequency: 'y',
            volume: 0.7,
            pan: -1
        },
        instrumentOptions: {
            minFrequency: 220,
            maxFrequency: 1900
        }
    }],
    nyInstruments = [{
        instrument: 'triangleMajor',
        instrumentMapping: {
            duration: 200,
            frequency: 'y',
            volume: 0.6,
            pan: 1
        },
        instrumentOptions: {
            minFrequency: 220,
            maxFrequency: 1900
        }
    }];

// Point of interest options
var poiTime = Date.UTC(2018, 4, 6),
    poiEarcon = {
        // Define the earcon we want to play for the point of interest
        earcon: new Highcharts.sonification.Earcon({
            instruments: [{
                instrument: 'squareMajor',
                playOptions: {
                    // Play a quick rising frequency
                    frequency: function (time) {
                        return time * 1760 + 440;
                    },
                    volume: 0.1,
                    duration: 200
                }
            }]
        }),
        // Play this earcon if we hit the point of interest
        condition: function (point) {
            return point.x === poiTime;
        }
    };

// Create the chart
var chart = Highcharts.chart('container', {
    chart: {
        type: 'spline'
    },
    title: {
        text: 'Play chart as sound'
    },
    subtitle: {
        text: 'Weekly temperature averages'
    },
    yAxis: {
        title: {
            text: 'Temperature (°F)'
        }
    },
    xAxis: {
        type: 'datetime',
        plotLines: [{
            value: poiTime,
            dashStyle: 'dash',
            width: 1,
            color: '#d33'
        }]
    },
    tooltip: {
        split: true,
        valueDecimals: 0,
        valueSuffix: '°F'
    },
    plotOptions: {
        series: {
            marker: {
                enabled: false
            },
            cursor: 'pointer',
            // Sonify points on click
            point: {
                events: {
                    click: function () {
                        // Sonify all points at this x value
                        var targetX = this.x,
                            chart = this.series.chart;
                        chart.series.forEach(function (series) {
                            // Map instruments to the options for this series
                            var instruments = series.options.id === 'sd' ?
                                sdInstruments : nyInstruments;
                            // See if we have a point with the targetX
                            series.points.some(function (point) {
                                if (point.x === targetX) {
                                    point.sonify({
                                        instruments: instruments
                                    });
                                    return true;
                                }
                                return false;
                            });
                        });
                    }
                }
            }
        }
    },
    // Data source: https://www.ncdc.noaa.gov
    data: {
        csv: document.getElementById('csv_data').innerHTML,
        firstRowAsNames: false,
        parsed: function (columns) {
            columns.splice(1, 2); // Remove the non-average columns
        }
    },
    series: [{
        name: 'San Diego',
        id: 'sd',
        color: '#f4b042'
    }, {
        name: 'New York',
        id: 'ny',
        color: '#41aff4'
    }]
});


// Utility function that highlights a point
function highlightPoint(event, point) {
    var chart = point.series.chart,
        hasVisibleSeries = chart.series.some(function (series) {
            return series.visible;
        });
    if (!point.isNull && hasVisibleSeries) {
        point.onMouseOver(); // Show the hover marker and tooltip
    } else {
        if (chart.tooltip) {
            chart.tooltip.hide(0);
        }
    }
}


// On speed change we reset the sonification
document.getElementById('speed').onchange = function () {
    chart.cancelSonify();
};


// Add sonification button handlers
document.getElementById('play').onclick = function () {
    if (!chart.sonification.timeline || chart.sonification.timeline.atStart()) {
        chart.sonify({
            duration: 5000 / document.getElementById('speed').value,
            order: 'simultaneous',
            pointPlayTime: 'x',
            seriesOptions: [{
                id: 'sd',
                instruments: sdInstruments,
                onPointStart: highlightPoint,
                // Play earcon at point of interest
                earcons: [poiEarcon]
            }, {
                id: 'ny',
                instruments: nyInstruments,
                onPointStart: highlightPoint
            }],
            // Delete timeline on end
            onEnd: function () {
                if (chart.sonification.timeline) {
                    delete chart.sonification.timeline;
                }
            }
        });
    } else {
        chart.resumeSonify();
    }
};
document.getElementById('pause').onclick = function () {
    chart.pauseSonify();
};
document.getElementById('rewind').onclick = function () {
    chart.rewindSonify();
};
