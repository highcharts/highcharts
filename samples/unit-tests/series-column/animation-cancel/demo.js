QUnit.test(
    'Updating the chart while the initial animation is running (#18644)',
    function (assert) {
        const clock = TestUtilities.lolexInstall(),
            chart = Highcharts.chart('container', {
                chart: {
                    type: 'column'
                },
                series: [{
                    animation: {
                        duration: 10
                    },
                    data: [3]
                }]
            });

        chart.update({
            yAxis: {
                min: -5
            }
        }, false);

        setTimeout(() => {
            assert.notOk(
                chart.container.innerHTML.includes('NaN'),
                'The innerHtml of the chart container should not contain NaNs'
            );
        }, 20);

        TestUtilities.lolexRunAndUninstall(clock);
    }
);
