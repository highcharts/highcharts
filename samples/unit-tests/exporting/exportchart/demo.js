QUnit.test('Testing exportChart', async function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 400,
            height: 300
        },
        credits: {
            enabled: false
        },
        xAxis: {
            categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ]
        },
        yAxis: {
            title: {
                useHTML: true
            }
        },
        series: [
            {
                data: [
                    29.9,
                    71.5,
                    106.4,
                    129.2,
                    144.0,
                    176.0,
                    135.6,
                    148.5,
                    216.4,
                    194.1,
                    95.6,
                    54.4
                ]
            }
        ],
        exporting: {
            filename: 'custom-file-name',
            allowHTML: true
        }
    });

    var originalPost = Highcharts.HttpUtilities.post;

    try {
        var postData;

        Highcharts.HttpUtilities.post = function (url, data) {
            postData = data;
        };

        // Run export
        await chart.exporting.exportChart({
            type: 'application/pdf'
        });

        // Assert
        assert.strictEqual(postData.type, 'application/pdf', 'Posting for PNG');

        assert.strictEqual(
            postData.filename,
            'custom-file-name',
            'Custom filename'
        );

        assert.ok(
            /foreignObject/.test(postData.svg),
            'The generated SVG should contain a foreignObjet'
        );

        assert.notOk(
            /NaN/.test(postData.svg),
            'The generated SVG should not contain NaN (17498)'
        );

    } finally {
        Highcharts.HttpUtilities.post = originalPost;
    }
});

QUnit.test('webfont inlining', async function (assert) {
    const linkElement = document.createElement('link');
    linkElement.href = 'https://fonts.googleapis.com/css2?family=Roboto&display=swap';

    document.body.append(linkElement);

    const originalInlineFonts = Highcharts.Exporting.inlineFonts;
    let inlineFontsCallCount = 0;

    // Mocked inlineFonts, to avoid issues in CI
    Highcharts.Exporting.inlineFonts = svg => {
        inlineFontsCallCount++;
        return svg;
    };

    const chart1 = Highcharts.chart('container', {
        series: [{ data: [1, 3, 2, 4] }]
    });

    await chart1.exportChart({ type: 'image/jpeg' });
    assert.strictEqual(
        inlineFontsCallCount,
        1,
        'inlineFonts should be called by default.'
    );

    inlineFontsCallCount = 0;
    const chart2 = Highcharts.chart('container', {
        exporting: {
            chartOptions: {
                chart: {
                    style: {
                        fontFamily: 'monospace'
                    }
                }
            }
        },
        series: [{ data: [1, 3, 2, 4] }]
    });
    await chart2.exportChart({ type: 'image/jpeg' });
    assert.strictEqual(
        inlineFontsCallCount,
        0,
        `inlineFonts should not be called when chart.style.fontFamily
is set in exporting.chartConfig.`
    );

    // Restore original functions
    Highcharts.Exporting.inlineFonts = originalInlineFonts;

    const originalFetch = window.fetch;
    let fetchAttemptedForCrossOrigin = false;

    window.fetch = function (url) {
        if (typeof url === 'string') {
            try {
                const base = window.location && window.location.href ?
                    window.location.href :
                    undefined;
                const parsedUrl = new URL(url, base);
                if (parsedUrl.hostname === 'fonts.googleapis.com') {
                    fetchAttemptedForCrossOrigin = true;
                }
            } catch {
                // Ignore invalid URLs; they are not relevant for this test.
            }
        }
        return originalFetch.apply(this, arguments);
    };

    try {
        const dummySvg = document.createElementNS(
            'http://www.w3.org/2000/svg', 'svg'
        );
        await Highcharts.Exporting.inlineFonts(dummySvg);

        assert.notOk(
            fetchAttemptedForCrossOrigin,
            'Should not attempt to fetch cross-origin stylesheets ' +
            '(Origin Gate working).'
        );
        assert.ok(
            true,
            'inlineFonts completed successfully without a CORS SecurityError ' +
            ' crash (#23589).'
        );
    } catch (e) {
        assert.notOk(
            true, 'inlineFonts threw an unexpected error: ' + e.message
        );
    } finally {
        window.fetch = originalFetch;
    }

    linkElement.remove();
});
