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
                    point.color = var(--highcharts-color-0),
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