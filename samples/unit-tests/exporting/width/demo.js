QUnit.test('Deprecated exporting.width is not posted', async function (assert) {
    const chart = Highcharts.chart('container', {
        series: [{
            data: [1, 2, 3]
        }],
        exporting: {
            local: false,
            width: 200
        }
    });

    const originalPost = Highcharts.HttpUtilities.post;

    try {
        let postData;

        Highcharts.HttpUtilities.post = function (url, data) {
            postData = data;
        };

        await chart.exporting.exportChart();

        assert.strictEqual(
            postData.scale,
            2,
            'The scale should still be posted'
        );

        assert.notOk(
            'width' in postData,
            'The deprecated exporting.width should not be posted (#24101)'
        );

        await chart.exporting.exportChart({
            width: 300
        });

        assert.notOk(
            'width' in postData,
            'A width passed to exportChart should not be posted (#24101)'
        );
    } finally {
        Highcharts.HttpUtilities.post = originalPost;
    }
});
