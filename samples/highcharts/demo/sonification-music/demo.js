const masterVolume = 0.85;

// ------------------------------------------------------------------------
// Controls

// Mute/unmute an instrument without stopping play
function setInstrumentMute(targetSeriesIx, channels, mute) {
    channels.forEach(function (ch) {
        if (ch.events[0].relatedPoint.series.index === targetSeriesIx) {
            ch.engine.setMasterVolume(mute ? 0 : masterVolume);
        }
    });
}

// Called on chart render
function onRender() {
    const chart = this;

    // Chart play button
    document.getElementById('play').onclick = function () {
        chart.toggleSonify(true, function () {
            // Reset crosshair on end since we are animating it
            chart.series[0].xAxis.drawCrosshair(
                void 0, chart.series[0].points[0]
            );
            chart.series[0].xAxis.hideCrosshair();
        });
    };

    // Handle checkbox clicks for each instrument
    ['bass-on', 'chimes-on', 'shaker1-on', 'piano-on', 'flute-on',
        'synth-on', 'shaker2-on', 'pad-on', 'basspad-on'
    ].forEach(function (id, seriesIx) {
        const series = chart.series[seriesIx];
        document.getElementById(id).onclick = function () {
            const timeline = chart.sonification.timeline,
                muted = !this.checked;
            if (timeline) {
                if (
                    series.options.sonification &&
                    series.options.sonification.enabled === false &&
                    !muted
                ) {
                    // Series was muted before timeline was made, have to do
                    // update & rebuild
                    series.update({
                        sonification: { enabled: true }
                    });
                }
                setInstrumentMute(seriesIx, timeline.channels, muted);
            } else {
                // Timeline not built yet - user interaction needed on page
                series.update({
                    sonification: { enabled: !muted }
                }, false);
            }
            series.setState(muted ? 'inactive' : 'normal');
        };
    });

    // Set plot border radius
    chart.plotBackground.attr('r', '9px');

    // Expose y axis titles to screen readers directly
    chart.yAxis.forEach(function (a) {
        a.axisGroup.div.setAttribute('aria-hidden', 'false');
    });
}


// ------------------------------------------------------------------------
// Chart

Highcharts.SVGRenderer.prototype.symbols.box = function (x, y, w, h) {
    const x2 = w * 2;
    return ['M', x, y, 'L', x + x2, y, 'L', x + x2, y + h, 'L', x, y + h, 'z'];
};

// Allow input tags in axis labels
Highcharts.AST.allowedTags.push('input');
Highcharts.AST.allowedTags.push('label');
Highcharts.AST.allowedAttributes.push('checked');

// Convenience function to get y axis options, since we have 9 of them
function buildYAxisOpts(height, top, labelText, checkboxId, iconSrc) {
    return {
        height: height + '%', // Axis height
        top: top + '%', // Axis offset from top
        offset: 0,
        labels: {
            enabled: false
        },
        accessibility: {
            description: labelText
        },
        gridLineWidth: 0,
        title: {
            rotation: 0,
            offset: 70,
            useHTML: true,
            style: {
                width: 120
            },
            // Checkbox, icon and axis title combined here
            text: '<label class="hc-axis-title"><input id="' + checkboxId +
                '" type="checkbox" checked><img alt="" src="' +
                iconSrc + '" class="hc-axis-icon"> <span class="hc-axis-title-text">' +
                labelText + '</span></label>'
        }
    };
}

