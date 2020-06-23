var chart = Highcharts.chart('container', {
    chart: {
        type: 'spline'
    },
    title: {
        text: 'Sonify series in order'
    },
    subtitle: {
        text: 'Earcons played on series begin and end'
    },
    sonification: {
        duration: 7000,
        defaultInstrumentOptions: {
            minFrequency: 220,
            maxFrequency: 2200,
            mapping: {
                duration: 200
            }
        },
        events: {
            // Play a quick triangle tone on series start
            onSeriesStart: function () {
                (new Highcharts.sonification.Earcon({
                    instruments: [{
                        instrument: 'triangleMajor',
                        playOptions: {
                            // Play a quick rising frequency
                            frequency: function (time) {
                                return time * 1760 + 440;
                            },
                            volume: 0.3,
                            duration: 120
                        }
                    }]
                })).sonify();
            },
            // Play a quick sawtooth tone on series end
            onSeriesEnd: function () {
                (new Highcharts.sonification.Earcon({
                    instruments: [{
                        instrument: 'sawtoothMajor',
                        playOptions: {
                            // Play a quick falling frequency
                            frequency: function (time) {
                                return (1 - time) * 1760;
                            },
                            volume: 0.3,
                            duration: 120
                        }
                    }]
                })).sonify();
            },
            // Play a low tone on chart end
            onEnd: function () {
                (new Highcharts.sonification.Earcon({
                    instruments: [{
                        instrument: 'squareMajor',
                        playOptions: {
                            // Play a longer low frequency
                            frequency: 55,
                            volume: 0.2,
                            duration: 320
                        }
                    }]
                })).sonify();
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
    chart.sonify();
};
