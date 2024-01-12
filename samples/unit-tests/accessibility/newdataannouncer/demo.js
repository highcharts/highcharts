QUnit.test('Chart with newDataAnnouncer', function (assert) {
    var done = assert.async();
    var chart = Highcharts.chart('container', {
            accessibility: {
                announceNewData: {
                    enabled: true
                }
            },
            series: [
                {
                    data: [1, 2, 3, 4, 5, 6]
                }
            ]
        }),
        series = chart.series[0],
        announcerDiv = document.querySelector('.highcharts-announcer-container').querySelectorAll('div')[0];

    assert.ok(
        chart.accessibility.components.infoRegions.announcer.announceRegion,
        'Chart should have announcer region'
    );

    assert.strictEqual(
        chart.options.accessibility.announceNewData.enabled,
        true,
        'announceNewData is enabled'
    );

    assert.strictEqual(
        chart.accessibility.components.series
            .newDataAnnouncer.queuedAnnouncement,
        undefined,
        'There is no queued announcement'
    );

    // Adding point
    series.addPoint(7);

    setTimeout(function () {
        assert.ok(
            announcerDiv.innerHTML,
            'The announceRegion should contain text content after adding a point'
        );
    }, 1);

    // Queued announcement should not be undefined anymore
    assert.notEqual(
        chart.accessibility.components.series
            .newDataAnnouncer.queuedAnnouncement,
        undefined,
        'There should be queued announcement'
    );


    setTimeout(function () {
        assert.strictEqual(
            chart.accessibility.components.series
                .newDataAnnouncer.queuedAnnouncement,
            undefined,
            'The queued announcement should be removed after a short while'
        );

        assert.strictEqual(
            announcerDiv.innerHTML,
            '',
            'The text in the announceRegion should be removed after a short while'
        );
        done();
    }, 3100); // make sure clearAnnouncementTimerRegion is done
});
