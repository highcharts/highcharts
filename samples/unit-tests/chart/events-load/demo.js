/* eslint func-style:0 */
$(function () {

    QUnit.test('Load event without images', function (assert) {
        var loaded = false,
            chart = Highcharts.chart('container', {

                chart: {
                    events: {
                        load: function (e) {
                            loaded = true;
                        }
                    }
                },

                series: [{
                    animation: false,
                    data: [1, 2, 3]
                }]

            });

        assert.strictEqual(
            loaded,
            true,
            'Chart load is synchronous'
        );

    });

    QUnit.test('Load event with images is async', function (assert) {
        var loaded = false,
            done = assert.async(),
            chart = Highcharts.chart('container', {

                chart: {
                    events: {
                        load: function (e) {
                            assert.strictEqual(
                                chart.container.querySelector('image').getAttribute('width'),
                                '30',
                                'Image width is set async'
                            );
                            loaded = true;

                            done();
                        }
                    }
                },

                series: [{
                    animation: false,
                    data: [1, 2, 3],
                    marker: {
                        symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'
                    }
                }]

            });

        assert.strictEqual(
            loaded,
            false,
            'Chart load is not synchronous'
        );

    });

});