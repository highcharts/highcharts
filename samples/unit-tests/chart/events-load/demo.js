/* eslint func-style:0 */

(function () {
    var url = (location.host === 'localhost:9876') ?
        'url(base/test/testimage.png)' : // karma
        'url(testimage.png)'; // utils

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
            done = assert.async(2),
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

                            done();
                        }
                    }
                },

                series: [{
                    animation: false,
                    data: [1, 2, 3],
                    marker: {
                        symbol: url
                    }
                }]

            }, function () {
                assert.strictEqual(
                    this.container.querySelector('image').getAttribute('width'),
                    '30',
                    'callback: Image width is set async'
                );

                flagCallback = true;

                done();
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

    QUnit.test('Image in a module', function (assert) {

        var done = assert.async(2);

        Highcharts.chart('container', {

            chart: {
                events: {
                    load: function () {
                        assert.strictEqual(
                            this.container.querySelectorAll('image').length,
                            1,
                            'events.load: Image added after callbacks'
                        );
                        done();
                    }
                }
            },

            series: [{
                data: [1, 2, 3]
            }],

            exporting: {
                buttons: {
                    customButton: {
                        symbol: url
                    }
                }
            }

        }, function () {
            assert.strictEqual(
                this.container.querySelectorAll('image').length,
                0,
                'callback: Image not yet added'
            );

            done();
        });

    });

    QUnit.test('Image size is cached (#5053, second case)', function (assert) {

        var done = assert.async(4);

        assert.expect(0);

        function buildChart() {
            Highcharts.chart('container', {

                chart: {
                    events: {
                        load: done
                    }
                },
                series: [{
                    data: [1, 3, 2],
                    marker: {
                        symbol: url
                    }
                }]

            }, done);
        }

        // The first time, image sizes are found on image load
        buildChart();

        // The second time, they are obtained from Highcharts cache
        setTimeout(function () {
            buildChart();
        }, 200);


    });

    QUnit.test('Issue #5606, error when chart was destroyed before images were loaded', function (assert) {
        assert.expect(0);
        var chart = Highcharts.chart('container', {

            series: [{
                name: 'Image symbol',
                data: [1, 2, 3],
                marker: {
                    symbol: url.replace(')', '?' + Date.now() + ')')
                }
            }]
        });
        chart.destroy();
    });
}());
