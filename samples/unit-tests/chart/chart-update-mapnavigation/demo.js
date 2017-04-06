/* eslint func-style:0 */


QUnit.test('Update map navigation (#6369)', function (assert) {
    var chart = Highcharts.mapChart('container', {

        legend: {
            enabled: false
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                theme: {
                    fill: 'white',
                    'stroke-width': 1,
                    stroke: 'silver',
                    r: 0,
                    states: {
                        hover: {
                            fill: '#a4edba'
                        },
                        select: {
                            stroke: '#039',
                            fill: '#a4edba'
                        }
                    }
                },
                verticalAlign: 'bottom'
            }
        },

        series: [{
            data: [{
                path: 'M 0 0 L 100 0 L 100 100 L 0 100'
            }]
        }]
    });

    assert.strictEqual(
        chart.mapNavButtons[0].box.element.getAttribute('fill'),
        'white',
        'White button'
    );

    chart.update({
        mapNavigation: {
            buttonOptions: {
                theme: {
                    fill: 'black'
                }
            }
        }
    });

    assert.strictEqual(
        chart.mapNavButtons[0].box.element.getAttribute('fill'),
        'black',
        'Black button'
    );


    chart.update({
        mapNavigation: {
            enabled: false
        }
    });

    assert.strictEqual(
        chart.mapNavButtons[0],
        undefined,
        'No button'
    );

    chart.update({
        mapNavigation: {
            enabled: true
        }
    });

    assert.strictEqual(
        chart.mapNavButtons[0].box.element.getAttribute('fill'),
        'black',
        'Black button'
    );

});

