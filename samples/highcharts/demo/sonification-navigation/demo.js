const chart = Highcharts.chart('container', {
    chart: {
        type: 'spline'
    },
    title: {
        text: null
    },
    sonification: {
        duration: 27000,
        afterSeriesWait: 1200,
        defaultInstrumentOptions: {
            instrument: 'basic2',
            mapping: {
                playDelay: 500
            }
        },
        // Speak the series name at beginning of series
        globalTracks: [{
            type: 'speech',
            mapping: {
                text: '{point.series.name}',
                volume: 0.4,
                rate: 2
            },
            // Active on first point in series only
            activeWhen: function (e) {
                return e.point && !e.point.index;
            }
        }]
    },
    accessibility: {
        screenReaderSection: {
            axisRangeDateFormat: '%B %Y',
            beforeChartFormat: ''
        },
        point: {
            dateFormat: '%b %e, %Y',
            valueDescriptionFormat: '{value}{separator}{xDescription}'
        },
        series: {
            pointDescriptionEnabledThreshold: false
        }
    },
    colors: ['#3d3f51', '#42858C', '#AD343E'],
    plotOptions: {
        series: {
            label: {
                connectorAllowed: true
            },
            marker: {
                enabled: false
            },
            cropThreshold: 10
        }
    },
    data: {
        csv: document.getElementById('csv').textContent
    },
    yAxis: {
        title: {
            text: null
        },
        accessibility: {
            description: 'Percent unemployment of labor force'
        },
        labels: {
            format: '{text}%'
        }
    },
    xAxis: {
        accessibility: {
            description: 'Time'
        },
        type: 'datetime'
    },
    tooltip: {
        valueSuffix: '%',
        stickOnContact: true
    },
    legend: {
        enabled: false
    }
});


// Handle the keyboard navigation
document.getElementById('controls').onkeydown = function (e) {
    let lastPlayed;

    const speaker = new Highcharts.sonification.SonificationSpeaker({
        volume: 0.4, rate: 2
    });

    // Announce values + series name after playing individual points. We
    // just reuse the accessibility description for the point, for simplicity.
    // We use a single SonificationSpeaker for the announcement, since it makes
    // it easy to avoid multiple announcements overlapping.
    function onSinglePointPlayed(e) {
        const point = e.pointsPlayed && e.pointsPlayed[0];
        if (point) {
            speaker.sayAtTime(700, point.accessibility.valueDescription +
                ' ' + point.series.name);
        }
    }

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        chart.sonification.playAdjacent(
            e.key === 'ArrowRight', onSinglePointPlayed);

    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const newSeries = chart.sonification
            .playAdjacentSeries(e.key === 'ArrowUp', 'x', onSinglePointPlayed);
        lastPlayed = chart.sonification.getLastPlayedPoint();
        if (lastPlayed.x && newSeries) {
            // Speak new series if not first point
            chart.sonification.speak(newSeries.name);
        }

    } else if (e.key === ' ') {
        chart.toggleSonify(false);

    } else if (e.key === 'Home' || e.key === 'End') {
        lastPlayed = chart.sonification.getLastPlayedPoint();
        if (lastPlayed) {
            lastPlayed.series.points[e.key === 'End' ?
                lastPlayed.series.points.length - 1 : 0
            ].sonify(onSinglePointPlayed);
        }

    } else {
        return; // Don't prevent default on unknown keys
    }
    speaker.cancel();
    e.preventDefault();
};


// Start sonification mode
document.getElementById('sonify').onclick = function () {
    // Show the help field and set keyboard focus to it
    const controls = document.getElementById('controls');
    controls.className = 'visible';

    setTimeout(function () {
        controls.focus();
    }, 10);

    // Notification sound to indicate something happened
    chart.sonification.playNote('vibraphone', {
        note: 'g6', volume: 0.2, noteDuration: 300
    });
};
