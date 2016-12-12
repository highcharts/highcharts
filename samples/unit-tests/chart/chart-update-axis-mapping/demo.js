/* eslint func-style:0 */
$(function () {

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
});

