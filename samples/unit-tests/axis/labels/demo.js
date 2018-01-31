QUnit.test('Label overflow', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            width: 300,
            height: 200
        },
        xAxis: {
            min: 0,
            max: 3,
            tickInterval: 3,
            labels: {
                format: 'LongLabel',
                overflow: false
            }
        },
        series: [{
            data: [1, 2, 3]
        }]
    });

    var bBox = chart.xAxis[0].ticks[3].label.element.getBBox();
    assert.ok(
        bBox.x + bBox.width > chart.chartWidth,
        'Label should be outside chart area (#7475)'
    );

    chart.update({
        xAxis: {
            labels: {
                overflow: 'justify'
            }
        }
    });
    assert.ok(
        bBox.x + bBox.width > chart.chartWidth,
        'Label should be inside chart area'
    );

});

QUnit.test('Label reserve space', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'X axis label alignment and reserveSpace'
        },
        xAxis: {
            categories: ['Oranges', 'Apples', 'Pears']
        },
        series: [{
            data: [1, 3, 2]
        }]
    });

    var xAxis = chart.xAxis[0],
        bBox;

    bBox = xAxis.ticks[0].label.element.getBBox();
    assert.ok(
        bBox.x > 0 && bBox.x + bBox.width < chart.plotLeft,
        'Default - Labels should be between chart border and plot area'
    );

    xAxis.update({
        labels: {
            align: 'left'
        }
    });
    bBox = xAxis.ticks[0].label.element.getBBox();
    assert.notOk(
        bBox.x > 0 && bBox.x + bBox.width < chart.plotLeft,
        'reserveSpace: null, align: left. - Labels should overlap plot area'
    );

    xAxis.update({
        labels: {
            reserveSpace: false
        }
    });
    bBox = xAxis.ticks[0].label.element.getBBox();
    assert.notOk(
        bBox.x > 0 && bBox.x + bBox.width < chart.plotLeft,
        'reserveSpace: false, align: left. - Labels should overlap plot area'
    );

    xAxis.update({
        labels: {
            reserveSpace: true
        }
    });
    bBox = xAxis.ticks[0].label.element.getBBox();
    assert.ok(
        bBox.x > 0 && bBox.x + bBox.width < chart.plotLeft,
        'reserveSpace: true, align: left. - Labels should not overlap plot area'
    );

    xAxis.update({
        labels: {
            align: 'center'
        }
    });
    bBox = xAxis.ticks[0].label.element.getBBox();
    assert.ok(
        bBox.x > 0 && bBox.x + bBox.width < chart.plotLeft,
        'reserveSpace: true, align: center. - Labels should not overlap plot area'
    );


    xAxis.update({
        opposite: true,
        labels: {
            reserveSpace: null,
            align: null
        }
    });
    bBox = xAxis.ticks[0].label.element.getBBox();
    assert.ok(
        bBox.x > chart.plotLeft + chart.plotWidth &&
            bBox.x + bBox.width < chart.chartWidth,
        'opposite: true - Labels should be between chart border and plot area'
    );

    xAxis.update({
        labels: {
            align: 'right'
        }
    });
    bBox = xAxis.ticks[0].label.element.getBBox();
    assert.notOk(
        bBox.x > chart.plotLeft + chart.plotWidth &&
            bBox.x + bBox.width < chart.chartWidth,
        'opposite: true, reserveSpace: null, align: right. - Labels should overlap plot area'
    );

    xAxis.update({
        labels: {
            reserveSpace: false
        }
    });
    bBox = xAxis.ticks[0].label.element.getBBox();
    assert.notOk(
        bBox.x > chart.plotLeft + chart.plotWidth &&
            bBox.x + bBox.width < chart.chartWidth,
        'opposite: true, reserveSpace: false, align: right. - Labels should overlap plot area'
    );

    xAxis.update({
        labels: {
            reserveSpace: true
        }
    });
    bBox = xAxis.ticks[0].label.element.getBBox();
    assert.ok(
        bBox.x > chart.plotLeft + chart.plotWidth &&
            bBox.x + bBox.width < chart.chartWidth,
        'opposite: true, reserveSpace: true, align: right. - Labels should not overlap plot area'
    );

    xAxis.update({
        labels: {
            align: 'center'
        }
    });
    bBox = xAxis.ticks[0].label.element.getBBox();
    assert.ok(
        bBox.x > chart.plotLeft + chart.plotWidth &&
            bBox.x + bBox.width < chart.chartWidth,
        'opposite: true, reserveSpace: true, align: center. - Labels should not overlap plot area'
    );


});

