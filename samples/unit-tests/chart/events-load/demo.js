/* eslint func-style:0 */
$(function () {

    QUnit.test('Load event without images', function (assert) {
        var flagLoad = false,
            flagCallback = false,
            chart = Highcharts.chart('container', {

                chart: {
                    events: {
                        load: function (e) {
                            flagLoad = true;
                        }
                    }
                },

                series: [{
                    animation: false,
                    data: [1, 2, 3]
                }]

            }, function () {
                flagCallback = true;
            });

        assert.strictEqual(
            flagLoad,
            true,
            'Chart events.load is synchronous'
        );

        assert.strictEqual(
            flagCallback,
            true,
            'Chart callback is synchronous'
        );

    });

    QUnit.test('Load event with images is async', function (assert) {

        var flagLoad = false,
            flagCallback = false,
            done = assert.async(),
            chart = Highcharts.chart('container', {

                chart: {
                    events: {
                        load: function (e) {
                            assert.strictEqual(
                                chart.container.querySelector('image').getAttribute('width'),
                                '30',
                                'events.load: Image width is set async'
                            );
                            flagLoad = true;

                            if (flagLoad && flagCallback) {
                                done();
                            }
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

            }, function () {
                assert.strictEqual(
                    this.container.querySelector('image').getAttribute('width'),
                    '30',
                    'callback: Image width is set async'
                );

                flagCallback = true;

                if (flagLoad && flagCallback) {
                    done();
                }
            });

        assert.strictEqual(
            flagLoad,
            false,
            'Chart events.load is not synchronous'
        );
        assert.strictEqual(
            flagCallback,
            false,
            'Chart callback is not synchronous'
        );

    });

});