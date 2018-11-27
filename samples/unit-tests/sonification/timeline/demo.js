QUnit.test('Instrument.play is being called correctly', function (assert) {
    var done = assert.async(),
        chart = Highcharts.chart('container', {
            series: [{
                data: [1, 2, 3, 4]
            }]
        }),
        playedPoint = 0,
        playedEarcon = 0;

    // Set up mock instrument
    var mockInstrument = Highcharts.sonification.instruments.sine.copy({
        id: 'mockInstrument'
    });
    Highcharts.sonification.Instrument.prototype.play = mockInstrument.play =
        function () {
            if (this.id === 'mockInstrument') {
                playedPoint++;
            } else {
                playedEarcon++; // Earcons use instrument copies, different id
            }
        };

    // Create an earcon
    var earcon = new Highcharts.sonification.Earcon({
        instruments: [{
            instrument: mockInstrument,
            playOptions: { }
        }]
    });
    earcon.sonify();
    assert.strictEqual(playedEarcon, 1, 'Earcon played');

    // Try points
    var points = chart.series[0].points,
        playOptions = {
            instruments: [{
                instrument: mockInstrument
            }]
        };
    points[0].sonify(playOptions);
    assert.strictEqual(playedPoint, 1, 'Point played');
    points[2].sonify(playOptions);
    assert.strictEqual(playedPoint, 2, 'Point played');

    // Create timeline events
    var makeTimelineEvent = function (object, time) {
            return new Highcharts.sonification.TimelineEvent({
                eventObject: object,
                playOptions: object instanceof Highcharts.Point ? playOptions :
                    undefined,
                time: time
            });
        },
        timelineEvents = [
            makeTimelineEvent(points[0], 0),
            makeTimelineEvent(points[1], 2),
            makeTimelineEvent(points[2], 4),
            makeTimelineEvent(points[3], 4),
            makeTimelineEvent(earcon, 6)
        ];
    timelineEvents[0].play();
    assert.strictEqual(playedPoint, 3, 'Point played');
    timelineEvents[4].play();
    assert.strictEqual(playedEarcon, 2, 'Earcon played');

    // Create timeline path
    var timelinePath = new Highcharts.sonification.TimelinePath({
        events: timelineEvents
    });
    timelinePath.play();
    setTimeout(function () {
        // After a while, all should have finished playing
        assert.strictEqual(playedPoint, 7, 'Events played');
        assert.strictEqual(playedEarcon, 3, 'Earcon event played');
        timelinePath.setCursor(timelineEvents[1].id);
        timelinePath.rewind();
        setTimeout(function () {
            // After a while again, we should have played the two first events
            assert.strictEqual(playedPoint, 9, 'Events played');
            assert.strictEqual(playedEarcon, 3, 'Earcon event not played');
            done();
        }, 200);
    }, 200);
});
