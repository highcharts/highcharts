var playDuration = 25000,
    lastMonth,
    crosshairStart,
    crosshairInterval;

var chart = Highcharts.stockChart('container', {
    title: {
        text: 'JFK Airport Climate Data for 2013',
        align: 'left'
    },
    subtitle: {
        text: 'Source: data.world',
        align: 'left'
    },
    sonification: {
        masterVolume: 0.5,
        duration: playDuration,
        order: 'simultaneous',
        showPlayMarker: false, // We manually trigger crosshair instead
        pointGrouping: {
            groupTimespan: 250,
            algorithm: 'minmax'
        },
        defaultInstrumentOptions: {
            mapping: {
                pitch: {
                    min: 'a3',
                    max: 'a7'
                }
            }
        },
        events: {
            beforeUpdate: function () {
                lastMonth = null; // Reset for speech context.
            },
            // Show smooth crosshair when sonifying. Since we use
            // pointGrouping aggressively, the normal play marker will
            // jump around a bit, so this looks nicer.
            onPlay: function (timeline) {
                var len = timeline.getLength(),
                    points = crosshairStart.series.points,
                    endIx = points.length - 1;
                crosshairInterval = setInterval(function () {
                    var ix = timeline.getCurrentTime() / len * endIx,
                        point = points[
                            Math.round(
                                crosshairStart.index - points[0].index + ix
                            )
                        ];
                    if (point) {
                        // Highlight point with crosshair
                        point.series.xAxis.drawCrosshair(void 0, point);
                    }
                }, len / 300);
            },
            onStop: function () {
                clearInterval(crosshairInterval);
            }
        },
        // Speak months
        globalContextTracks: [{
            type: 'speech',
            mapping: {
                text: function (context) {
                    var date = new Date(context.value);
                    return date.toLocaleString('en-US', { month: 'long' });
                },
                rate: 2.5,
                volume: 0.5
            },
            valueInterval: 1000 * 60 * 60 * 24, // One day
            activeWhen: function (context) {
                // Speak only when there is a new month
                var month = new Date(context.value).getMonth(),
                    shouldSpeak = month !== lastMonth &&
                        document.getElementById('months').checked;
                lastMonth = month;
                return shouldSpeak;
            }
        }]
    },
    rangeSelector: {
        selected: 1,
        verticalAlign: 'bottom'
    },
    data: {
        csv: document.getElementById('csv').textContent,
        parsed: function (columns) {
            // Transform dates to UNIX epoch.
            var i = columns[0].length;
            while (i--) {
                columns[0][i] = new Date(columns[0][i]).getTime();
            }
        },
        complete: function (opts) {
            delete opts.xAxis;
            // Assign each series to their own y-axes
            opts.series.forEach(function (s, ix) {
                s.yAxis = ix;
            });
        }
    },
    plotOptions: {
        series: {
            events: {
                // Play for a bit after a point when clicking it
                click: function (event) {
                    var timeline = this.chart.sonification &&
                        this.chart.sonification.timeline;
                    if (timeline) {
                        var x = event.point.x,
                            xAxis = this.xAxis,
                            startTime = playDuration *
                                (x - xAxis.min) / (xAxis.max - xAxis.min);
                        crosshairStart = event.point;
                        timeline.play(function (timelineEvent) {
                            return timelineEvent.time > startTime &&
                                timelineEvent.time < startTime + 1500;
                        }, false);
                    }
                }
            },
            cropThreshold: 0 // We play all uncropped points, so make sure they get cropped
        }
    },
    xAxis: {
        crosshair: {
            color: 'rgba(70, 120, 160, 0.7)',
            width: 20,
            className: 'hc-crosshair' // For CSS transition
        },
        minRange: 1000 * 60 * 60 * 24 * 10 // 10 days
    },
    // Each series gets its own y-axis since they measure on different scales
    yAxis: [{
        opposite: false,
        gridLineWidth: 0,
        labels: {
            format: '{text}°F'
        }
    }, {
        opposite: false,
        gridLineWidth: 0,
        labels: {
            format: '{text}%'
        }
    }, {
        opposite: false,
        gridLineWidth: 0,
        labels: {
            format: '{text} mph'
        }
    }, {
        visible: false,
        opposite: false,
        gridLineWidth: 0
    }, {
        opposite: false,
        gridLineWidth: 0,
        labels: {
            format: '{text} hPa'
        }
    }, {
        visible: false,
        opposite: false,
        gridLineWidth: 0
    }],
    series: [{
        // Temperature
        // Sonified using pitch, major pentatonic scale.
        // Different sound when below freezing.
        color: '#C03030',
        negativeColor: '#297AA3',
        threshold: 32,
        opacity: 0.9,
        sonification: {
            pointGrouping: {
                groupTimespan: 125,
                algorithm: 'first'
            },
            defaultInstrumentOptions: {
                mapping: {
                    pitch: {
                        scale: Highcharts.sonification.Scales.majorPentatonic
                    }
                }
            },
            tracks: [{
                activeWhen: {
                    prop: 'y',
                    min: 32 // Above freezing
                }
            }, {
                instrument: 'lead',
                activeWhen: {
                    prop: 'y',
                    max: 31.999 // Below freezing
                },
                mapping: {
                    lowpass: {
                        frequency: 3000
                    },
                    highpass: {
                        frequency: 200
                    },
                    volume: 1.1
                }
            }]
        }
    }, {
        // Humidity
        // Sonified using pitch, minor scale (natural minor, aeolian).
        color: '#46a',
        opacity: 0.7,
        visible: false,
        showInNavigator: true,
        sonification: {
            pointGrouping: {
                groupTimespan: 200
            },
            tracks: [{
                instrument: 'flute',
                mapping: {
                    pitch: {
                        scale: Highcharts.sonification.Scales.minor,
                        min: 'a2',
                        max: 'a6'
                    }
                }
            }]
        }
    }, {
        // Wind speed
        // Sonified using wind instrument, which is bandpassed noise with
        // intensifying tremolo at higher pitches.
        color: '#577',
        opacity: 0.75,
        visible: false,
        showInNavigator: true,
        sonification: {
            pointGrouping: {
                groupTimespan: 300
            },
            tracks: [{
                instrument: 'wind',
                pitch: {
                    min: 'c1',
                    max: 'c7'
                }
            }]
        }
    }, {
        // Precipitation
        // Sonified as chords, adding more notes for more intensity.
        // Dual coded with volume.
        color: '#2050B0',
        type: 'area',
        sonification: {
            defaultInstrumentOptions: {
                instrument: 'chord',
                noteDuration: 600
            },
            tracks: [{
                mapping: {
                    pitch: 'c3',
                    volume: {
                        mapTo: 'y',
                        within: 'series',
                        min: 0.5,
                        max: 1
                    }
                },
                activeWhen: {
                    prop: 'y',
                    min: 0.00001
                }
            }, {
                mapping: {
                    pitch: 'g3'
                },
                activeWhen: {
                    prop: 'y',
                    min: 0.02
                }
            }, {
                mapping: {
                    pitch: 'c4'
                },
                activeWhen: {
                    prop: 'y',
                    min: 0.04
                }
            }, {
                mapping: {
                    pitch: ['g2', 'g4']
                },
                activeWhen: {
                    prop: 'y',
                    min: 0.1
                }
            }]
        }
    }, {
        // Pressure
        // Sonified as a chord, adding more notes for more intensity.
        // Dual coded with volume, tremolo, and highpass filter.
        visible: false,
        color: '#334',
        opacity: 0.7,
        showInNavigator: true,
        sonification: {
            defaultInstrumentOptions: {
                pointGrouping: {
                    groupTimespan: 400
                },
                instrument: 'vibraphone',
                mapping: {
                    volume: {
                        mapTo: 'y',
                        within: 'series',
                        min: 0.4,
                        max: 1
                    },
                    pitch: 'c3',
                    tremolo: {
                        speed: 'y',
                        within: 'series',
                        depth: 1
                    },
                    highpass: {
                        frequency: '-y',
                        within: 'series'
                    }
                }
            },
            tracks: [{}, {
                mapping: {
                    pitch: 'd#3'
                },
                activeWhen: {
                    prop: 'y',
                    min: 1020
                }
            }, {
                mapping: {
                    pitch: 'g3'
                },
                activeWhen: {
                    prop: 'y',
                    min: 1025
                }
            }, {
                mapping: {
                    pitch: 'c4'
                },
                activeWhen: {
                    prop: 'y',
                    min: 1030
                }
            }, {
                mapping: {
                    pitch: 'd#4'
                },
                activeWhen: {
                    prop: 'y',
                    min: 1035
                }
            }, {
                mapping: {
                    pitch: 'c5'
                },
                activeWhen: {
                    prop: 'y',
                    min: 1038
                }
            }]
        }
    }, {
        // Visibility
        // Sonified as noise, with volume and filters indicating intensity
        color: '#778',
        type: 'area',
        opacity: 0.8,
        lineWidth: 1,
        fillOpacity: 0.4,
        threshold: 10,
        sonification: {
            pointGrouping: {
                groupTimespan: 100
            },
            defaultInstrumentOptions: {
                instrument: 'noise',
                activeWhen: {
                    prop: 'y',
                    max: 9.99
                },
                mapping: {
                    volume: {
                        mapTo: '-y',
                        within: 'series',
                        min: 0.01,
                        max: 0.4
                    },
                    highpass: {
                        frequency: {
                            min: 0,
                            max: 2000,
                            mapTo: 'y',
                            within: 'series'
                        }
                    },
                    lowpass: {
                        frequency: {
                            min: 2500,
                            max: 15000,
                            mapTo: '-y',
                            within: 'series'
                        }
                    }
                }
            }
        }
    }]
});


// Custom legend
['temp', 'humid', 'wind', 'pressure'].forEach(function (id, ix) {
    document.getElementById(id).onclick = function () {
        chart.series[0].setVisible(ix === 0, false);
        chart.series[1].setVisible(ix === 1, false);
        chart.series[2].setVisible(ix === 2, false);
        chart.series[4].setVisible(ix === 3, false);
        chart.redraw();
    };
});
document.getElementById('rain').onclick = function () {
    chart.series[3].setVisible(this.checked);
};
document.getElementById('visibility').onclick = function () {
    chart.series[5].setVisible(this.checked);
};
document.getElementById('months').onclick = function () {
    // We have to manually trigger update since the sonification
    // is prebuilt.
    chart.sonification.update();
};

// Play button
document.getElementById('play').onclick = function () {
    if (chart.sonification.isPlaying()) {
        chart.sonification.cancel();
    } else {
        // Start crosshair at beginning of first visible series
        crosshairStart = chart.series.find(function (s) {
            return s.visible;
        }).points[1];

        chart.sonify();
    }
};
