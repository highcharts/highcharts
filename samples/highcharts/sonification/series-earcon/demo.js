Highcharts.chart('container', {
    chart: {
        type: 'areaspline'
    },
    title: {
        text: 'Click series to sonify'
    },
    subtitle: {
        text: 'Crossing triggers earcon'
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            events: {
                click: function () {
                    // Sonify the series when clicked
                    this.sonify({
                        duration: 2000,
                        pointPlayTime: 'x',
                        instruments: [{
                            instrument: 'sineMajor',
                            instrumentMapping: {
                                volume: 0.8,
                                duration: 250,
                                pan: 'x',
                                frequency: 'y'
                            }
                        }],
                        earcons: [{
                            // Define the earcon we want to play
                            earcon: new Highcharts.sonification.Earcon({
                                // Global volume for earcon
                                volume: 0.3,
                                // Play two instruments for this earcon
                                instruments: [{
                                    instrument: 'triangleMajor',
                                    playOptions: {
                                        // Play a rising frequency
                                        frequency: function (time) {
                                            return time * 1760;
                                        },
                                        duration: 200,
                                        pan: 0.8 // Pan 80% right
                                    }
                                }, {
                                    instrument: 'triangleMajor',
                                    playOptions: {
                                        // Play another rising frequency
                                        frequency: function (time) {
                                            return time * 2217;
                                        },
                                        duration: 200,
                                        pan: -0.8 // Pan 80% left
                                    }
                                }]
                            }),
                            // Play this earcon if this point is crossing
                            // another series.
                            condition: function (point) {
                                var chart = point.series.chart;
                                // Go through the other series in the chart
                                // and see if there is a point with the same
                                // value. If so we return true, and the earcon
                                // is played.
                                return chart.series.some(function (series) {
                                    return series !== point.series &&
                                        series.points.some(function (p) {
                                            return p.y === point.y &&
                                                p.x === point.x;
                                        });
                                });
                            }
                        }]
                    });
                }
            }
        }
    },
    series: [{
        data: [1, 2, 4, 5, 7, 9, 11, 13]
    }, {
        data: [4, 5, 9, 5, 2, 1]
    }]
});