Highcharts.chart('container', {
    chart: {
        type: 'scatter',
        marginLeft: 150,
        marginBottom: 25,
        events: {
            render: onRender
        },
        plotBackgroundColor: '#F7F7F8',
        plotShadow: {
            color: '#aaa',
            opacity: 0.1,
            width: 10
        },
        scrollablePlotArea: {
            minWidth: 700,
            opacity: 0.94
        }
    },
    title: {
        text: 'Musical Chart',
        align: 'left',
        margin: 25,
        style: {
            fontSize: '1.4rem'
        }
    },
    subtitle: {
        text: 'Using the built-in Highcharts Synthesizer',
        align: 'left'
    },
    sonification: {
        duration: 14400,
        order: 'simultaneous',
        showTooltip: false,
        masterVolume: masterVolume,
        defaultInstrumentOptions: {
            // Only show for one track since we have some delayed tracks
            showPlayMarker: false
        }
    },
    accessibility: {
        keyboardNavigation: {
            enabled: false
        },
        screenReaderSection: {
            beforeChartFormat: '<{headingTagName}>{chartTitle}</{headingTagName}><div>{typeDescription}</div><div>{chartSubtitle}</div><div>{chartLongdesc}</div><div>{xAxisDescription}</div><div>{yAxisDescription}</div>'
        },
        landmarkVerbosity: 'one'
    },
    lang: {
        accessibility: {
            axis: {
                xAxisDescriptionSingular: 'The chart has 1 X axis displaying time.'
            }
        }
    },
    data: {
        csv: document.getElementById('csv').textContent,
        complete: function (opts) {
            delete opts.xAxis;
            // Assign each series to their own y-axes
            opts.series.forEach(function (s, ix) {
                s.yAxis = ix;
            });
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        enabled: false
    },
    xAxis: {
        crosshair: {
            enabled: true,
            width: 10,
            color: '#609A5E',
            className: 'hc-crosshair' // Smoothed with CSS transitions
        },
        visible: false,
        minPadding: 0.02
    },
    // Each series gets its own y axis
    yAxis: [
        buildYAxisOpts(
            9, 1, 'Bass', 'bass-on',
            'https://upload.wikimedia.org/wikipedia/commons/3/37/Papapishu-double-bass-1.svg'
        ),
        buildYAxisOpts(
            9, 11, 'Chimes', 'chimes-on',
            'https://upload.wikimedia.org/wikipedia/commons/e/ee/Bell_by_hatalar205.svg'
        ),
        buildYAxisOpts(
            5, 21, 'Shaker 1', 'shaker1-on',
            'https://upload.wikimedia.org/wikipedia/commons/a/a1/Maracas.svg'
        ),
        buildYAxisOpts(
            9, 27, 'Piano', 'piano-on',
            'https://upload.wikimedia.org/wikipedia/commons/5/50/Piano.svg'
        ),
        Highcharts.merge(
            buildYAxisOpts(
                26, 37, 'Flute', 'flute-on',
                'https://upload.wikimedia.org/wikipedia/commons/c/ce/Quena.svg'
            ), {
                plotBands: [{
                    from: -10,
                    to: 20,
                    color: '#404543'
                }],
                min: -1,
                max: 13
            }
        ),
        buildYAxisOpts(
            9, 64, 'Synth', 'synth-on',
            'https://upload.wikimedia.org/wikipedia/commons/9/99/Nuvola_apps_kcmmidi.svg'
        ),
        buildYAxisOpts(
            5, 74, 'Shaker 2', 'shaker2-on',
            'https://upload.wikimedia.org/wikipedia/commons/a/a1/Maracas.svg'
        ),
        buildYAxisOpts(
            9, 80, 'Pad', 'pad-on',
            'https://upload.wikimedia.org/wikipedia/commons/9/99/Nuvola_apps_kcmmidi.svg'
        ),
        buildYAxisOpts(
            9, 90, 'Bass Pad', 'basspad-on',
            'https://upload.wikimedia.org/wikipedia/commons/9/99/Nuvola_apps_kcmmidi.svg'
        )
    ],
    plotOptions: {
        series: {
            enableMouseTracking: false,
            accessibility: {
                exposeAsGroupOnly: true
            }
        }
    },

    // Sonification mappings for each series
    // ----------------------------------------------------------------------
    series: [{
        // Bass
        sonification: {
            defaultInstrumentOptions: {
                instrument: 'vibraphone',
                mapping: {
                    pitch: {
                        mapTo: 'y',
                        min: 'd2',
                        max: 'd3'
                    },
                    pan: 0,
                    volume: 0.4
                }
            }
        },
        color: 'transparent',
        marker: {
            symbol: 'circle',
            radius: 5,
            lineColor: '#505F55',
            lineWidth: 3
        }
    }, {
        // Chimes
        sonification: {
            defaultInstrumentOptions: {
                instrument: 'vibraphone',
                mapping: {
                    pitch: {
                        mapTo: 'y',
                        min: 'd5',
                        max: 'g6'
                    },
                    volume: 0.08,
                    pan: 0.95
                }
            },
            tracks: [{
                // Default
            }, {
                mapping: {
                    pitch: {
                        min: 'd6',
                        max: 'g7'
                    },
                    volume: 0.06,
                    playDelay: 11
                }
            }]
        },
        colorByPoint: true,
        colors: ['#c0f090', '#b0c0f0', '#f0c090', '#f0f070'],
        marker: {
            symbol: 'diamond',
            radius: 4,
            lineColor: '#608060',
            lineWidth: 2
        }
    }, {
        // Shaker 1
        sonification: {
            defaultInstrumentOptions: {
                instrument: 'shaker',
                mapping: {
                    volume: 0.25,
                    pan: -1
                }
            },
            tracks: [{
                // Default
            }, {
                instrument: 'kick',
                mapping: {
                    pan: 0,
                    volume: 0.2,
                    pitch: {
                        // Map to Y, but always map to the same pitch,
                        // so we play only when there is a Y value
                        min: 'd5',
                        max: 'd5'
                    }
                },
                activeWhen: {
                    prop: 'x',
                    min: 24
                }
            }]
        },
        color: '#204020',
        marker: {
            symbol: 'box',
            radius: 2
        }
    }, {
        // Piano
        sonification: {
            defaultInstrumentOptions: {
                instrument: 'piano',
                mapping: {
                    pitch: {
                        mapTo: 'y',
                        min: 'd3',
                        max: 'e4'
                    },
                    highpass: {
                        frequency: 300
                    },
                    lowpass: {
                        frequency: 6000,
                        resonance: 9
                    },
                    pan: -1,
                    volume: 0.12
                }
            },
            tracks: [{
                // We use this track for play marker since it plays constantly
                showPlayMarker: true
            }, {
                // Delay
                mapping: {
                    volume: 0.05,
                    playDelay: 169
                }
            }, {
                // Plucked double comes in eventually
                instrument: 'plucked',
                mapping: {
                    volume: 0.12,
                    lowpass: {
                        frequency: 6000
                    },
                    pan: 1,
                    playDelay: -4
                },
                // This track comes in when x = 24
                activeWhen: {
                    prop: 'x',
                    min: 24
                }
            }, {
                // Delay for plucked
                instrument: 'plucked',
                mapping: {
                    lowpass: {
                        frequency: 4000
                    },
                    highpass: {
                        frequency: 300
                    },
                    volume: 0.07,
                    pan: 1,
                    playDelay: 338
                },
                activeWhen: {
                    prop: 'x',
                    min: 24
                }
            }]
        },
        type: 'spline',
        color: '#42b862',
        marker: {
            symbol: 'circle',
            radius: 3,
            lineColor: '#408050',
            lineWidth: 2
        }
    }, {
        // Flute
        sonification: {
            defaultInstrumentOptions: {
                instrument: 'flute',
                mapping: {
                    pitch: {
                        mapTo: 'y',
                        min: 'd5',
                        max: 'd6'
                    },
                    pan: 0,
                    noteDuration: 280,
                    volume: 0.6,
                    playDelay: -2
                }
            },
            tracks: [{
                // Default
            }, {
                // Delay 1
                mapping: {
                    volume: 0.2,
                    playDelay: 169,
                    pan: -0.3,
                    highpass: {
                        frequency: 300
                    }
                }
            }, {
                // Delay 2
                mapping: {
                    volume: 0.12,
                    playDelay: 338,
                    pan: 0.3,
                    highpass: {
                        frequency: 600
                    },
                    lowpass: {
                        frequency: 7000
                    }
                }
            }, {
                // Delay 3
                mapping: {
                    volume: 0.05,
                    playDelay: 676,
                    pan: -0.3,
                    highpass: {
                        frequency: 800
                    },
                    lowpass: {
                        frequency: 4000
                    }
                }
            }]
        },
        type: 'spline',
        dashStyle: 'Solid',
        color: '#EAFFEA',
        lineWidth: 3,
        shadow: {
            color: '#cfe',
            offsetY: 5,
            width: 5
        },
        marker: {
            enabled: false
        }
    }, {
        // Synth
        sonification: {
            defaultInstrumentOptions: {
                instrument: 'sawsynth',
                mapping: {
                    pitch: {
                        mapTo: 'y',
                        min: 'd4',
                        max: 'e5'
                    },
                    lowpass: {
                        frequency: 8000
                    },
                    highpass: {
                        frequency: 800
                    },
                    pan: {
                        mapTo: 'y',
                        within: 'series',
                        min: -1,
                        max: 1
                    },
                    volume: {
                        mapTo: 'y',
                        within: 'series',
                        min: 0.05,
                        max: 0.15
                    },
                    playDelay: 4
                }
            },
            tracks: [{
                // Default
            }, {
                // Negative delay
                mapping: {
                    playDelay: -338,
                    volume: 0.09,
                    pan: -1,
                    pitch: {
                        min: 'd5',
                        max: 'e6'
                    }
                }
            }, {
                // Delay
                mapping: {
                    playDelay: 169,
                    volume: 0.07,
                    pan: -0.5,
                    pitch: {
                        min: 'd5',
                        max: 'e6'
                    }
                }
            }]
        },
        type: 'spline',
        color: '#42b862',
        marker: {
            symbol: 'circle',
            radius: 3,
            lineColor: '#408050',
            lineWidth: 2
        }
    }, {
        // Shaker 2
        sonification: {
            tracks: [{
                instrument: 'chop',
                mapping: {
                    volume: 0.35,
                    pan: 1
                }
            }, {
                instrument: 'shaker',
                mapping: {
                    volume: 0.05,
                    pan: -1
                }
            }]
        },
        color: '#204020',
        marker: {
            symbol: 'box',
            radius: 2
        }
    }, {
        // Pad
        sonification: {
            defaultInstrumentOptions: {
                instrument: 'triangle',
                mapping: {
                    pitch: {
                        mapTo: 'y',
                        min: 'd3',
                        max: 'd4'
                    },
                    noteDuration: 1350,
                    lowpass: {
                        frequency: 1000
                    },
                    pan: {
                        mapTo: 'y',
                        within: 'series',
                        min: 0,
                        max: 1
                    },
                    volume: {
                        mapTo: 'y',
                        within: 'series',
                        min: 0.04,
                        max: 0.1
                    }
                }
            },
            tracks: [{
                // Default
            }, {
                mapping: {
                    pitch: {
                        min: 'd2',
                        max: 'd3'
                    },
                    playDelay: 6,
                    pan: -1
                }
            }, {
                mapping: {
                    pitch: {
                        min: 'd4',
                        max: 'd5'
                    },
                    playDelay: 9
                }
            }]
        },
        type: 'spline',
        connectNulls: true,
        color: '#42b862',
        marker: {
            symbol: 'circle',
            radius: 3,
            lineColor: '#408050',
            lineWidth: 2
        }
    }, {
        // Bass pad
        sonification: {
            defaultInstrumentOptions: {
                instrument: 'triangle',
                mapping: {
                    pitch: {
                        mapTo: 'y',
                        min: 'd1',
                        max: 'd2'
                    },
                    volume: 0.16,
                    noteDuration: 1300,
                    lowpass: {
                        frequency: 500
                    },
                    tremolo: {
                        speed: 0.23,
                        depth: 0.1
                    },
                    pan: 0,
                    playDelay: 15
                }
            }
        },
        type: 'spline',
        connectNulls: true,
        color: '#327862',
        marker: {
            symbol: 'square',
            radius: 4,
            lineColor: '#408050',
            lineWidth: 2
        }
    }]
});
