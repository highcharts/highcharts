
QUnit.test('Series.update', function (assert) {

    var chart = Highcharts.chart('container', {
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            showEmpty: false
        },
        yAxis: {
            showEmpty: false
        },
        series: [{
            allowPointSelect: true,
            data: [ // use names for display in pie data labels
                ['January', 29.9],
                ['February', 71.5],
                ['March', 106.4],
                ['April', 129.2],
                ['May', 144.0],
                ['June', 176.0],
                ['July', 135.6],
                ['August', 148.5],
                {
                    name: 'September',
                    y: 216.4,
                    selected: true,
                    sliced: true
                },
                ['October', 194.1],
                ['November', 95.6],
                ['December', 54.4]
            ],
            marker: {
                enabled: false
            },
            showInLegend: true
        }]
    });

    chart.name = false;

    var enableDataLabels = true,
        enableMarkers = true,
        color = false;

    // Text content
    assert.strictEqual(
        chart.series[0].legendItem.element.textContent,
        'Series 1',
        'Text content enitial'
    );
    chart.series[0].update({
        name: chart.name ? null : 'First'
    });
    chart.name = !chart.name;
    assert.strictEqual(
        chart.series[0].legendItem.element.textContent,
        'First',
        'Text content should change'
    );

    // Data labels
    assert.strictEqual(
        chart.series[0].points[0].dataLabel,
        undefined,
        'Data labels initial'
    );
    chart.series[0].update({
        dataLabels: {
            enabled: enableDataLabels
        }
    });
    enableDataLabels = !enableDataLabels;
    assert.strictEqual(
        chart.series[0].points[0].dataLabel.element.textContent.substr(0, 4),
        '29.9',
        'Data labels changed'
    );

    // Markers
    assert.strictEqual(
        chart.series[0].points[0].graphic,
        undefined,
        'Markers initial'
    );
    chart.series[0].update({
        marker: {
            enabled: enableMarkers
        }
    });
    enableMarkers = !enableMarkers;
    assert.strictEqual(
        chart.series[0].points[0].graphic.element.nodeName,
        'path',
        'Markers changed'
    );

    // Color
    assert.strictEqual(
        chart.series[0].graph.element.getAttribute('stroke'),
        Highcharts.getOptions().colors[0],
        'Color initial'
    );
    chart.series[0].update({
        color: color ? null : Highcharts.getOptions().colors[1]
    });
    color = !color;
    assert.strictEqual(
        chart.series[0].graph.element.getAttribute('stroke'),
        Highcharts.getOptions().colors[1],
        'Color changed - graph'
    );
    assert.strictEqual(
        chart.series[0].points[0].graphic.element.getAttribute('fill'),
        Highcharts.getOptions().colors[1],
        'Color changed - marker'
    );

    // Type column
    chart.series[0].update({
        type: 'column'
    });
    assert.strictEqual(
        chart.series[0].type,
        'column',
        'Column type'
    );
    assert.strictEqual(
        chart.series[0].points[0].graphic.element.nodeName,
        'rect',
        'Column point'
    );

    // Type line
    chart.series[0].update({
        type: 'line'
    });
    assert.strictEqual(
        chart.series[0].type,
        'line',
        'Line type'
    );
    assert.strictEqual(
        chart.series[0].points[0].graphic.symbolName,
        'circle',
        'Line point'
    );

    // Type spline
    chart.series[0].update({
        type: 'spline'
    });
    assert.strictEqual(
        chart.series[0].type,
        'spline',
        'Spline type'
    );
    assert.strictEqual(
        chart.series[0].graph.element.getAttribute('d').indexOf('C') !== -1, // has curved path
        true,
        'Curved path'
    );

    // Type area
    chart.series[0].update({
        type: 'area'
    });
    assert.strictEqual(
        chart.series[0].type,
        'area',
        'Area type'
    );
    assert.strictEqual(
        chart.series[0].area.element.nodeName,
        'path',
        'Has area'
    );

    // Type areaspline
    chart.series[0].update({
        type: 'areaspline'
    });
    assert.strictEqual(
        chart.series[0].type,
        'areaspline',
        'Areaspline type'
    );
    assert.strictEqual(
        chart.series[0].graph.element.getAttribute('d').indexOf('C') !== -1, // has curved path
        true,
        'Curved path'
    );
    assert.strictEqual(
        chart.series[0].area.element.nodeName,
        'path',
        'Has area'
    );

    // Type scatter
    chart.series[0].update({
        type: 'scatter'
    });
    assert.strictEqual(
        chart.series[0].type,
        'scatter',
        'Scatter type'
    );
    assert.strictEqual(
        typeof chart.series[0].graph,
        'undefined',
        'Has no graph'
    );

    // Type pie
    chart.series[0].update({
        type: 'pie'
    });
    assert.strictEqual(
        chart.series[0].type,
        'pie',
        'Pie type'
    );
    assert.strictEqual(
        typeof chart.series[0].graph,
        'undefined',
        'Has no graph'
    );
    assert.strictEqual(
        chart.series[0].points[0].graphic.element.getAttribute('d').indexOf('A') !== -1, // has arc
        true,
        'Arced path'
    );
    assert.strictEqual(
        chart.series[0].points[8].sliced,
        true,
        'Sliced slice'
    );

});

