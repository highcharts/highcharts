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



QUnit.test('Long labels and ellipsis', function (assert) {

    var chart = Highcharts.chart('container', {
        "yAxis": {
            "title": {
                "text": null
            }
        },
        "title": {
            "text": "Between 10 and 100 times"
        },
        "chart": {
            "type": "bar",
            "height": 400,
            "width": 400
        },
        "credits": {
            "enabled": false
        },
        "plotOptions": {
            "bar": {
                "dataLabels": {
                    "enabled": true
                }
            }
        },
        "series": [{
            "data": [{
                "y": 99,
                "x": 0,
                "color": "#B6B6F2"
            }, {
                "y": 99,
                "x": 1,
                "color": "#AFE4FD"
            }, {
                "y": 98,
                "x": 2,
                "color": "#B6B6F2"
            }, {
                "y": 95,
                "x": 3,
                "color": "#DBDBDB"
            }, {
                "y": 95,
                "x": 4,
                "color": "#B6B6F2"
            }, {
                "y": 95,
                "x": 5,
                "color": "#AFE4FD"
            }, {
                "y": 92,
                "x": 6,
                "color": "#B6B6F2"
            }, {
                "y": 91,
                "x": 7,
                "color": "#AFE4FD"
            }, {
                "y": 91,
                "x": 8,
                "color": "#DBDBDB"
            }, {
                "y": 90,
                "x": 9,
                "color": "#DBDBDB"
            }, {
                "y": 89,
                "x": 10,
                "color": "#AFE4FD"
            }, {
                "y": 88,
                "x": 11,
                "color": "#AFE4FD"
            }, {
                "y": 88,
                "x": 12,
                "color": "#DBDBDB"
            }, {
                "y": 87,
                "x": 13,
                "color": "#B6B6F2"
            }, {
                "y": 87,
                "x": 14,
                "color": "#AFE4FD"
            }, {
                "y": 85,
                "x": 15,
                "color": "#AFE4FD"
            }, {
                "y": 83,
                "x": 16,
                "color": "#AFE4FD"
            }, {
                "y": 82,
                "x": 17,
                "color": "#DBDBDB"
            }, {
                "y": 82,
                "x": 18,
                "color": "#B6B6F2"
            }, {
                "y": 82,
                "x": 19,
                "color": "#AFE4FD"
            }, {
                "y": 82,
                "x": 20,
                "color": "#AFE4FD"
            }, {
                "y": 80,
                "x": 21,
                "color": "#AFE4FD"
            }, {
                "y": 79,
                "x": 22,
                "color": "#DBDBDB"
            }, {
                "y": 79,
                "x": 23,
                "color": "#AFE4FD"
            }, {
                "y": 78,
                "x": 24,
                "color": "#B6B6F2"
            }, {
                "y": 78,
                "x": 25,
                "color": "#AFE4FD"
            }, {
                "y": 75,
                "x": 26,
                "color": "#DBDBDB"
            }, {
                "y": 75,
                "x": 27,
                "color": "#DBDBDB"
            }, {
                "y": 75,
                "x": 28,
                "color": "#DBDBDB"
            }, {
                "y": 75,
                "x": 29,
                "color": "#DBDBDB"
            }, {
                "y": 75,
                "x": 30,
                "color": "#DBDBDB"
            }, {
                "y": 75,
                "x": 31,
                "color": "#DBDBDB"
            }, {
                "y": 73,
                "x": 32,
                "color": "#B6B6F2"
            }, {
                "y": 71,
                "x": 33,
                "color": "#AFE4FD"
            }, {
                "y": 70,
                "x": 34,
                "color": "#FFB31A"
            }],
            "name": "Requests"
        }],
        "xAxis": {
            "categories": ["cgi-bin/php?%2D%64+%61%6C%6C%6F%77%5F%75%72%6C%5F%69%6E%63%6C%75%64%65%3D%6F%6E+%2D%64+%73%61%66%65%5F%6D%6F%64%65%3D%6F%66%66+%2D%64+%73%75%68%6F%73%69%6E%2E%73%69%6D%75%6C%61%74%69%6F%6E%3D%6F%6E+%2D%64+%64%69%73%61%62%6C%65%5F%66%75%6E%63%74%69%6F%6E%73%3D%22%22+%2D%64+%6F%70%65%6E%5F%62%61%73%65%64%69%72%3D%6E%6F%6E%65+%2D%64+%61%75%74%6F%5F%70%72%65%70%65%6E%64%5F%66%69%6C%65%3D%70%68%70%3A%2F%2F%69%6E%70%75%74+%2D%64+%63%67%69%2E%66%6F%72%63%65%5F%72%65%64%69%72%65%63%74%3D%30+%2D%64+%63%67%69%2E%72%65%64%69%72%65%63%74%5F%73%74%61%74%75%73%5F%65%6E%76%3D%30+%2D%6E", "phpadmin/scripts/setup.php", "w00tw00t.at.blackhats.romanian.anti-sec:)", "cgi-bin/env.cgi", "cgi-bin/forum.cgi", "cgi-bin/login.cgi", "cgi-bin/sat-ir-web.pl", "cgi-bin/test-cgi.pl", "cgi-sys/php5", "SQLiteManager-1.2.4/main.php", "sqlitemanager/main.php", "SQlite/main.php", "SQLiteManager/main.php", "cgi-bin/php5?%2D%64+%61%6C%6C%6F%77%5F%75%72%6C%5F%69%6E%63%6C%75%64%65%3D%6F%6E+%2D%64+%73%61%66%65%5F%6D%6F%64%65%3D%6F%66%66+%2D%64+%73%75%68%6F%73%69%6E%2E%73%69%6D%75%6C%61%74%69%6F%6E%3D%6F%6E+%2D%64+%64%69%73%61%62%6C%65%5F%66%75%6E%63%74%69%6F%6E%73%3D%22%22+%2D%64+%6F%70%65%6E%5F%62%61%73%65%64%69%72%3D%6E%6F%6E%65+%2D%64+%61%75%74%6F%5F%70%72%65%70%65%6E%64%5F%66%69%6C%65%3D%70%68%70%3A%2F%2F%69%6E%70%75%74+%2D%64+%63%67%69%2E%66%6F%72%63%65%5F%72%65%64%69%72%65%63%74%3D%30+%2D%64+%63%67%69%2E%72%65%64%69%72%65%63%74%5F%73%74%61%74%75%73%5F%65%6E%76%3D%30+%2D%6E", "cgi-bin/bash", "cgi-bin/contact.cgi", "cgi-bin/defaultwebpage.cgi", "cgi-bin/hello.cgi", "cgi-bin/index.cgi", "cgi-bin/recent.cgi", "cgi-bin/tools/tools.pl", "cgi-bin/php-cgi?%2D%64+%61%6C%6C%6F%77%5F%75%72%6C%5F%69%6E%63%6C%75%64%65%3D%6F%6E+%2D%64+%73%61%66%65%5F%6D%6F%64%65%3D%6F%66%66+%2D%64+%73%75%68%6F%73%69%6E%2E%73%69%6D%75%6C%61%74%69%6F%6E%3D%6F%6E+%2D%64+%64%69%73%61%62%6C%65%5F%66%75%6E%63%74%69%6F%6E%73%3D%22%22+%2D%64+%6F%70%65%6E%5F%62%61%73%65%64%69%72%3D%6E%6F%6E%65+%2D%64+%61%75%74%6F%5F%70%72%65%70%65%6E%64%5F%66%69%6C%65%3D%70%68%70%3A%2F%2F%69%6E%70%75%74+%2D%64+%63%67%69%2E%66%6F%72%63%65%5F%72%65%64%69%72%65%63%74%3D%30+%2D%64+%63%67%69%2E%72%65%64%69%72%65%63%74%5F%73%74%61%74%75%73%5F%65%6E%76%3D%30+%2D%6E", "cgi-bin/php.cgi?%2D%64+%61%6C%6C%6F%77%5F%75%72%6C%5F%69%6E%63%6C%75%64%65%3D%6F%6E+%2D%64+%73%61%66%65%5F%6D%6F%64%65%3D%6F%66%66+%2D%64+%73%75%68%6F%73%69%6E%2E%73%69%6D%75%6C%61%74%69%6F%6E%3D%6F%6E+%2D%64+%64%69%73%61%62%6C%65%5F%66%75%6E%63%74%69%6F%6E%73%3D%22%22+%2D%64+%6F%70%65%6E%5F%62%61%73%65%64%69%72%3D%6E%6F%6E%65+%2D%64+%61%75%74%6F%5F%70%72%65%70%65%6E%64%5F%66%69%6C%65%3D%70%68%70%3A%2F%2F%69%6E%70%75%74+%2D%64+%63%67%69%2E%66%6F%72%63%65%5F%72%65%64%69%72%65%63%74%3D%30+%2D%64+%63%67%69%2E%72%65%64%69%72%65%63%74%5F%73%74%61%74%75%73%5F%65%6E%76%3D%30+%2D%6E", "cgi-bin/php4?%2D%64+%61%6C%6C%6F%77%5F%75%72%6C%5F%69%6E%63%6C%75%64%65%3D%6F%6E+%2D%64+%73%61%66%65%5F%6D%6F%64%65%3D%6F%66%66+%2D%64+%73%75%68%6F%73%69%6E%2E%73%69%6D%75%6C%61%74%69%6F%6E%3D%6F%6E+%2D%64+%64%69%73%61%62%6C%65%5F%66%75%6E%63%74%69%6F%6E%73%3D%22%22+%2D%64+%6F%70%65%6E%5F%62%61%73%65%64%69%72%3D%6E%6F%6E%65+%2D%64+%61%75%74%6F%5F%70%72%65%70%65%6E%64%5F%66%69%6C%65%3D%70%68%70%3A%2F%2F%69%6E%70%75%74+%2D%64+%63%67%69%2E%66%6F%72%63%65%5F%72%65%64%69%72%65%63%74%3D%30+%2D%64+%63%67%69%2E%72%65%64%69%72%65%63%74%5F%73%74%61%74%75%73%5F%65%6E%76%3D%30+%2D%6E", "scripts/setup.php"],
            "title": {
                "text": null
            }
        },
        "legend": {
            "enabled": false
        }
    });

    assert.ok(
        chart.plotLeft < 200,
        'Long categories should not take over the chart'
    );
});

