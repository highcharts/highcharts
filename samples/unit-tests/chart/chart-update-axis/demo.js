/* eslint func-style:0 */


QUnit.test('Test updating axis by id', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            animation: false,
            height: 300
        },

        plotOptions: {
            series: {
                animation: false
            }
        },

        xAxis: [{
            categories: ['One', 'Two', 'Three', 'Four'],
            id: 'primary'
        }, {
            id: 'secondary',
            categories: ['Einz', 'Zwei', 'Drei', 'Vier'],
            linkedTo: 0
        }],

        series: [{
            data: [1, 3, 2, 4],
            name: 'First'
        }, {
            data: [5, 3, 4, 1],
            name: 'Last',
            id: 'last'
        }]
    });

    assert.strictEqual(
        chart.xAxis[0].categories[0],
        'One',
        'Initial category'
    );

    assert.strictEqual(
        chart.xAxis[1].categories[0],
        'Einz',
        'Initial category'
    );

    chart.update({
        xAxis: {
            categories: ['Ein', 'To', 'Tre', 'Fire']
        }
    });

    assert.strictEqual(
        chart.xAxis[0].categories[0],
        'Ein',
        'Axis updated'
    );

    chart.update({
        xAxis: {
            id: 'secondary',
            categories: ['Ein', 'To', 'Tre', 'Fire']
        }
    });

    assert.strictEqual(
        chart.xAxis[1].categories[0],
        'Ein',
        'Updated category'
    );



    chart.update({
        xAxis: [{
            id: 'primary',
            categories: ['Uno', 'Dos', 'Tres', 'Cuatro']
        }, {
            id: 'secondary',
            categories: ['Uno', 'Dos', 'Tres', 'Cuatro']
        }]
    });

    assert.strictEqual(
        chart.xAxis[0].categories[0],
        'Uno',
        'Updated category'
    );
    assert.strictEqual(
        chart.xAxis[1].categories[0],
        'Uno',
        'Updated category'
    );

});


QUnit.test('Updating unidentified axes by index (#6019)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        yAxis: [{
            labels: {
                x: -15
            },
            title: {
                text: 'Items'
            }
        }, {
            title: {
                text: 'ADDITIONAL AXIS 1',
                style: {
                    color: 'red'
                }
            }
        }, {
            title: {
                text: 'ADDITIONAL AXIS 2',
                style: {
                    color: 'blue'
                }
            }
        }],
        series: [{
            name: 'Sales',
            data: [434, 523, 345, 785, 565, 843, 726, 590, 665, 434, 312, 432]
        }]
    });

    assert.strictEqual(
        chart.yAxis.map(function (item) {
            return item.options.title.text;
        }).toString(),
        'Items,ADDITIONAL AXIS 1,ADDITIONAL AXIS 2',
        'Initial titles'
    );



    chart.update({
        yAxis: [{
            title: {
                text: 'Items changed',
                style: {
                    color: 'yellow'
                }
            }
        }, {
            title: {
                text: 'ADDITONAL AXIS 1 CHANGED',
                style: {
                    color: 'green'
                }
            }
        }, {
            title: {
                text: 'ADDITONAL AXIS 2 CHANGED',
                style: {
                    color: 'purple'
                }
            }
        }]
    });

    assert.strictEqual(
        chart.yAxis.map(function (item) {
            return item.options.title.text;
        }).toString(),
        'Items changed,ADDITONAL AXIS 1 CHANGED,ADDITONAL AXIS 2 CHANGED',
        'Updated titles'
    );
});