QUnit.test('Series.update and mouse interaction', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        plotOptions: {
            series: {
                point: {
                    events: {
                        mouseOver: function () {
                            this.update({
                                dataLabels: { enabled: true }, events: {
                                    mouseOut: function () {
                                        this.update({ dataLabels: { enabled: false } });
                                    }
                                }
                            });
                        },
                        mouseOut: function () {
                            this.update({ dataLabels: { enabled: false } });
                        }
                    }
                }
            }
        },
        series: [{
            data: [[0, 10], [1, 19], [2, 8], [3, 24], [4, 67]]
        }]
    });

    chart.series[0].points[0].onMouseOver();
    assert.strictEqual(
        chart.series[0].points[0].options.dataLabels &&
        chart.series[0].points[0].options.dataLabels.enabled,
        true,
        'Data labels should be enabled'
    );

    chart.series[0].onMouseOut();
    assert.notEqual(
        chart.series[0].points[0].options.dataLabels &&
        chart.series[0].points[0].options.dataLabels.enabled,
        true,
        'Data labels should not be enabled'
    );

});

QUnit.test('Series.update and setData', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            type: 'area'
        },
        plotOptions: {
            area: {
                stacking: true
            }
        },
        series: [{
            data: [1, 2, 3, 4, null, null]
        }, {
            data: [1, 2, 3, 4, null, null]
        }]
    });

    chart.series[0].points[0].kilroyWasHere = true;

    chart.series[0].update({
        data: [4, 3, 2, 1, null, null]
    });

    assert.strictEqual(
        chart.series[0].points[0].kilroyWasHere,
        true,
        'Original point item is preserved'
    );

    chart.series[0].setData([1, 2, 3, 4, 5, null], false);
    chart.series[1].setData([1, 2, 3, 4, 5, null], false);
    chart.redraw();

    assert.strictEqual(
        chart.series[0].graph.element.getAttribute('d').lastIndexOf('M'),
        0,
        'Graph is continuous (#7326)'
    );

});

QUnit.test('Series.update color index, class name should change', function (assert) {

    var chart = Highcharts.chart('container', {
        title: {
            text: 'Color index'
        },
        series: [{
            type: 'area',
            data: [1, 3, 2, 4]
        }]
    });

    var s = chart.series[0];

    assert.notEqual(
        s.group.element.getAttribute('class').indexOf('highcharts-color-0'),
        -1,
        'Correct class'
    );

    s.update({ colorIndex: 5 });

    assert.strictEqual(
        s.group.element.getAttribute('class').indexOf('highcharts-color-0'),
        -1,
        'Original color class gone'
    );

    assert.notEqual(
        s.group.element.getAttribute('class').indexOf('highcharts-color-5'),
        -1,
        'New color class added'
    );

});

QUnit.test('Series.update showInLegend dynamically', function (assert) {

    var s = Highcharts.chart('container', {
        series: [{
            showInLegend: false
        }]
    }).series[0];

    s.update({
        pointStart: 100
    });

    s.update({
        data: [1, 2, 3, 4],
        showInLegend: false
    });

    assert.deepEqual(
        s.points.map(function (p) {
            return p.x;
        }),
        [100, 101, 102, 103],
        'Points should start from 100 (#7933)'
    );

});

