Highcharts.getJSON('https://demo-live-data.highcharts.com/aapl-c.json', function (data) {

    Highcharts.chart('container', {
        chart: {
            backgroundColor: 'transparent'
        },

        title: {
            text: '2 Years of AAPL Stock Price'
        },

        xAxis: {
            type: 'datetime',
            crosshair: {
                enabled: true,
                width: 3
            }
        },

        tooltip: {
            enabled: false
        },

        yAxis: {
            labels: {
                format: '${value}'
            },
            gridLineColor: '#555',
            title: {
                enabled: false
            }
        },

        legend: {
            enabled: false
        },

        credits: {
            enabled: false
        },

        annotations: [{
            labels: [{
                point: {
                    x: 818,
                    y: 50
                },
                text: '$182.01',
                backgroundColor: '#557C6B'
            }]
        }],

        series: [{
            name: 'AAPL',
            data: data
        }]
    });
});


function groupData(data, numPerBin) {
    var grouped = [];
    for (var i = 0, len = data.length; i < len; i += numPerBin) {
        var bin = data.slice(i, i + numPerBin).map(function (p) {
            return p.y;
        });
        grouped.push(Math.min.apply(null, bin), Math.max.apply(null, bin));
    }
    return grouped;
}


function sonifyChart(audioContext, synth, chart) {
    var noteToFreq = Highcharts.sonification.SonificationInstrument
        .musicalNoteToFrequency;
    var binSize = 20,
        data = groupData(chart.series[0].points, binSize),
        duration = 7000,
        len = data.length,
        minVal = chart.yAxis[0].dataMin,
        maxVal = chart.yAxis[0].dataMax,
        minNote = 22,
        maxNote = 84,
        hoverPoint;

    data.forEach(function (p, ix) {
        var note = Math.round(
                (p - minVal) /
                (maxVal - minVal) * (maxNote - minNote) + minNote
            ),
            msOffset = ix / len * duration;

        synth.playFreqAtTime(
            audioContext.currentTime + msOffset / 1000,
            noteToFreq(note),
            400
        );

        var point = chart.series[0].points[ix * binSize / 2 + 2];
        setTimeout(function () {
            if (point) {
                point.series.xAxis.drawCrosshair(null, point);
                point.setState('hover');
                hoverPoint = point;
            } else {
                chart.xAxis[0].hideCrosshair();
                hoverPoint.setState();
            }
        }, msOffset);
    });
}


document.getElementById('play').onclick = function () {
    var audioContext = new AudioContext(),
        synth = new Highcharts.sonification.SynthPatch(
            audioContext,
            JSON.parse(document.getElementById('preset').textContent)
        );
    synth.connect(audioContext.destination);
    synth.startSilently();

    sonifyChart(audioContext, synth, Highcharts.charts[0]);
};
