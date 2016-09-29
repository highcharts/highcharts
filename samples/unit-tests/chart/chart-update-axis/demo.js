/* eslint func-style:0 */
$(function () {

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
                id: 'primary',
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

});
