const playDuration = 25000;

let lastMonth;

const chart = Highcharts.stockChart('container', {
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
        showTooltip: false,
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
            },
            // Only show marker for the main tracks
            showPlayMarker: false
        },
        events: {
            beforeUpdate: function () {
                lastMonth = null; // Reset for speech context.
            }
        },
        // Speak months
        globalContextTracks: [{
            type: 'speech',
            mapping: {
                text: function (context) {
                    const date = new Date(context.value);
                    return date.toLocaleString('en-US', { month: 'long' });
                },
                rate: 2.5,
                volume: 0.3
            },
            valueInterval: 1000 * 60 * 60 * 24, // One day
            activeWhen: function (context) {
                // Speak only when there is a new month
                const month = new Date(context.value).getMonth(),
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
            let i = columns[0].length;
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
                    const timeline = this.chart.sonification &&
                        this.chart.sonification.timeline;
                    if (timeline) {
                        const x = event.point.x,
                            xAxis = this.xAxis,
                            startTime = playDuration *
                                (x - xAxis.min) / (xAxis.max - xAxis.min);
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
        },
        accessibility: {
            description: 'Temperature'
        }
    }, {
        opposite: false,
        gridLineWidth: 0,
        labels: {
            format: '{text}%'
        },
        accessibility: {
            description: 'Humidity'
        }
    }, {
        opposite: false,
        gridLineWidth: 0,
        labels: {
            format: '{text} mph'
        },
        accessibility: {
            description: 'Wind speed'
        }
    }, {
        visible: false,
        accessibility: {
            description: 'Precipitation'
        }
    }, {
        opposite: false,
        gridLineWidth: 0,
        labels: {
            format: '{text} hPa'
        },
        accessibility: {
            description: 'Air pressure'
        }
    }, {
        visible: false,
        accessibility: {
            description: 'Visibility'
        }
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
                },
                showPlayMarker: true
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
                },
                showPlayMarker: true
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
                groupTimespan: 100
            },
            tracks: [{
                instrument: 'wind',
                showPlayMarker: true,
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
                    groupTimespan: 150
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
                        speed: {
                            mapTo: 'y',
                            within: 'series',
                            min: 0.3,
                            max: 0.4
                        },
                        depth: 1
                    },
                    highpass: {
                        frequency: {
                            mapTo: '-y',
                            within: 'series',
                            min: 1,
                            max: 1000
                        }
                    }
                }
            },
            tracks: [{
                // Default track always playing
                showPlayMarker: true
            }, {
                // Adding more tracks above certain thresholds
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
        tooltip: {
            valueDecimals: 2
        },
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


// ---------------------------------------------------------------
// Custom legend

function playEarcon(id) {
    const instr = {
            temp: ['piano', 'a6', 'e5'],
            humid: ['flute', 'a5', 'e5'],
            wind: ['wind', 'c5', 'c6'],
            pressure: ['vibraphone', 'c3', 'd#3'],
            rain: ['chord', 'c3', 'g3'],
            visibility: ['noise', 'c1', 'c1']
        }[id],
        opts = function (note) {
            return {
                note: note,
                noteDuration: 200,
                tremoloDepth: 0,
                pan: 0,
                volume: id === 'visibility' ? 0.15 : 0.5
            };
        };
    chart.sonification.playNote(instr[0], opts(instr[1]));
    chart.sonification.playNote(instr[0], opts(instr[2]), 200);
}

['temp', 'humid', 'wind', 'pressure'].forEach(function (id, ix) {
    document.getElementById(id).onclick = function () {
        chart.series[0].setVisible(ix === 0, false);
        chart.series[1].setVisible(ix === 1, false);
        chart.series[2].setVisible(ix === 2, false);
        chart.series[4].setVisible(ix === 3, false);
        chart.redraw();
        playEarcon(id);
    };
});
document.getElementById('rain').onclick = function () {
    chart.series[3].setVisible(this.checked);
    if (this.checked) {
        playEarcon('rain');
    }
};
document.getElementById('visibility').onclick = function () {
    chart.series[5].setVisible(this.checked);
    if (this.checked) {
        playEarcon('visibility');
    }
};
document.getElementById('months').onclick = function () {
    // Handled in options, but we have to manually trigger update
    // since the sonification is prebuilt.
    chart.sonification.update();

    if (this.checked) {
        chart.sonification.speak('December', {
            rate: 2.5,
            volume: 0.2
        });
    }
};

// ---------------------------------------------------------------
// Play button

document.getElementById('play').onclick = function () {
    chart.toggleSonify();
};