QUnit.test('Label ellipsis', function (assert) {

    var chart = Highcharts.chart('container', {

        chart: {
            width: 500
        },

        xAxis: {
            labels: {
                rotation: 0
            },
            categories: [
                'January &amp; Entities', 'January &lt;Not a tag&gt;',
                'January', 'January', 'January', 'January', 'January',
                'January', 'January', 'January', 'January', 'January'
            ]
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            type: 'column'
        }]

    });


    assert.strictEqual(
        Math.round(chart.xAxis[0].ticks[0].label.element.getBBox().width),
        Math.round(chart.xAxis[0].ticks[11].label.element.getBBox().width),
        'All labels should have ellipsis and equal length (#5968)'
    );


    assert.strictEqual(
        chart.xAxis[0].ticks[0].label.element.querySelector('title').textContent,
        'January & Entities',
        'HTML entities should be unescaped in title elements (#7179)'
    );
    assert.strictEqual(
        chart.xAxis[0].ticks[1].label.element.querySelector('title').textContent,
        'January <Not a tag>',
        'HTML entities should be unescaped in title elements (#7179)'
    );
});

QUnit.test('Correct float (#6085)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            height: 400
        },
        "title": {
            "text": null
        },
        "yAxis": [{

        }, {
            "opposite": true
        }],
        "series": [{
            "yAxis": 0,
            "data": [-2.4, 0.1]
        }, {
            "yAxis": 1,
            "data": [81, 84]
        }]
    });

    assert.ok(
        chart.yAxis[0].tickPositions.toString().length < 28,
        'No long floating points here'
    );
    assert.ok(
        chart.yAxis[1].tickPositions.toString().length < 28,
        'No long floating points here'
    );

});

QUnit.test('Width set from label style (#7028)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            renderTo: 'container',
            type: 'bar',
            marginLeft: 120
        },
        xAxis: {
            categories: [
                'Fernsehen, Radio', 'Zeitungen, Zeitschriften',
                'Internet', 'Infobroschüren und -stände der Parteien',
                'Besuch von Partei-veranstaltungen'
            ],
            labels: {
                style: {
                    width: '40px',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                }
            }
        },
        yAxis: {
            visible: false
        },
        legend: {
            enabled: false
        },
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0]
        }]

    });

    assert.ok(
        chart.xAxis[0].ticks[3].label.getBBox().width <= 40,
        'Label width set correctly'
    );

});

QUnit.test('Handle overflow in polar charts (#7248)', function (assert) {
    var chart = Highcharts.chart('container', {
        "chart": {
            "polar": true,
            "type": "line",
            "width": 800,
            "borderWidth": 1
        },
        "credits": {
            "enabled": false
        },
        "xAxis": {
            "categories": [
                "Leadership",
                "Riskmangement and the workproces",
                "Riskmangement and clients",
                "This is a very long text"
            ],
            "tickmarkPlacement": "on",
            "lineWidth": 0,
            "labels": {
                "enabled": true
            }
        },
        "yAxis": {
            "gridLineInterpolation": "polygon",
            "lineWidth": 0,
            "min": 0,
            "showLastLabel": true,
            "labels": {
                "y": 17,
                "enabled": true,
                "style": {
                    "color": "rgba(0, 0, 0, 0.3)"
                }
            },
            "max": 5,
            "tickInterval": 1
        },
        "plotOptions": {
            "series": {
                "animation": false,
                "dataLabels": {
                    "enabled": false
                }
            }
        },
        "tooltip": {
            "shared": true
        },
        "legend": {
            "enabled": false
        },
        "series": [{
            "name": " ",
            "data": [
                1.5,
                1,
                0,
                2.1
            ],
            "pointPlacement": "on"
        }]
    });

    function assertInside() {
        [0, 1, 2, 3].forEach(function (pos) {
            var bBox = chart.xAxis[0].ticks['1'].label.element.getBBox();
            assert.ok(
                bBox.x + bBox.width < chart.chartWidth,
                'Label ' + pos + ' inside right at ' + chart.chartWidth
            );
            assert.ok(
                bBox.x > 0,
                'Label ' + pos + ' inside left at ' + chart.chartWidth
            );
        });
    }

    assertInside();

    chart.setSize(600);
    assertInside();

});
