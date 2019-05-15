QUnit.test('Instrument.play/onEnd is being called correctly', function (assert) {

    if (navigator.userAgent.indexOf('Trident') !== -1) {
        assert.ok(true, 'IE not supported');
        return;
    }

    var done = assert.async(),
        clock = TestUtilities.lolexInstall();

    try {
        var chart = Highcharts.chart('container', {
                series: [{
                    data: [1, 2, 3, 4]
                }]
            }),
            playedPoint = 0,
            endedPoint = 0,
            playedEarcon = 0,
            endedEarcon = 0,
            endedTimelineEvent = 0,
            startTimelineEvent = 0,
            endedTimelinePath = 0;

        // Set up mock instrument
        var mockInstrument = Highcharts.sonification.instruments.sine.copy({
            id: 'mockInstrument'
        });
        Highcharts.sonification.Instrument.prototype.play = mockInstrument.play =
            function (options) {
                if (this.id === 'mockInstrument') {
                    playedPoint++;
                } else {
                    playedEarcon++; // Earcons use instrument copies, different id
                }
                if (options.onEnd) {
                    options.onEnd();
                }
            };

        // Create an earcon
        var earcon = new Highcharts.sonification.Earcon({
            instruments: [{
                instrument: mockInstrument,
                playOptions: {
                    onEnd: function () {
                        endedEarcon++;
                    }
                }
            }]
        });
        earcon.sonify();
        assert.strictEqual(playedEarcon, 1, 'Earcon played');
        assert.strictEqual(endedEarcon, 1, 'Earcon ended');

        // Try points
        var points = chart.series[0].points,
            playOptions = {
                instruments: [{
                    instrument: mockInstrument
                }],
                onEnd: function () {
                    endedPoint++;
                }
            };
        points[0].sonify(playOptions);
        assert.strictEqual(playedPoint, 1, 'Point played');
        assert.strictEqual(endedPoint, 1, 'Point ended');
        points[2].sonify(playOptions);
        assert.strictEqual(playedPoint, 2, 'Point played');
        assert.strictEqual(endedPoint, 2, 'Point ended');

        // Create timeline events
        var makeTimelineEvent = function (object, time) {
                return new Highcharts.sonification.TimelineEvent({
                    eventObject: object,
                    playOptions: object instanceof Highcharts.Point ? playOptions :
                        undefined,
                    time: time,
                    onEnd: function () {
                        endedTimelineEvent++;
                    }
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
        assert.strictEqual(endedPoint, 3, 'Point ended');
        assert.strictEqual(endedTimelineEvent, 1, 'TimelineEvent ended');
        timelineEvents[4].play();
        assert.strictEqual(playedEarcon, 2, 'Earcon played');
        assert.strictEqual(endedEarcon, 2, 'Earcon ended');
        assert.strictEqual(endedTimelineEvent, 2, 'TimelineEvent ended');

        // Create timeline path
        var timelinePath = new Highcharts.sonification.TimelinePath({
            events: timelineEvents,
            onEventStart: function () {
                startTimelineEvent++;
            },
            onEventEnd: function () {
                endedTimelineEvent++;
            },
            onEnd: function () {
                endedTimelinePath++;
            }
        });
        timelinePath.play();
        setTimeout(function () {
            // After a while, all should have finished playing
            assert.strictEqual(playedPoint, 7, 'Events played');
            assert.strictEqual(playedEarcon, 3, 'Earcon event played');
            assert.strictEqual(startTimelineEvent, 5, 'Events started');
            assert.strictEqual(endedTimelineEvent, 12, 'Events ended');
            assert.strictEqual(endedTimelinePath, 1, 'Timeline path ended');
            timelinePath.setCursor(timelineEvents[1].id);
            timelinePath.rewind();
            setTimeout(function () {
                // After a while again, we should have played the two first events
                assert.strictEqual(playedPoint, 9, 'Events played');
                assert.strictEqual(playedEarcon, 3, 'Earcon event not played');
                assert.strictEqual(endedTimelinePath, 2, 'Timeline path ended');
                done();
            }, 100);
        }, 100);

        TestUtilities.lolexRunAndUninstall(clock);
    } finally {
        TestUtilities.lolexUninstall(clock);
    }
});
