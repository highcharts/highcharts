var statusLines = 0,
    setStatus = function (status) {
        var statusField = document.getElementById('status');
        if (++statusLines > 10) {
            statusField.innerHTML = statusField.innerHTML.substring(
                statusField.innerHTML.indexOf('>') + 1
            );
        }
        statusField.innerHTML += status + '<br>';
    },
    makeEarcon = function (frequency) {
        return new Highcharts.sonification.Earcon({
            instruments: [{
                instrument: 'sine',
                playOptions: {
                    frequency: frequency * 2,
                    duration: 450,
                    volume: 1
                }
            }, {
                instrument: 'square',
                playOptions: {
                    frequency: frequency / 2,
                    duration: 350,
                    volume: 0.1
                }
            }]
        });
    },
    makeTimelineEvent = function (frequency, time) {
        return new Highcharts.sonification.TimelineEvent({
            eventObject: frequency ? makeEarcon(frequency) : null,
            time: time
        });
    },
    pathA = new Highcharts.sonification.TimelinePath({
        id: 'A',
        events: [
            makeTimelineEvent(261, 0),
            makeTimelineEvent(293, 500),
            makeTimelineEvent(329, 1000),
            makeTimelineEvent(349, 1500),
            makeTimelineEvent(392, 2000)
        ]
    }),
    pathB = new Highcharts.sonification.TimelinePath({
        id: 'B',
        events: [
            makeTimelineEvent(261, 0),
            makeTimelineEvent(293, 500),
            makeTimelineEvent(329, 1000),
            makeTimelineEvent(349, 1500),
            makeTimelineEvent(392, 2000),
            makeTimelineEvent(null, 3000)
        ]
    }),
    pathC = new Highcharts.sonification.TimelinePath({
        id: 'C',
        events: [
            makeTimelineEvent(329, 0),
            makeTimelineEvent(349, 500),
            makeTimelineEvent(392, 1000),
            makeTimelineEvent(440, 1500),
            makeTimelineEvent(466, 2000),
            makeTimelineEvent(null, 3000)
        ]
    }),
    pathD = new Highcharts.sonification.TimelinePath({
        id: 'D',
        events: [
            makeTimelineEvent(null, 0), // Silent event to create delay
            makeTimelineEvent(1397, 1500),
            makeTimelineEvent(1318, 1800),
            makeTimelineEvent(1174, 2000),
            makeTimelineEvent(1046, 2900)
        ]
    }),
    timeline = new Highcharts.sonification.Timeline({
        paths: [pathA, [pathB, pathC], pathD],
        onPathStart: function (path) {
            setStatus('Starting path ' + path.id);
        },
        onPathEnd: function (data) {
            setStatus('Ended path ' + data.path.id);
        },
        onEnd: function () {
            setStatus('Timeline reached end');
        }
    });

setStatus('Click on buttons to interact with timeline');

document.getElementById('reset').onclick = function () {
    timeline.pause();
    timeline.resetCursor();
    document.getElementById('status').innerHTML = 'Timeline was reset<br>';
    statusLines = 0;
};

document.getElementById('play').onclick = function () {
    timeline.play();
    setStatus('Playing timeline');
};

document.getElementById('rewind').onclick = function () {
    timeline.rewind();
    setStatus('Playing timeline backwards');
};

document.getElementById('pause').onclick = function () {
    timeline.pause(true);
    setStatus('Paused timeline');
};
