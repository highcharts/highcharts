const c = Highcharts.chart('container', {
    chart: {
        type: 'gauge',
        plotBorderWidth: 1,
        plotBackgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
                [0, '#FFF4C6'],
                [0.3, '#FFFFFF'],
                [1, '#FFF4C6']
            ]
        },
        plotBackgroundImage: null,
        height: 200
    },

    title: {
        text: 'VU meter'
    },

    pane: [{
        startAngle: -45,
        endAngle: 45,
        background: null,
        center: ['25%', '145%'],
        size: 300
    }, {
        startAngle: -45,
        endAngle: 45,
        background: null,
        center: ['75%', '145%'],
        size: 300
    }],

    exporting: {
        enabled: false
    },

    tooltip: {
        enabled: false
    },

    yAxis: [{
        min: -20,
        max: 6,
        minorTickPosition: 'outside',
        tickPosition: 'outside',
        labels: {
            rotation: 'auto',
            distance: 20,
            style: {
                color: '#333'
            }
        },
        lineWidth: 1,
        offset: 0,
        plotBands: [{
            from: 0,
            to: 6,
            color: '#C02316',
            innerRadius: '100%',
            outerRadius: '105%'
        }],
        pane: 0,
        title: {
            text: 'VU<br/><span style="font-size:8px">Channel A</span>',
            y: -40
        },
        startOnTick: false,
        endOnTick: false
    }, {
        min: -20,
        max: 6,
        minorTickPosition: 'outside',
        tickPosition: 'outside',
        labels: {
            rotation: 'auto',
            distance: 20,
            style: {
                color: '#333'
            }
        },
        lineWidth: 1,
        offset: 0,
        plotBands: [{
            from: 0,
            to: 6,
            color: '#C02316',
            innerRadius: '100%',
            outerRadius: '105%'
        }],
        pane: 1,
        title: {
            text: 'VU<br/><span style="font-size:8px">Channel B</span>',
            y: -40
        },
        startOnTick: false,
        endOnTick: false
    }],

    plotOptions: {
        gauge: {
            clip: true,
            dataLabels: {
                enabled: false
            },
            dial: {
                backgroundColor: '#333',
                radius: '100%',
                baseWidth: 4,
                topWidth: 1
            }
        }
    },

    series: [{
        name: 'Channel A',
        data: [-20],
        yAxis: 0
    }, {
        name: 'Channel B',
        data: [-20],
        yAxis: 1
    }]

});

const MIN_DB = -20,
    MAX_DB = 6;

/**
 * Simulated stereo audio track, metered whenever the microphone is off. A
 * looping 16th note groove is run through a percussive envelope, so that the
 * needles get something musical to follow.
 */
const simulatedTrack = (function () {
    const stepsPerBar = 16,
        // A 124 BPM bar, divided into 16th notes
        stepDuration = 60 / 124 / 4,
        // Relative level of each 16th note, one bar per channel
        groove = [
            [
                1, 0, 0.3, 0, 0.75, 0.1, 0.3, 0.55,
                0.95, 0, 0.35, 0.2, 0.7, 0, 0.5, 0.65
            ],
            [
                0.85, 0.25, 0, 0.4, 0.7, 0, 0.4, 0,
                1, 0.15, 0.3, 0, 0.8, 0.3, 0.45, 0.7
            ]
        ],
        envelopes = [0, 0];

    let time = 0,
        step = -1;

    return {
        reset: function () {
            time = 0;
            step = -1;
            envelopes[0] = 0;
            envelopes[1] = 0;
        },

        /**
         * Advance the track and return the current amplitude of each channel,
         * where 1 corresponds to 0 dB on the gauges.
         *
         * @param {number} deltaTime Seconds elapsed since the previous frame.
         * @return {Array<number>} Amplitude for channel A and B.
         */
        advance: function (deltaTime) {
            time += deltaTime;

            const currentStep = Math.floor(time / stepDuration),
                // Swell over some ten seconds, so the loop reads as a track
                // rather than as a repeating pattern. The peaks push into the
                // red band of the gauges.
                dynamics = 0.7 + 1.3 * Math.pow(Math.sin(time / 3.2), 2);

            // A new note is due
            if (currentStep !== step) {
                step = currentStep;

                groove.forEach(function (channel, i) {
                    const level = channel[step % stepsPerBar];

                    if (level) {
                        envelopes[i] = Math.max(
                            envelopes[i],
                            level * dynamics * (0.85 + 0.3 * Math.random())
                        );
                    }
                });
            }

            const decay = Math.exp(-deltaTime / 0.18);

            return envelopes.map(function (envelope, i) {
                envelopes[i] = envelope * decay;

                // Let a quiet, sustained pad keep the needles off the end
                // stop in between the hits
                return Math.max(
                    envelopes[i],
                    dynamics * (0.05 + 0.02 * Math.sin(time * 1.7 + i))
                );
            });
        }
    };
}());

