QUnit.test('Reversed axis range(#1457)', function (assert) {
    var chart = new Highcharts.Chart({

        chart: {
            renderTo: 'container',
            type: 'columnrange',
            inverted: false
        },

        yAxis: {
            reversed: true
        },

        series: [{
            animation: false,
            name: 'Temperatures',
            data: [
                [1, 2],
                [2, 3],
                [3, 4]
            ],
            dataLabels: {
                enabled: true
            }
        }]

    });

    var point = chart.series[0].points[0];
    assert.strictEqual(
        parseInt(point.graphic.element.getAttribute('height'), 10) > 25,
        true,
        'First element has a height'
    );

    assert.strictEqual(
        point.dataLabel.y < point.plotLow,
        true,
        '"Low" data label is drawn above point'
    );
    assert.strictEqual(
        Math.round(point.dataLabelUpper.y) >= Math.round(point.plotHigh),
        true,
        '"High" data label is drawn below point'
    );
});


QUnit.test('Reversed axis range - inverted', function (assert) {

    var chart = new Highcharts.Chart({

        chart: {
            renderTo: 'container',
            type: 'columnrange',
            inverted: true
        },

        yAxis: {
            reversed: true
        },

        series: [{
            animation: false,
            name: 'Temperatures',
            data: [
                [1, 2],
                [2, 3],
                [3, 4]
            ],
            dataLabels: {
                enabled: true
            }
        }]

    });

    var point = chart.series[0].points[0];
    assert.strictEqual(
        parseInt(point.graphic.element.getAttribute('height'), 10) > 25,
        true,
        'First element has a height'
    );
});

QUnit.test('#6773 - cannot update xAxis range dynamically', function (assert) {
    var chart = Highcharts.stockChart('container', {
        xAxis: {
            range: 5
        },
        series: [{
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }]
    });

    chart.xAxis[0].update({
        range: 10
    });

    assert.strictEqual(
        chart.xAxis[0].min,
        9,
        'range updated'
    );
});