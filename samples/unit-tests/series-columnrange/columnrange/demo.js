QUnit.test('#14440: Missing adjustForMissingColumns', (assert) => {
    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        plotOptions: {
            columnrange: {
                centerInCategory: true
            }
        },
        series: [
            {
                type: 'columnrange',
                data: [{ high: 2, low: 1, x: 0 }]
            }
        ]
    });

    assert.ok(true, 'Enabling centerInCategory should not throw');
});
