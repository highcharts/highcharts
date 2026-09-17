QUnit.module('Breadcrumbs XSS', function () {

    /**
     * Collect the Highcharts errors fired while running `fn`, and keep them
     * out of the console.
     *
     * @param {Function} fn
     * The function to run.
     *
     * @return {Array<number|string>}
     * The error codes that were fired.
     */
    function captureErrors(fn) {
        const codes = [],
            unbind = Highcharts.addEvent(
                Highcharts,
                'displayError',
                function (e) {
                    codes.push(e.code);
                    return false;
                }
            );

        try {
            fn();
        } finally {
            unbind();
        }

        return codes;
    }

    QUnit.test(
        'Breadcrumbs style should not become event handlers',
        function (assert) {
            let chart;

            const codes = captureErrors(function () {
                chart = Highcharts.chart('container', {
                    chart: {
                        animation: false
                    },
                    drilldown: {
                        animation: false,
                        breadcrumbs: {
                            showFullPath: true,
                            style: {
                                onmouseover: 'window.breadcrumbsPwned = true',
                                opacity: 0.5
                            }
                        },
                        series: [{
                            id: 'fruits',
                            data: [['Apples', 1], ['Pears', 2]]
                        }]
                    },
                    series: [{
                        type: 'column',
                        data: [{
                            name: 'Fruits',
                            y: 3,
                            drilldown: 'fruits'
                        }]
                    }]
                });

                chart.series[0].points[0].doDrilldown();
            });

            const button = document.querySelector(
                '.highcharts-breadcrumbs-button'
            );

            assert.ok(
                button,
                'The breadcrumbs button should be rendered'
            );

            assert.strictEqual(
                button.getAttribute('onmouseover'),
                null,
                'The `onmouseover` key should not be set as an attribute'
            );

            assert.notOk(
                button.onmouseover,
                'The `onmouseover` key should not become a live event handler'
            );

            assert.strictEqual(
                button.getAttribute('opacity'),
                '0.5',
                'Allowed attributes should still be applied'
            );

            assert.ok(
                codes.indexOf(33) !== -1,
                'The blocked attribute should be reported as error #33'
            );
        }
    );

    QUnit.test(
        'Gradient options should not become event handlers',
        function (assert) {
            captureErrors(function () {
                Highcharts.chart('container', {
                    chart: {
                        animation: false
                    },
                    series: [{
                        type: 'column',
                        data: [1, 2],
                        color: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1,
                                onmouseover: 'window.gradientPwned = true'
                            },
                            stops: [[0, '#ff0000'], [1, '#0000ff']]
                        }
                    }]
                });
            });

            const gradient = document.querySelector(
                '#container linearGradient'
            );

            assert.ok(
                gradient,
                'The gradient should be rendered'
            );

            assert.strictEqual(
                gradient.getAttribute('onmouseover'),
                null,
                'The `onmouseover` key should not be set as an attribute'
            );

            assert.notOk(
                gradient.onmouseover,
                'The `onmouseover` key should not become a live event handler'
            );

            assert.strictEqual(
                gradient.getAttribute('y2'),
                '1',
                'Regular gradient attributes should still be applied'
            );
        }
    );
});
