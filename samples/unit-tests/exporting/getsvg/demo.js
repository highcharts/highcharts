
QUnit.test('getSVG', function (assert) {

    var chart = Highcharts.chart('container', {

        credits: {
            enabled: false
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0,
                135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }, {
            data: [4, 2, 5, 3, 6, 5, 6, 3, 4],
            id: 'second'
        }]

    });

    var initialChartsLength = Highcharts.charts.length,
        svg,
        output;

    svg = chart.getSVG({
        yAxis: [{
            title: {
                text: 'New yAxis Title'
            }
        }],
        series: [{
            name: 'New Series Name'
        }]
    });

    assert.strictEqual(
        Highcharts.charts.length,
        initialChartsLength,
        'Chart length is still as initial'
    );

    assert.strictEqual(
        typeof svg,
        'string',
        'SVG is string'
    );

    assert.strictEqual(
        svg.indexOf('<svg '),
        0,
        'Starts correctly'
    );

    assert.strictEqual(
        svg.indexOf('</svg>'),
        svg.length - 6,
        'Ends correctly'
    );

    assert.strictEqual(
        svg.length > 1000,
        true,
        'Has some content'
    );

    output = document.getElementById('output');
    output.innerHTML = svg;

    assert.strictEqual(
        output.querySelector(
            '.highcharts-legend .highcharts-series-0 text tspan'
        ).textContent,
        'New Series Name',
        'No reference, series name ok'
    );

    svg = chart.getSVG({
        series: [{
            name: 'Second Series Name',
            id: 'second'
        }]
    });

    output = document.getElementById('output');
    output.innerHTML = svg;

    assert.strictEqual(
        output.querySelector(
            '.highcharts-legend .highcharts-series-1 text tspan'
        ).textContent,
        'Second Series Name',
        'Reference by id, series name ok'
    );

});
