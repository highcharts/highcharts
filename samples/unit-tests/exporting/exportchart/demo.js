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

    const originalFetch = window.fetch,
        originalStyleSheets = Object.getOwnPropertyDescriptor(
            document,
            'styleSheets'
        ),
        stylesheetHref = 'https://fonts.example.com/mock.css',
        fontHref = 'https://fonts.example.com/mock.woff2';

    let stylesheetFetchCount = 0,
        fontFetchCount = 0;

    const restoreMocks = function () {
        window.fetch = originalFetch;
        if (originalStyleSheets) {
            Object.defineProperty(
                document,
                'styleSheets',
                originalStyleSheets
            );
        } else {
            delete document.styleSheets;
        }
    };

    window.fetch = function (url) {
        const parsedUrl = new URL(String(url), window.location.href);

        if (parsedUrl.href === stylesheetHref) {
            stylesheetFetchCount++;
            return Promise.resolve(new Response(
                '@font-face{font-family:"MockExportFont";' +
                `src:url("${fontHref}") format("woff2");}`,
                { headers: { 'Content-Type': 'text/css' } }
            ));
        }

        if (parsedUrl.href === fontHref) {
            fontFetchCount++;
            return Promise.resolve(new Response(
                new Uint8Array([0, 1, 2]),
                { headers: { 'Content-Type': 'font/woff2' } }
            ));
        }

        return Promise.reject(
            new Error('Unexpected fetch: ' + parsedUrl.href)
        );
    };

    Object.defineProperty(document, 'styleSheets', {
        configurable: true,
        value: [{
            href: stylesheetHref,
            get cssRules() {
                throw new DOMException(
                    'Stylesheet rules are blocked by CORS',
                    'SecurityError'
                );
            }
        }]
    });

    const dummySvg = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg'
        ),
        text = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'text'
        );

    text.setAttribute('style', 'font-family: MockExportFont');
    text.textContent = 'Highcharts';
    dummySvg.append(text);

    await Highcharts.Exporting.inlineFonts(dummySvg);
    const styleText = dummySvg.querySelector('style').textContent;
    restoreMocks();

    assert.strictEqual(
        stylesheetFetchCount,
        1,
        'Should fetch CORS-readable cross-origin stylesheets.'
    );

    assert.strictEqual(
        fontFetchCount,
        1,
        'Should fetch font files referenced by fetched stylesheets.'
    );

    assert.ok(
        styleText.includes('@font-face') &&
        styleText.includes('MockExportFont') &&
        styleText.includes('data:font/woff2;base64,AAEC'),
        'Should inline fonts from cross-origin stylesheets.'
    );

});
