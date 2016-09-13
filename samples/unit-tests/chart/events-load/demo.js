/* eslint func-style:0 */
$(function () {

    QUnit.test('Load event without images', function (assert) {
        var flagLoad = false,
            flagCallback = false;


        Highcharts.chart('container', {

            chart: {
                events: {
                    load: function () {
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
                        load: function () {
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

        // Fail safe
        setTimeout(done, 2000);

    });

    QUnit.test('Image in a module', function (assert) {

        var flagLoad = false,
            flagCallback = false,
            done = assert.async();

        Highcharts.chart('container', {

            chart: {
                events: {
                    load: function () {
                        assert.strictEqual(
                            this.container.querySelectorAll('image').length,
                            1,
                            'events.load: Image added after callbacks'
                        );
                        flagLoad = true;

                        if (flagLoad && flagCallback) {
                            done();
                        }
                    }
                }
            },

            series: [{
                data: [1, 2, 3]
            }],

            exporting: {
                buttons: {
                    customButton: {
                        symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'
                    }
                }
            }

        }, function () {
            assert.strictEqual(
                this.container.querySelectorAll('image').length,
                0,
                'callback: Image not yet added'
            );

            flagCallback = true;

            if (flagLoad && flagCallback) {
                done();
            }
        });

        // Fail safe
        setTimeout(done, 2000);

    });

    QUnit.test('Image size is cached (#5053, second case)', function (assert) {

        var count = 0,
            done = assert.async();

        function finito() {
            assert.strictEqual(
                count,
                4,
                'All callbacks called'
            );
            done();
        }

        function buildChart() {
            Highcharts.chart('container', {

                chart: {
                    events: {
                        load: function () {
                            count++;

                            if (count === 4) {
                                finito();
                            }
                        }
                    }
                },
                series: [{
                    data: [1, 3, 2],
                    marker: {
                        symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'
                    }
                }]

            }, function () {
                count++;

                if (count === 4) {
                    finito();
                }
            });
        }

        // The first time, image sizes are found on image load
        buildChart();

        // The second time, they are obtained from Highcharts cache
        setTimeout(function () {
            buildChart();
        }, 200);

        // Fail safe
        setTimeout(done, 2000);

    });

    QUnit.test('Issue #5606, error when chart was destroyed before images were loaded', function (assert) {
        assert.expect(0);
        var chart = Highcharts.chart('container', {

            series: [{
                name: 'Image symbol',
                data: [1, 2, 3],
                marker: {
                    symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png?dummy=' + Date.now() + ')'
                }
            }]
        });
        chart.destroy();
    });

});