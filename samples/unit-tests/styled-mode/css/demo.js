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
    assert.ok(
        container.classList.contains('highcharts-light'),
        'The initial class name'
    );

    assert.strictEqual(
        styles.getPropertyValue('--highcharts-background-color'),
        '#ffffff',
        'The --highcharts-background-color should be set'
    );

    container.classList.remove('highcharts-light');
    container.classList.add('highcharts-dark');

    assert.ok(
        container.classList.contains('highcharts-dark'),
        'The class name should be swapped'
    );

    assert.strictEqual(
        styles.getPropertyValue('--highcharts-background-color'),
        '#141414',
        'The --highcharts-background-color should be swapped'
    );

    container.classList.remove('highcharts-dark');

});

// Skipped due to implementing variable-driven palette in v13
QUnit.skip(
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
        container.classList.remove('highcharts-light');
    });
