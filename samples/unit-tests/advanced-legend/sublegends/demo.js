QUnit.test('Items are rendered in sublegends.', function (assert) {

    var sumElements = function (acc, item) {
            return acc + (item.legendItem.element ? 1 : 0);
        },
        chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },

            series: [{
                data: [1, 6, 7],
                legend: 's1'
            }, {
                data: [2, 7],
                legend: 's2'
            }, {
                data: [1, 9],
                legend: 's2'
            }],
            legend: [{
                layout: 'vertical',
                borderWidth: 1,
                sublegends: [{
                    id: 's1',
                    title: {
                        text: "Sublegend 1."
                    }
                }, {
                    id: 's2',
                    title: {
                        text: "Sublegend 2."
                    }
                }]
            }]
        });


    assert.strictEqual(
        chart.legend[0].sublegends[0].allItems.reduce(sumElements, 0),
        1,
        'First sublegend contains 1 item.'
    );

    assert.strictEqual(
        chart.legend[0].sublegends[1].allItems.reduce(sumElements, 0),
        2,
        'Second sublegend contains 2 items.'
    );

});
