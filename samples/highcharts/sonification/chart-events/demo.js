const chart = Highcharts.chart('container', {
    chart: {
        type: 'spline'
    },
    title: {
        text: 'Sonify series in order',
        align: 'left',
        margin: 25
    },
    subtitle: {
        text: 'Earcons/announcements played on begin/end events',
        align: 'left'
    },
    sonification: {
        duration: 7500,
        events: {
            // Speak series name on start
            onSeriesStart: function (e) {
                e.series.chart.sonification.speak(e.series.name, {
                    rate: 2.5,
                    volume: 0.3
                });
            },
            // Play a noise on series end
            onSeriesEnd: function (e) {
                e.series.chart.sonification.playNote('chop', {
                    note: 0,
                    pan: 1,
                    volume: 1.2
                }, 80);
            },
            // Play notes and then announce end
            onEnd: function (e) {
                const playNote = function (note, time) {
                    e.chart.sonification.playNote('vibraphone', {
                        note: note,
                        noteDuration: 400,
                        pan: 0,
                        volume: 0.4
                    }, time);
                };
                playNote('c6', 40);
                playNote('g6', 200);

                e.chart.sonification.speak('End', {
                    rate: 2,
                    volume: 0.3
                }, 400);
            }
        }
    },
    series: [{
        data: [1, 2, 4, 6, 9, 12, 15, 16]
    }, {
        data: [12, 10, 9, 5, 2, 1, 2, 3]
    }, {
        data: [2, 2, 2, 7, 16, 6, 2, 1]
    }]
});


document.getElementById('sonify').onclick = function () {
    chart.toggleSonify();
};
