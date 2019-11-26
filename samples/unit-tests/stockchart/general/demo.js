QUnit.test('Pie in Highstock, StockChart constructor', function (assert) {

    var chart;

    chart = new Highcharts.StockChart({
        chart: {
            renderTo: "container"
        },
        navigator: {
            enabled: false
        },
        series: [{
            type: "pie",
            data: [{
                y: 36
            }]
        }]
    });

    assert.strictEqual(
        typeof chart.series[0].points[0].graphic,
        'object',
        'Has slice'
    );
});

QUnit.test('Stock chart with overshooting range (#4501)', function (assert) {
    var chart,
        i;


    var eps = [{
        x: Date.UTC(2005, 11, 31, 12, 0, 0, 0),
        y: 15.3
    }, {
        x: Date.UTC(2015, 11, 31, 12, 0, 0, 0),
        y: 41.95
    }];

    var buttons = [];
    for (i = 11; i > 6; i--) {
        buttons.push({
            type: "year",
            count: i,
            text: i + "y"
        });
    }

    $('#container').highcharts('StockChart', {
        rangeSelector: {
            buttons: buttons
            //allButtonsEnabled: true //or false - doesn't matter
        },
        xAxis: {
            minRange: 1
        },
        series: [{
            name: "EPS",
            data: eps
        }]
    });
    chart = $('#container').highcharts();

    assert.strictEqual(
        chart.xAxis[0].max,
        Date.UTC(2015, 11, 31, 12, 0, 0, 0),
        'Initially valid maximum'
    );


    chart.rangeSelector.clickButton(2);
    assert.strictEqual(
        chart.xAxis[0].max,
        Date.UTC(2015, 11, 31, 12, 0, 0, 0),
        'Valid maximum for 9 years'
    );

    chart.rangeSelector.clickButton(1);
    assert.strictEqual(
        chart.xAxis[0].max,
        Date.UTC(2015, 11, 31, 12, 0, 0, 0),
        'Valid maximum for full range'
    );


});

QUnit.test('Default plot options for stock chart', function (assert) {

    const chart = Highcharts.stockChart('container', {
        series: [{
            data: [1, 2, 3, 4],
            marker: {
                enabled: true
            }
        }],
        navigator: {
            enabled: false
        },
        rangeSelector: {
            enabled: false
        },
        scrollbar: {
            enabled: false
        }
    });

    assert.strictEqual(
        chart.series[0].options.marker.radius,
        2,
        'The default marker radius for stock charts should be respected'
    );

    chart.update({
        plotOptions: {
            line: {
                marker: {
                    radius: 10
                }
            }
        }
    });

    assert.strictEqual(
        chart.series[0].options.marker.radius,
        10,
        'The set plotOptions type marker should be respected'
    );

    chart.series[0].update({
        marker: {
            radius: 5
        }
    });

    assert.strictEqual(
        chart.series[0].options.marker.radius,
        5,
        'The individual series marker should be respected'
    );
});
