QUnit.test('No inline CSS should be allowed (#6173)', function (assert) {
    var chart = Highcharts.chart('container', {

        chart: {
            type: 'column',
            styledMode: true
        },

        // A11y uses outline:0 on points
        accessibility: {
            enabled: false
        },

        title: {
            text: 'Styling axes'
        },

        subtitle: {
            text: 'Subtitle has <b>bold</b> and <i>italic</i> pseudo-HTML'
        },

        yAxis: [{
            className: 'highcharts-color-0',
            title: {
                text: 'Primary axis'
            },
            labels: {
                css: {
                    whiteSpace: 'nowrap'
                }
            }
        }, {
            className: 'highcharts-color-1',
            opposite: true,
            title: {
                text: 'Secondary axis'
            }
        }],

        series: [{
            data: [1, 3, 2, 4]
        }, {
            data: [324, 124, 547, 221],
            yAxis: 1
        }]

    });

    assert.strictEqual(
        chart.container.firstChild.innerHTML.indexOf('style='),
        -1,
        'No inline styles found'
    );
});