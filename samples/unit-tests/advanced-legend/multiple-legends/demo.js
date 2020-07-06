QUnit.test('Multiple legends are rendered.', function (assert) {

    var message1 = 'Title updated',
        chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },

            series: [{
                data: [1],
                legend: 'l1'
            }, {
                data: [2],
                legend: 'l2'
            }, {
                data: [3],
                legend: 'l2'
            }],

            legend: [{
                id: 'l1'
            }, {
                id: 'l2',
                align: 'left',
                verticalAlign: 'middle'
            }]

        });

    assert.strictEqual(
        chart.legend.length,
        2,
        'Two legends were created.'
    );

    chart.legend[1].update({
        title: {
            text: message1
        }
    });

    assert.ok(
        chart.legend[1].title.text.element.innerHTML.indexOf(message1) > -1,
        message1
    );

});


QUnit.test('Bubble legend is rendered correctly in its destination legend.', function (assert) {

    var chart = Highcharts.chart('container', {

        series: [{
            data: [1, 2, 4, 5],
            legend: 'l1'
        }, {
            type: 'bubble',
            legend: 'legend-bubble',
            data: [{
                x: 5,
                y: 5,
                z: 13.8
            },
            {
                x: 6.5,
                y: 2.9,
                z: 14.7
            }
            ]
        }],


        legend: [{
            id: 'l1'
        }, {
            id: 'legend-bubble',
            borderWidth: 1,
            title: {
                text: 'Bubble legend'
            },
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            bubbleLegend: {
                enabled: true
            }

        }]
    });


    assert.ok(
        chart.legend[1].allItems[0].legendItem.element,
        'Bubble legend is present in the chart.'
    );


});


QUnit.test('Color axes are correctly rendered in their destination legends.', function (assert) {

    var chart = Highcharts.chart('container', {

        chart: {
            type: 'column'
        },

        colorAxis: [{
            layout: 'vertical',
            legend: 'legend-color-axis-1'
        }, {
            layout: 'vertical',
            legend: 'legend-color-axis-2'
        }],

        plotOptions: {
            series: {
                showInLegend: false
            }

        },
        series: [{
            data: [4, 5, 6, 7, 1],
            colorAxis: 0
        }, {
            data: [5, 6, 7, 1, 0],
            colorAxis: 1
        }],

        legend: [{
            id: 'legend-color-axis-1',
            align: 'left',
            layout: 'vertical',
            title: {
                text: 'Legend 1.'
            }
        }, {
            id: 'legend-color-axis-2',
            align: 'right',
            layout: 'vertical',
            title: {
                text: 'Legend 2.'
            }
        }]
    });

    assert.ok(
        chart.legend[0].allItems[0].legendItem.element,
        'First color axis is rendered in the first legend.'
    );

    assert.ok(
        chart.legend[1].allItems[0].legendItem.element,
        'Second color axis is rendered in the second legend.'
    );


});

QUnit.test('Add & Remove a legend.', function (assert) {

    var chart = Highcharts.chart('container', {
        legend: [{
            id: 'legend1',
            align: 'left',
            verticalAlign: 'middle'
        }, {
            id: 'legend2'
        }],
        series: [{
            data: [1, 2, 3, 4],
            legend: 'legend1'
        }, {
            data: [2, 3, 5, 1],
            legend: 'legend2',
            name: "Series 2"
        }]
    });

    assert.strictEqual(
        chart.legend.length,
        2,
        'There are two legends in one chart.'
    );

    chart.legend[1].remove();

    assert.strictEqual(
        chart.legend.length,
        1,
        'There is only one legend in a chart.'
    );

    chart.addLegend({
        id: 'legend2'
    });

    assert.strictEqual(
        chart.legend[1].allItems[0].name,
        "Series 2",
        'The legend was successfully added and contains the correct item.'
    );

}); 