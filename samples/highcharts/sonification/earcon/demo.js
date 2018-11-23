
var earconA = new Highcharts.sonification.Earcon({
        instruments: [{
            instrument: 'sine',
            playOptions: {
                frequency: 440,
                duration: 500
            }
        }, {
            instrument: 'sine',
            playOptions: {
                frequency: 659.25,
                duration: 500
            }
        }, {
            instrument: 'sine',
            playOptions: {
                frequency: 554.37,
                duration: 500
            }
        }]
    }),
    earconB = new Highcharts.sonification.Earcon({
        instruments: [{
            // A sequence of high notes
            instrument: 'sine',
            playOptions: {
                frequency: function (time) {
                    var sequence = [
                        880, 1108.73, 1174.66, 1760, 1975.53, 2637.02, 2637.02
                    ];
                    return sequence[
                        Math.round((sequence.length - 1) * time)
                    ];
                },
                duration: 1200
            }
        }, {
            // Mid bass
            instrument: 'square',
            playOptions: {
                frequency: 110,
                duration: 1350,
                volume: 0.2
            }
        }, {
            // Low bass, fades in and pans across from left
            instrument: 'square',
            playOptions: {
                frequency: 55,
                duration: 1250,
                volume: function (time) {
                    return Math.min(time * time, 0.2);
                },
                pan: function (time) {
                    return time * time - 1;
                }
            }
        }, {
            // Triangle pad, fades in and pans across from right
            instrument: 'triangle',
            playOptions: {
                frequency: 164.81,
                duration: 1300,
                volume: function (time) {
                    return Math.min(time * time, 0.7);
                },
                pan: function (time) {
                    return 1 - time * time;
                }
            }
        }],
        volume: 0.7 // Master volume (does not affect the faded instruments)
    });

// Play a chord
document.getElementById('playA').onclick = function () {
    earconA.play();
};

// Play an arpeggio
document.getElementById('playB').onclick = function () {
    earconB.play();
};
