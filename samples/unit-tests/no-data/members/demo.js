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
