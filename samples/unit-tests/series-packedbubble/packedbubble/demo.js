QUnit.test('Packed Bubble layouts operations', function (assert) {

    const chart = Highcharts.chart('container', {
        chart: {
            type: 'packedbubble',
            height: '100%'
        },
        title: false,
        plotOptions: {
            packedbubble: {
                layoutAlgorithm: {
                    enableSimulation: false,
                    splitSeries: true
                },
                dataLabels: {
                    enabled: false
                }
            }
        },
        series: [{
            data: [{
                value: 20
            }, {
                value: 20
            }]
        }, {
            data: [{
                value: 20
            }, {
                value: 20
            }]
        }, {
            data: [{
                value: 20
            }]
        }]
    });

    chart.series[2].remove();

    function compareCollections(collections, collection) {
        var equal = true;

        collections.forEach(function (c) {
            if (equal) {
                equal = c.series.length === collection.length;
            }
        });

        return equal;
    }

    assert.strictEqual(
        compareCollections(chart.graphLayoutsLookup, chart.series),
        true,
        'Series is removed from layout.series collection.'
    );
});