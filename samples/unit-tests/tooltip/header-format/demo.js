QUnit.test('Formats in tooltip header (#3238)', function (assert) {
    var chart = $('#container')
        .highcharts('StockChart', {
            chart: {
                type: 'column'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataGrouping: {
                        enabled: false
                    }
                }
            },
            series: [
                {
                    data: [{ name: 'Point name', y: 1 }, 1, 1]
                },
                {
                    data: [2, 2, 2]
                },
                {
                    data: [2, 2, 2]
                }
            ],
            tooltip: {
                headerFormat: `
                    point.x = {point.x},
                    point.y = {point.y},
                    point.color = {point.color},
                    point.colorIndex = {point.colorIndex},
                    point.key = {point.key},
                    point.series.name = {point.series.name},
                    point.point.name = {point.point.name},
                    point.percentage = {point.percentage},
                    point.total = {point.total}
                `,
                footerFormat: '{series.name} {point.total}<br>'
            }
        })
        .highcharts();

    chart.tooltip.refresh([chart.series[0].points[0]]);

    assert.strictEqual(
        chart.tooltip.headerFooterFormatter(
            chart.series[0].points[0],
            false
        ),
        `
                    point.x = 0,
                    point.y = 1,
                    point.color = #2caffe,
                    point.colorIndex = 0,
                    point.key = Point name,
                    point.series.name = Series 1,
                    point.point.name = Point name,
                    point.percentage = 20,
                    point.total = 5
                `,
        'Keys in header should be replaced'
    );
    assert.strictEqual(
        chart.tooltip.headerFooterFormatter(
            chart.series[0].points[0],
            true
        ),
        'Series 1 5<br>',
        'Keys in footer are replaced'
    );
});

QUnit.test('Locale-aware tooltip header date formatting', function (assert) {
    const chart = Highcharts.chart('container', {
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                month: '%[BY]'
            }
        },
        tooltip: {
            headerFormat: '{ucfirst point.key}',
            pointFormat: '',
            footerFormat: ''
        },
        series: [{
            data: [
                [Date.UTC(2025, 0, 1), 1],
                [Date.UTC(2025, 1, 1), 2],
                [Date.UTC(2025, 2, 1), 3]
            ]
        }]
    });

    // #23462
    const locales = [
        // ASCII + Latin Extended
        'en', 'fr', 'de', 'es', 'it', 'pt-BR', 'pl',
        // Greek
        'el',
        // Cyrillic
        'ru', 'uk',
        // Hebrew
        'he',
        // Arabic + Extended
        'ar',
        // Urdu (Arabic script)
        'ur',
        // Bengali
        'bn',
        // Devanagari
        'hi',
        // Hiragana + Katakana
        'ja',
        // Hangul Jamo + Syllables
        'ko',
        // CJK Unified Ideographs
        'zh-CN', 'zh-TW'
    ];

    locales.forEach(locale => {
        chart.update({
            lang: { locale }
        });

        const point = chart.series[0].points[0];
        chart.tooltip.refresh(point);

        assert.strictEqual(
            chart.tooltip.label.text.textStr,
            point.key.charAt(0).toUpperCase() + point.key.slice(1),
            `Tooltip header should match point key for locale: ${locale}`
        );
    });
});

QUnit.test(
    'Tooltip default year format localizes digits (#24266)',
    function (assert) {
        const createChart = function (locale) {
                return Highcharts.chart('container', {
                    lang: {
                        locale
                    },
                    xAxis: {
                        type: 'datetime'
                    },
                    tooltip: {
                        headerFormat: '{point.key}',
                        pointFormat: '',
                        footerFormat: ''
                    },
                    series: [{
                        data: [
                            [Date.UTC(2025, 0, 1), 1],
                            [Date.UTC(2026, 0, 1), 2]
                        ]
                    }]
                });
            },
            localizedLocales = [{
                locale: 'ar-SA',
                regex: /[\u0660-\u0669]/,
                name: 'Arabic-Indic digits'
            }, {
                locale: 'fa-IR',
                regex: /[\u06F0-\u06F9]/,
                name: 'Persian digits'
            }],
            latinDigitLocales = ['en', 'pl'];

        localizedLocales.forEach(testCase => {
            const chart = createChart(testCase.locale),
                point = chart.series[0].points[0],
                yearLabel = chart.tooltip.headerFooterFormatter(point, false);

            assert.ok(
                testCase.regex.test(yearLabel),
                `Default year uses ${testCase.name} for ${testCase.locale}`
            );

            chart.destroy();
        });

        latinDigitLocales.forEach(locale => {
            const chart = createChart(locale),
                point = chart.series[0].points[0],
                yearLabel = chart.tooltip.headerFooterFormatter(point, false);

            assert.strictEqual(
                yearLabel,
                '2025',
                `Default year stays Latin for locale: ${locale}`
            );

            chart.destroy();
        });
    }
);
