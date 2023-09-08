// Add a custom scale to the presets.
// Each element refers to an offset in semitones
Highcharts.sonification.Scales.custom = [0, 1, 5, 7, 8, 10, 11];

const chart = Highcharts.chart('container', {
    title: {
        text: 'Musical scales',
        align: 'left',
        margin: 25
    },
    legend: {
        enabled: false
    },
    accessibility: {
        landmarkVerbosity: 'one'
    },
    sonification: {
        duration: 3500,
        defaultInstrumentOptions: {
            mapping: {
                noteDuration: 300,
                pitch: {
                    min: 'c4',
                    max: 'c6',
                    // This is how to set a scale when mapping to pitch.
                    // Alternatively pass in an array directly.
                    scale: Highcharts.sonification.Scales.minor
                }
            }
        }
    },
    series: [{
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
            14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
    }]
});


document.getElementById('sonify').onclick = function () {
    chart.toggleSonify();
};

// Populate preset dropdown with the available scales
Object.keys(
    Highcharts.sonification.Scales
).forEach(function (preset) {
    const option = document.createElement('option');
    option.textContent = option.value = preset;
    document.getElementById('preset').appendChild(option);
});

// Change scales when dropdown changes
document.getElementById('preset').onchange = function () {
    chart.update({
        sonification: {
            defaultInstrumentOptions: {
                mapping: {
                    pitch: {
                        scale: Highcharts.sonification.Scales[this.value]
                    }
                }
            }
        }
    }, false);
};
