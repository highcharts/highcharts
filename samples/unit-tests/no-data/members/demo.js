QUnit.test('defaultOptions', assert => {
    const {
        noData: {
            attr: { zIndex }
        }
    } = Highcharts.getOptions();

    assert.equal(zIndex, 1, 'Default z index should be 1 (#12343)');
});

QUnit.test('Updating no-data element.', assert => {
    const chart = Highcharts.chart('container', {
        lang: {
            noData: 'No data'
        }
    });

    chart.update({
        noData: {
            style: {
                color: '#ff0000'
            }
        }
    });

    assert.equal(
        chart.noDataLabel.text.styles.color,
        '#ff0000',
        'Updated color should be red (#13982)'
    );

    chart.addSeries({
        type: 'pie',
        data: [
            { y: 5, visible: false },
            { y: 3, visible: false }
        ]
    });

    assert.ok(
        chart.noDataLabel && chart.noDataLabel.textStr === 'No data',
        '`noData` label should be shown for hidden pie data (#23235)'
    );
});

QUnit.test('Hidden bubble series', assert => {
    const chart = Highcharts.chart('container', {
        series: [{
            type: 'bubble',
            data: [[1, 2, 3], [2, 3, 4]]
        }]
    });

    chart.series[0].hide();

    assert.ok(
        chart.noDataLabel,
        '`noData` label should be shown when the bubble series is hidden ' +
        '(#25682)'
    );

    chart.series[0].show();

    assert.notOk(
        chart.noDataLabel,
        '`noData` label should be hidden when the bubble series is shown'
    );
});
