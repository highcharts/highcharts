QUnit.test(
    'Title alignment',
    assert => {
        const chart = Highcharts.chart('container', {
            chart: {
                width: 600,
                height: 300
            },
            title: {
                text: 'The quick brown fox jumps over the lazy dog'
            },
            subtitle: {
                text: 'The subtitle'
            },
            series: [
                {
                    data: [50, 10]
                }
            ]
        });

        assert.strictEqual(
            chart.title.scaleX,
            1,
            'The title should initially be scaled to 1'
        );

        assert.strictEqual(
            chart.title.alignOptions.align,
            'center',
            'The title should initially be centered'
        );

        assert.strictEqual(
            chart.subtitle.alignOptions.align,
            'center',
            'The subtitle should initially be centered'
        );

        chart.setSize(400);

        assert.ok(
            chart.title.scaleX < 1,
            'Limited space, the title should be scaled down'
        );

        assert.strictEqual(
            chart.title.alignOptions.align,
            'center',
            'Limited space, the title should be centered'
        );

        assert.strictEqual(
            chart.subtitle.alignOptions.align,
            'center',
            'Limited space, the subtitle should be centered'
        );

        chart.setSize(300);

        assert.strictEqual(
            chart.title.scaleX,
            chart.options.title.minScale,
            'Minimum scale reached, the title should be scaled down ' +
            'to `minScale`'
        );

        assert.strictEqual(
            chart.title.alignOptions.align,
            'left',
            'Minimum scale reached, the title should be left-aligned'
        );

        assert.strictEqual(
            chart.subtitle.alignOptions.align,
            'left',
            'Minimum scale reached, the subtitle should be left-aligned'
        );

        chart.update({
            title: {
                align: 'center'
            },
            subtitle: {
                align: 'center'
            }
        });

        assert.strictEqual(
            chart.title.alignOptions.align,
            'center',
            'Explicit title align, the title should be centered'
        );

        assert.strictEqual(
            chart.subtitle.alignOptions.align,
            'center',
            'Explicit subtitle align, the subtitle should be centered'
        );

        chart.update({
            title: {
                minScale: 1
            }
        });

        assert.strictEqual(
            chart.title.scaleX,
            1,
            'Explicit minScale should be respected'
        );
    }
);
