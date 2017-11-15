QUnit.test('Label ellipsis in Firefox (#5968)', function (assert) {

    var chart = Highcharts.chart('container', {

        chart: {
            width: 500
        },

        xAxis: {
            labels: {
                rotation: 0
            },
            categories: ['January', 'January', 'January', 'January', 'January', 'January',
                'January', 'January', 'January', 'January', 'January', 'January'
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
        'All labels should have ellipsis and equal length'
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
        chart.xAxis[0].ticks[3].label.getBBox().width <= 30, //40 - padding
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
