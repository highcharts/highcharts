(async () => {

    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-c.json'
    ).then(response => response.json());

    var chart;

    chart = Highcharts.chart('container', {
        chart: {
            backgroundColor: 'transparent'
        },

        title: {
            text: '2 Years of AAPL Stock Price',
            align: 'left'
        },

        xAxis: {
            type: 'datetime',
            crosshair: {
                enabled: true,
                width: 3,
                color: '#9080a0'
            }
        },

        yAxis: {
            labels: {
                format: '${value}'
            },
            title: {
                enabled: false
            }
        },

        legend: {
            enabled: false
        },

        series: [{
            name: 'AAPL',
            data: data
        }]
    });


    // Naive data grouping that builds a new data array from the min and max
    // point for each bin
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


    // Sonify the chart manually
    function sonifyChart(synth, chart) {
        var noteToFreq = Highcharts.sonification.SonificationInstrument
            .musicalNoteToFrequency;
        var binSize = 20,
            data = groupData(chart.series[0].points, binSize),
            duration = 7000,
            len = data.length,
            minVal = chart.yAxis[0].dataMin,
            maxVal = chart.yAxis[0].dataMax,
            minNote = 22, // note number 0 is c0
            maxNote = 84,
            hoverPoint;

        data.forEach(function (y, ix) {
        // Map y value to note
            var note = Math.round(
                    (y - minVal) /
                (maxVal - minVal) * (maxNote - minNote) + minNote
                ),
                // Offset of note in milliseconds
                msOffset = ix / len * duration;

            // Schedule the synth to play this note at the desired time
            synth.playFreqAtTime(
                msOffset / 1000,
                noteToFreq(note),
                400
            );

            // Naively find the connected data point, and schedule the
            // crosshair drawing
            var point = chart.series[0].points[ix * binSize / 2 + 2];
            setTimeout(function () {
                if (point) {
                    point.series.xAxis.drawCrosshair(null, point);
                    point.setState('hover');
                    hoverPoint = point;
                } else if (hoverPoint) {
                    chart.xAxis[0].hideCrosshair();
                    hoverPoint.setState();
                }
            }, msOffset);
        });

        setTimeout(function () {
            document.getElementById('play').style.visibility = 'visible';
        }, duration);
    }


    // When we click play, set up an audio context and the synth, then sonify
    document.getElementById('play').onclick = function () {
        if (!chart) {
            return;
        }

        var audioContext = new AudioContext(),
            synth = new Highcharts.sonification.SynthPatch(
                audioContext,
                // Use a preset or send in options to the synth directly here
                Highcharts.sonification.InstrumentPresets.piano
            );
        synth.connect(audioContext.destination);
        synth.startSilently();

        sonifyChart(synth, chart);

        // Hide button so we don't have to handle starting/stopping multiple
        // sonifications at the same time, just to keep this demo simple
        this.style.visibility = 'hidden';
    };
})();