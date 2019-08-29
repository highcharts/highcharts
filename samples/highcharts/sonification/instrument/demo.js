var button1 = document.getElementById('play1'),
    button2 = document.getElementById('play2'),
    button3 = document.getElementById('play3'),
    sine = Highcharts.sonification.instruments.sine,
    square = Highcharts.sonification.instruments.square,
    triangle = Highcharts.sonification.instruments.triangle,
    sawtooth = Highcharts.sonification.instruments.sawtooth,
    // Add a few instruments of our own. One instrument can only play one note
    // at a time.
    sine2 = new Highcharts.sonification.Instrument(),
    sine3 = new Highcharts.sonification.Instrument();

// Play some simple notes when clicking this button
button1.onclick = function () {
    square.play({
        frequency: 329.63, // E4
        duration: 2000,
        pan: -1,
        volume: 0.2
    });
    triangle.play({
        frequency: 440, // A4
        duration: 2000,
        pan: 0,
        volume: 0.7
    });
    sine.play({
        frequency: 659.25, // E5
        duration: 2000,
        pan: 1,
        volume: 0.4
    });
};

// Here we play notes and when they are done we start a new play using the
// onEnd callback.
button2.onclick = function () {
    sawtooth.play({
        frequency: 523.25, // C5
        duration: 700,
        pan: -0.6,
        volume: 0.4,
        onEnd: function () {
            sawtooth.play({
                frequency: 554.37, // C#5
                duration: 700,
                pan: -0.6,
                volume: 0.4
            });
        }
    });
    sine2.play({
        frequency: 987.77, // B5
        duration: 700,
        pan: 0.7,
        volume: 0.5,
        onEnd: function () {
            sine2.play({
                frequency: 880.00, // A5
                duration: 700,
                pan: 0.7,
                volume: 0.5
            });
        }
    });
};

// Set a large number of timeout callbacks and make each one play a note.
// We alternate between two different notes. The note duration is low enough
// that there is no fading out of the notes, meaning we can get some clicking
// noise from certain browsers.
button3.onclick = function () {
    var duration = 20;
    for (var i = 0; i < 60; ++i) {
        setTimeout(
            i % 2 ?
                function play() {
                    sine3.play({
                        frequency: 1760, // A6
                        volume: 0.4,
                        duration: duration
                    });
                } :
                function () {
                    sine3.play({
                        frequency: 1318.51, // E6
                        volume: 0.4,
                        duration: duration
                    });
                },
            i * 50
        );
    }
};
