var sine = Highcharts.sonification.instruments.sine,
    square = Highcharts.sonification.instruments.square,
    triangle = Highcharts.sonification.instruments.triangle,
    sawtooth = Highcharts.sonification.instruments.sawtooth;

// Play random frequencies with square wave
document.getElementById('playGame').onclick = function () {
    square.play({
        frequency: function () {
            return Math.random() * 1000 + 100;
        },
        duration: 1500,
        pan: function (time) {
            return time * 2 - 1;
        },
        volume: function (time) {
            return Math.min(2 * time * time, 0.7);
        }
    });
};

// Play a rising note
document.getElementById('playRising').onclick = function () {
    sine.play({
        frequency: function (time) {
            return time * 1900 + 100;
        },
        duration: 2000,
        pan: 0,
        volume: function (time) {
            return Math.min(time, 0.7);
        }
    });
};

// Play a falling note
document.getElementById('playFalling').onclick = function () {
    triangle.play({
        frequency: function (time) {
            return 2000 - time * 1900;
        },
        duration: 2000,
        pan: 0,
        volume: function (time) {
            return Math.min(1 - time, 0.7);
        }
    });
};

// Play musical notes in sequence
document.getElementById('playMusic').onclick = function () {

    // Simple fade in and out via a volume
    var fade = function (to, time) {
        return time < 0.5 ?
            Math.min(4 * time * time, to) : // Fade in
            Math.min(1 - time * time, to); // Fade out
    };

    // Bass
    square.play({
        frequency: function (time) {
            var sequence = [
                55, 55, 82.41, 65.41, 55, 55, 82.41, 110, 110, 55, 55, 55, 55,
                55
            ];
            return sequence[Math.round((sequence.length - 1) * time)];
        },
        duration: 4500,
        pan: 0.3,
        volume: function (time) {
            return fade(0.8, time);
        }
    });

    // Sawtooth line
    sawtooth.play({
        frequency: function (time) {
            var sequence = [
                220, 220, 220, 220, 329.63, 329.63, 329.63, 349.23, 349.23, 220,
                220, 220, 220, 220
            ];
            return sequence[Math.round((sequence.length - 1) * time)];
        },
        duration: 4500,
        pan: -0.3,
        volume: function (time) {
            return fade(0.6, time);
        }
    });

    // Upper line
    sine.play({
        frequency: function (time) {
            var sequence = [
                987, 2093, 1760, 987, 1046.50, 1567.98, 1396.91, 1318.51, 1760,
                1567.98, 1318.51, 880, 880, 880
            ];
            return sequence[Math.round((sequence.length - 1) * time)];
        },
        duration: 4500,
        pan: 0,
        volume: function (time) {
            return fade(0.7, time);
        }
    });
};
