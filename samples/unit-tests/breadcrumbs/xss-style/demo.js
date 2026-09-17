QUnit.module('Breadcrumbs XSS', function () {

    QUnit.test(
        'Breadcrumbs style should not become event handlers',
        function (assert) {
            const chart = Highcharts.chart('container', {
                chart: {
                    animation: false
                },
                drilldown: {
                    animation: false,
                    breadcrumbs: {
                        showFullPath: true,
                        style: {
                            onmouseover: 'window.breadcrumbsPwned = true',
                            fontWeight: 'bold'
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

            // The option is documented as CSS, so applying it with `css`
            // rather than `attr` also makes text properties take effect.
            assert.strictEqual(
                window.getComputedStyle(
                    button.querySelector('text')
                ).fontWeight,
                '700',
                'CSS properties in the style option should be applied'
            );
        }
    );
});
