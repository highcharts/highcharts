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

document.getElementById('audioButton').addEventListener('click', async () => {
    let analyser;
    let bufferLength;
    let dataArray;

    function trackVolume() {
        requestAnimationFrame(trackVolume);

        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i] * dataArray[i];
        }
        const volume = (Math.sqrt(sum / bufferLength) / 5) - 20;

        const left = c.series[0].points[0],
            right = c.series[1].points[0];

        left.update(volume, false);
        right.update(volume, false);
        c.redraw(false);
    }

    try {
        const stream = await navigator.mediaDevices
            .getUserMedia({ audio: true });

        const audioContext = new (
            window.AudioContext || window.webkitAudioContext
        )();
        const source = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();

        analyser.fftSize = 256;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        source.connect(analyser);

        trackVolume();
    } catch (err) {
        console.error('Error accessing microphone: ', err);
        alert('Please allow microphone access to use this feature.');
    }
});
