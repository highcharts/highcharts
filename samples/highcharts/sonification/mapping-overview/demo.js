const chart = Highcharts.chart('container', {
    title: {
        text: null
    },
    legend: {
        enabled: false
    },
    accessibility: {
        landmarkVerbosity: 'one',
        series: {
            describeSingleSeries: true
        }
    },
    sonification: {
        updateInterval: 0 // Allow chart updates without delay
    },
    tooltip: {
        headerFormat: '',
        pointFormat: '<b>{point.y}</b>',
        padding: 10
    },
    xAxis: {
        crosshair: {
            enabled: true,
            width: 50,
            color: 'rgba(90, 140, 210, 0.1)',
            // For CSS transitions
            className: 'hc-crosshair'
        }
    },
    series: [{
        data: [1, 2, 2, 4, 5, 7, 9, 11, 13, 6, 7, 1],
        color: '#3070d0'
    }]
});


// Attach click event handlers to radio buttons and the play button
const defaultMappingOptionsUnmapped = {
        // Default opts for each param when not mapped to Y
        pitch: 'g3',
        volume: 1,
        pan: 'x',
        frequency: void 0,
        tremolo: void 0,
        lowpass: void 0,
        highpass: void 0,
        noteDuration: 200,
        playDelay: 0,
        gapBetweenNotes: 50
    },
    defaultMappingOptionsMapped = {
        // Default opts for each param whenever they are mapped to Y
        pitch: {
            mapTo: 'y',
            min: 'c2',
            max: 'c6'
        },
        frequency: {
            mapTo: 'y',
            min: 65.41, // c2
            max: 1046.50 // c6
        },
        volume: {
            mapTo: 'y',
            min: 0.1,
            max: 1.2
        },
        pan: {
            mapTo: 'y',
            min: -1,
            max: 1
        },
        tremolo: {
            depth: {
                mapTo: 'y',
                min: 0.2,
                max: 0.8
            },
            speed: {
                mapTo: 'y',
                min: 0.3,
                max: 1
            }
        },
        lowpass: {
            frequency: {
                mapTo: 'y',
                min: 100,
                max: 4000
            },
            resonance: 1
        },
        highpass: {
            frequency: {
                mapTo: '-y',
                min: 1,
                max: 4000,
                mapFunction: 'logarithmic'
            },
            resonance: 1
        },
        noteDuration: {
            mapTo: 'y',
            min: 30,
            max: 1000
        },
        gapBetweenNotes: {
            mapTo: '-y',
            min: 40,
            max: 250
        }
    },
    helptexts = {
        pitch: 'With this pitch mapping, higher notes will be played when the Y-value goes higher. You can picture a piano, where the Y-axis is laid out across the keys. For low Y-values, the low piano keys are played, and for high Y-values, the higher keys are played.',
        frequency: 'Frequency is similar to pitch mapping, but instead of mapping to notes on a piano, we are mapping to wave frequency in Hertz. The wave frequency doubles for each octave, so mapping higher in frequency will very quickly cause high musical notes. For this reason you would usually use pitch mapping instead.',
        volume: 'With this volume mapping the pitch is always the same, but low Y-values are played at low volume, while high values are played at high volume. Noticing subtle differences in volume can be hard, and also hardware dependent, so this should usually be combined with other mappings.',
        pan: 'Stereo panning refers to where in a stereo field a sound is placed. If you are wearing headphones, you will hear low Y-values in the left ear, and high ones in the right ear. Normally we map this to the X-value instead, so that we get a feeling of playing the chart from left to right.',
        tremolo: 'Tremolo refers to periodical changes in volume. You can map to both the speed and intensity of the volume changes. In this case we are mapping to both, where a higher Y-value causes both faster and more dramatic volume changes.',
        lowpass: 'Lowpass filters filter out high frequencies, making the sound more dull. You can map to both the dropoff frequency of the filter as well as a resonance. The resonance adds emphasis to the frequencies around the dropoff frequency. In this case we are making low Y-values more dull, and higher ones more natural.',
        highpass: 'Highpass filters filter out low frequencies, making the sound thinner. Similarly to the lowpass filter, you can map to both dropoff frequency and resonance. In this case we are making low Y-values more thin, and higher ones more natural.',
        noteDuration: 'Note duration refers to how long each note plays for. It only has an effect with continuous instruments that can hold notes indefinitely, in this case a flute. Here we are making low Y-values play short notes, and high values play long notes.',
        gapBetweenNotes: 'Here we are mapping pitch to an array of notes. When pitch is an array, multiple notes are played for each point. Note gap refers to how long to wait between each of these notes. In this demo, low Y-values have more space between the notes, and high Y-values play the notes faster.'
    };
function selectMappingParam(paramName) {
    document.getElementById('helptext').textContent = helptexts[paramName];
    const selectedOpts = {},
        pitchOverride = {};
    selectedOpts[paramName] = defaultMappingOptionsMapped[paramName];
    if (paramName === 'gapBetweenNotes') {
        // Gap between notes works with pitch arrays only
        pitchOverride.pitch = ['g3', 'g3', 'g3'];
    } else if (paramName === 'noteDuration') {
        // Use a higher pitch for the flute
        pitchOverride.pitch = 'b4';
    } else if (paramName === 'pitch') {
        // If last selected param was gapBetweenNotes we need to avoid just
        // updating the array, so update it to a primitive first
        chart.update({
            sonification: {
                defaultInstrumentOptions: { mapping: { pitch: 0 } }
            }
        }, false);
    }
    chart.update({
        sonification: {
            duration: paramName === 'noteDuration' ||
                paramName === 'gapBetweenNotes' ? 8500 : 4500,
            defaultInstrumentOptions: {
                // Use a continuous instrument for note duration
                instrument: paramName === 'noteDuration' ? 'flute' : 'piano',
                // Merge the default opts for each parameter with the overrides
                mapping: Highcharts.merge(
                    defaultMappingOptionsUnmapped,
                    pitchOverride,
                    selectedOpts
                )
            }
        }
    });
}
document.querySelectorAll('#block input[type="radio"]').forEach(el => (
    el.onclick = () => selectMappingParam(el.value)
));
document.getElementById('play').onclick = () => chart.toggleSonify();
selectMappingParam('pitch');
