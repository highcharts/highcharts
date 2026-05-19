// Create some data
const data = [];
for (let i = 0; i < 600; ++i) {
    data.push([
        i / 50,
        Math.sin(i / 100) * 3 + Math.random() - 0.5
    ]);
}

const chart = Highcharts.chart('container', {
    chart: {
        type: 'column',
        backgroundColor: 'transparent',
        zooming: {
            type: 'x',
            resetButton: {
                theme: {
                    style: {
                        fontSize: '0.8rem',
                        color: 'var(--highcharts-neutral-color-100)'
                    }
                },
                position: {
                    x: -5,
                    y: 3
                }
            }
        },
        margin: 0
    },
    title: {
        text: '',
        align: 'left'
    },
    subtitle: {
        text: '',
        align: 'left'
    },
    credits: {
        enabled: false
    },
    xAxis: {
        visible: false
    },
    yAxis: {
        visible: false
    },
    legend: {
        enabled: false
    },
    tooltip: {
        backgroundColor: 'var(--highcharts-neutral-color-3)',
        valueDecimals: 2,
        style: {
            color: 'var(--highcharts-neutral-color-100)'
        }
    },
    series: [{
        data: data,
        name: 'Random data',
        colorByPoint: true,
        lineColor: 'transparent',
        marker: {
            enabled: true
        },
        borderRadius: 10,
        borderWidth: 0.4,
        borderColor: 'var(--highcharts-background-color)'
    }]
});

const slider = document.getElementById('slider');
const playButton = document.getElementById('sonify');

let playTimeline;
let playing = false;

const playIcon = '<svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.33325 3.32642C3.33325 2.67898 3.33325 2.35526 3.46825 2.17681C3.58585 2.02135 3.7656 1.92515 3.96018 1.91353C4.18354 1.9002 4.45289 2.07977 4.9916 2.4389L12.002 7.11248C12.4471 7.40923 12.6697 7.55761 12.7472 7.74462C12.815 7.90813 12.815 8.09188 12.7472 8.25538C12.6697 8.4424 12.4471 8.59077 12.002 8.88752L4.9916 13.5611C4.45289 13.9202 4.18354 14.0998 3.96018 14.0865C3.7656 14.0749 3.58585 13.9787 3.46825 13.8232C3.33325 13.6447 3.33325 13.321 3.33325 12.6736V3.32642Z" stroke="currentColor" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const pauseIcon = '<svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.53333 2H4.13333C3.3866 2 3.01323 2 2.72801 2.14532C2.47713 2.27316 2.27316 2.47713 2.14532 2.72801C2 3.01323 2 3.3866 2 4.13333V11.8667C2 12.6134 2 12.9868 2.14532 13.272C2.27316 13.5229 2.47713 13.7268 2.72801 13.8547C3.01323 14 3.3866 14 4.13333 14H4.53333C5.28007 14 5.65344 14 5.93865 13.8547C6.18954 13.7268 6.39351 13.5229 6.52134 13.272C6.66667 12.9868 6.66667 12.6134 6.66667 11.8667V4.13333C6.66667 3.3866 6.66667 3.01323 6.52134 2.72801C6.39351 2.47713 6.18954 2.27316 5.93865 2.14532C5.65344 2 5.28007 2 4.53333 2Z" stroke="currentColor" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round"/><path d="M11.8667 2H11.4667C10.7199 2 10.3466 2 10.0613 2.14532C9.81046 2.27316 9.60649 2.47713 9.47866 2.72801C9.33333 3.01323 9.33333 3.3866 9.33333 4.13333V11.8667C9.33333 12.6134 9.33333 12.9868 9.47866 13.272C9.60649 13.5229 9.81046 13.7268 10.0613 13.8547C10.3466 14 10.7199 14 11.4667 14H11.8667C12.6134 14 12.9868 14 13.272 13.8547C13.5229 13.7268 13.7268 13.5229 13.8547 13.272C14 12.9868 14 12.6134 14 11.8667V4.13333C14 3.3866 14 3.01323 13.8547 2.72801C13.7268 2.47713 13.5229 2.27316 13.272 2.14532C12.9868 2 12.6134 2 11.8667 2Z" stroke="currentColor" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// User scrubs manually
slider.oninput = function () {
    chart.sonification.playSegment(this.value);
};

// User clicks play
playButton.onclick = function () {
    // step through the slider and play segemnts with an interval
    if (!playing) {
        playing = true;
        playButton.innerHTML = pauseIcon;
        let segment = parseInt(slider.value, 10);
        console.log(segment);
        const segmentStop = 100;
        playTimeline = setInterval(function () {
            if (segment <= segmentStop) {
                chart.sonification.playSegment(segment);
                slider.value = segment;
                segment = segment + 1;
            } else {
                clearInterval(playTimeline);
                slider.value = 0;
                playing = false;
                playButton.innerHTML = playIcon;

            }
        }, 100);
    } else {
        chart.sonification.cancel();
        clearInterval(playTimeline);
        playing = false;
        playButton.innerHTML = playIcon;
    }

};

function announceInstrument(instrument) {

    const announce = document.getElementById('announce');
    announce.textContent = '';

    const newElem = document.createElement('span');
    newElem.textContent = 'New Instrument: ' + instrument;
    announce.appendChild(newElem);


}

// Populate preset dropdown
Object.keys(
    Highcharts.sonification.InstrumentPresets
).forEach(function (preset) {
    const option = document.createElement('option');
    option.textContent = option.value = preset;
    document.getElementById('preset').appendChild(option);
});

document.getElementById('preset').onchange = function () {
    announceInstrument(this.value);
    chart.update({
        sonification: {
            defaultInstrumentOptions: {
                instrument: this.value
            }
        }
    }, false);
};
