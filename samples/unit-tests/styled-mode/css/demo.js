/**
 * Note: These test mostly exists to confirm that the test environment injects
 * CSS correctly
 */

QUnit.test('CSS variables should be set', function (assert) {
    const container = document.querySelector('#container');
    container.classList.add('highcharts-light');

    Highcharts.chart(
        container,
        {
            chart: {
                styledMode: true,
                type: 'bar'
            },
            series: [{
                data: [1, 2, 3]
            }]
        }
    );

    const styles = getComputedStyle(container);
    assert.ok(container.classList.contains('highcharts-light'));

    assert.strictEqual(
        styles.getPropertyValue('--highcharts-background-color'),
        '#ffffff'
    );

    container.classList.remove('highcharts-light');
    container.classList.add('highcharts-dark');

    assert.ok(container.classList.contains('highcharts-dark'));

    assert.strictEqual(
        styles.getPropertyValue('--highcharts-background-color'),
        'rgb(48, 48, 48)'
    );
});

QUnit.test(
    'CSS variables should be not be set when styled mode is false',
    function (assert) {
        const container = document.querySelector('#container');
        container.classList.add('highcharts-light');

        Highcharts.chart(
            container,
            {
                chart: {
                    styledMode: false,
                    type: 'bar'
                },
                series: [{
                    data: [1, 2, 3]
                }]
            }
        );

        const styles = getComputedStyle(container);
        assert.ok(container.classList.contains('highcharts-light'));

        assert.strictEqual(
            styles.getPropertyValue('--highcharts-background-color'),
            ''
        );
    });
