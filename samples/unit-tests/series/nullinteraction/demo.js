QUnit.test('Null interaction should allow tooltip for null points', assert => {
    const chart = Highcharts.chart('container', {
            chart: {
                type: 'bar'
            },
            tooltip: {
                nullFormat: '<span>Null</span>',
                hideDelay: 500000
            },
            series: [{
                data: [null],
                nullInteraction: true
            }, {
                data: [1],
                nullInteraction: true
            }]
        }),
        tt = chart.tooltip,
        refreshTT = () => tt.refresh([
            chart.series[0].points[0],
            chart.series[1].points[0]
        ]),
        seriesTypes = [
            'column',
            'line'
        ],
        // 'Aggregated modes' are 'split' or 'shared', i.e. when tt is
        // constructedfrom multiple sources
        testAggregatedMode = (mode, ttContentStr) => {

            assert.strictEqual(
                tt.len,
                2,
                `${mode} tooltip should show null-point and normal point`
            );

            assert.strictEqual(
                ttContentStr.includes('Null'),
                true,
                `${mode} tooltip should be using user-supplied 'nullFormat'`
            );
        };

    let seriesIndex = seriesTypes.length - 1;

    do {
        tt.refresh(chart.series[0].points[0]);

        assert.ok(
            tt.label.text.textStr.includes('Null'),
            `Type ${chart.series[0].type}, normal tooltip should include 'Null'
            (is ${tt.label.text.textStr})`
        );

        // Only run extended tests for line/column, since timeline does not
        // support shared/split
        if (seriesIndex < 3) {
            chart.update({
                chart: {
                    type: seriesTypes[seriesIndex]
                },
                tooltip: {
                    shared: true
                }
            });

            refreshTT();
            testAggregatedMode('Shared', tt.label.text.textStr);

            chart.update({ tooltip: { shared: false, split: true } });

            refreshTT();
            testAggregatedMode('Split', tt.label.element.textContent);

            chart.update({ tooltip: { split: false } });
        }

        chart.update({ chart: { type: seriesTypes[--seriesIndex] } });
    } while (seriesIndex);
});
