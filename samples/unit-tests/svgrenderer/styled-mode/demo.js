QUnit.test('No inline CSS should be allowed (#6173)', function (assert) {
    Highcharts.chart('container', {

        chart: {
            type: 'column'
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
        document.getElementById('container')
            .firstChild.innerHTML.indexOf('style='),
        -1,
        'No inline styles found'
    );
});