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