QUnit.test('Label ellipsis and expanding', function (assert) {

    var chart = new Highcharts.chart('container', {
        chart: {
            width: 320
        },
        xAxis: {
            labels: {
                autoRotation: false,
                padding: 10
            },
            categories: ['Fuel', 'Insurance', 'Maintenance', 'Ground', 'Data']
        },
        series: [{
            type: 'column',
            data: [5, 12, 15, 19, 21]
        }]
    });

    assert.notEqual(
        chart.xAxis[0].ticks[1].label.element.textContent.indexOf('…'),
        -1,
        'The second label should contain an ellipsis'
    );

    chart.setSize(620);
    assert.strictEqual(
        chart.xAxis[0].ticks[1].label.element.textContent.indexOf('…'),
        -1,
        'The third label should not contain an ellipsis (#8210)'
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
        Math.floor(chart.xAxis[0].ticks[3].label.getBBox().width) <= 40,
        'Label width set correctly'
    );

});

QUnit.test('Explicit textOverflow setting', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 250
        },
        xAxis: {
            categories: ['Very long month name', 'Feb', 'Mar'],
            labels: {
                style: {
                    textOverflow: 'ellipsis'
                }
            }
        },
        yAxis: {
            visible: false
        },
        series: [{
            data: [250.0, 71.5, 106.4],
            type: 'bar',
            colorByPoint: true,
            showInLegend: false
        }]

    });

    assert.ok(
        chart.xAxis[0].ticks[0].label.getBBox().height <= 25,
        'Label has correct ellipsis (#7968)'
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

// Highcharts 4.1.3, Issue #3891:
// Axis labels rotation does not work properly
QUnit.test('Labels text height (#3891)', function (assert) {

    $('#container').highcharts({
        xAxis: {
            labels: {
                rotation: 270
            },
            categories: ['January', 'February', 'March']
        },

        series: [{
            data: [1, 3, 2]
        }]
    });

    assert.equal(
        $('#container').highcharts().xAxis[0].ticks[0].label.rotation,
        270,
        'Rotation set to 270'
    );

});

// Highcharts 3.0.10, Issue #2806
// Unable to see all labels on the bar charts
QUnit.test('Column pointrange (#2806)', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Category axis was wrong when the second series had greater point distance than the first series'
        },
        xAxis: {
            categories: ['Cat0', 'Cat1', 'Cat2', 'Cat3']
        },
        plotOptions: {
            column: {
                stacking: true
            }
        },
        series: [{
            name: "CL1",
            data: [{
                x: 0,
                y: 1
            }, {
                x: 1,
                y: 2
            }, {
                x: 2,
                y: 2
            }, {
                x: 3,
                y: 2
            }]
        }, {
            name: "CL2",
            data: [{
                x: 0,
                y: 3
            }, {
                x: 2,
                y: 4
            }]
        }]
    });

    assert.strictEqual(
        chart.xAxis[0].labelGroup.element.childNodes.length,
        4,
        'There should be 4 labels on the xAxis.'
    );

});