QUnit.test('Series.update types, new type lost after second update (#2322)', function (assert) {

    var data = [
        [0, 1, 2, 3, 4]
    ];

    var chart = Highcharts.chart('container', {
        series: [{
            type: 'candlestick',
            data: [
                [0, 4.11, 4.12, 4.50, 4.07]
            ]
        }]
    });

    assert.strictEqual(
        chart.series[0].pointArrayMap.toString(),
        'open,high,low,close',
        'OHLC point array map'
    );

    // Update type and data at the same time
    chart.series[0].update({
        data: data,
        type: 'line'
    }, true);

    assert.strictEqual(
        chart.series[0].pointArrayMap,
        undefined,
        'No point array map on base Series'
    );

    // Repeat: Update type and data at the same time
    chart.series[0].update({
        data: data,
        type: 'line'
    }, true);

    assert.strictEqual(
        chart.series[0].pointArrayMap,
        undefined,
        'No point array map on base Series'
    );

});

// Highcharts 4.1.10, Issue #4801:
// setting 'visible' by series.update has no effect
QUnit.test('Updating series.visible in series.update() should also update visibility. (#4801)', function (assert) {

    var chart = $("#container").highcharts({
        series: [{
            data: [29.9, 71.5, 106.4]
        }, {
            data: [144.0, 176.0, 135.6],
            visible: false
        }]
    }).highcharts();

    chart.series[1].update({
        visible: true
    });

    assert.ok(
        chart.series[1].group.attr("visibility") !== "hidden",
        'Series should be visible'
    );

});

QUnit.test('Series.update zIndex (#3380)', function (assert) {

    var chart = Highcharts.chart('container', {
        title: {
            text: null
        },
        plotOptions: {
            series: {
                lineWidth: 5
            }
        },
        series: [{
            type: 'column',
            data: [1, 2],
            color: 'blue',
            zIndex: 3
        }, {
            data: [2, 1],
            color: 'yellow',
            zIndex: 2
        }]
    });

    assert.ok(
        chart.seriesGroup.element.childNodes[0] === chart.series[1].group.element,
        'Yellow should be below initially'
    );
    assert.ok(
        chart.seriesGroup.element.childNodes[2] === chart.series[0].group.element,
        'Blue should be on top initially'
    );

    chart.series[0].update({
        zIndex: 1
    });

    assert.ok(
        chart.seriesGroup.element.childNodes[0] === chart.series[0].group.element,
        'Yellow should be on top after update'
    );
    assert.ok(
        chart.seriesGroup.element.childNodes[2] === chart.series[1].group.element,
        'Blue should be below after update'
    );

});

QUnit.test('Series.update without altering zIndex (#7397)', function (assert) {

    var chart = Highcharts.chart('container', {
        title: {
            text: null
        },
        plotOptions: {
            series: {
                lineWidth: 5
            }
        },
        series: [{
            type: 'column',
            data: [1, 2],
            color: 'blue'
        }, {
            data: [2, 1],
            color: 'yellow'
        }]
    });

    assert.ok(
        chart.seriesGroup.element.childNodes[0] === chart.series[0].group.element,
        'Yellow should be on top initially'
    );
    assert.ok(
        chart.seriesGroup.element.childNodes[2] === chart.series[1].group.element,
        'Blue should be below initially'
    );

    chart.series[0].update({
        type: 'spline'
    });

    assert.ok(
        chart.seriesGroup.element.childNodes[0] === chart.series[0].group.element,
        'Yellow should be on top after update'
    );
    assert.ok(
        chart.seriesGroup.element.childNodes[2] === chart.series[1].group.element,
        'Blue should be below after update'
    );

});
// Highcharts v4.0.1, Issue #3094
// Series.update changes the order of overlapping bars
QUnit.test('Z index changed after update (#3094)', function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'column'
        },
        title: {
            text: 'Z index changed after update'
        },
        plotOptions: {
            series: {
                groupPadding: 0.1,
                pointPadding: -0.4
            }
        },
        series: [ {
            data: [1300],
            color: 'rgba(13,35,58,0.9)',
            index: 0,
            zIndex: 10
        }, {
            data: [1500],
            color: 'rgba(47,126,216,0.9)',
            index: 1,
            zIndex: 10
        }]
    });
    var controller = new TestController(chart),
        container = chart.container,
        clientWidth = container.clientWidth,
        clientHeight = container.clientHeight;

    controller.setPosition(
        (clientWidth / 2),
        (clientHeight / 2));

    var columnYValue = controller.getPosition().relatedTarget.point.y;
    assert.strictEqual(
        columnYValue,
        1500,
        "Second series should be on top of first series"
    );
    chart.series[0].update({
        dataLabels: {
            enabled: true
        }
    });
    assert.strictEqual(
        columnYValue,
        1500,
        "Second series should be on top of first series"
    );
    assert.strictEqual(
        chart.series[0].dataLabelsGroup.visibility,
        "visible",
        "Data label should be visible"
    );
});