/**
 * Live input from the user's microphone, metered in mono on both channels.
 */
const microphone = (function () {
    // Root mean square level that should read as 0 dB on the gauges
    const sensitivity = 100;

    let analyser,
        dataArray,
        audioContext,
        stream;

    return {
        get active() {
            return Boolean(analyser);
        },

        start: async function () {
            stream = await navigator.mediaDevices
                .getUserMedia({ audio: true });

            audioContext = new (
                window.AudioContext || window.webkitAudioContext
            )();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            dataArray = new Uint8Array(analyser.frequencyBinCount);

            audioContext.createMediaStreamSource(stream).connect(analyser);
        },

        stop: function () {
            stream.getTracks().forEach(track => track.stop());
            audioContext.close();
            analyser = undefined;
            audioContext = undefined;
            stream = undefined;
        },

        /**
         * Measure the current input level.
         *
         * @return {Array<number>} Amplitude for channel A and B.
         */
        read: function () {
            analyser.getByteFrequencyData(dataArray);

            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i] * dataArray[i];
            }

            const amplitude = Math.sqrt(sum / dataArray.length) / sensitivity;

            return [amplitude, amplitude];
        }
    };
}());

/**
 * Convert an amplitude to decibels within the range of the gauges.
 */
function toDecibels(amplitude) {
    return Math.max(
        MIN_DB,
        Math.min(MAX_DB, 20 * Math.log10(Math.max(amplitude, 1e-3)))
    );
}

// Displayed levels, smoothed towards the amplitude of the active source
const levels = [0, 0];

let lastFrame;

function renderFrame(now) {
    requestAnimationFrame(renderFrame);

    // Cap the delta so that a backgrounded tab doesn't skip the whole track
    const deltaTime = Math.min((now - (lastFrame || now)) / 1000, 0.1),
        amplitudes = microphone.active ?
            microphone.read() :
            simulatedTrack.advance(deltaTime);

    lastFrame = now;

    amplitudes.forEach(function (amplitude, i) {
        // VU meter ballistics: rise quickly, fall back slowly
        const integration = amplitude > levels[i] ? 0.07 : 0.25;

        levels[i] += (amplitude - levels[i]) *
            (1 - Math.exp(-deltaTime / integration));

        c.series[i].points[0].update(toDecibels(levels[i]), false);
    });

    c.redraw(false);
}

requestAnimationFrame(renderFrame);

const audioButton = document.getElementById('audioButton');

function updateButton() {
    audioButton.textContent = microphone.active ?
        'Use simulated audio' :
        'Use microphone';
    audioButton.setAttribute('aria-pressed', microphone.active);
}

audioButton.addEventListener('click', async () => {
    if (microphone.active) {
        microphone.stop();
        simulatedTrack.reset();
    } else {
        try {
            await microphone.start();
        } catch (err) {
            console.error('Error accessing microphone: ', err);
            alert('Please allow microphone access to use this feature.');
        }
    }

    updateButton();
});

updateButton();
