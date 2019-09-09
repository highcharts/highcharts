QUnit.test('Show-hide linked series (#3709)', function (assert) {


    $('#container').highcharts({
        series: [{
            id: 'tokyo',
            name: 'Tokyo',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        }, {
            name: 'Tokyo Bis',
            data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5],
            linkedTo: 'tokyo',
            visible: false
        },
        {
            id: 'berlin',
            name: 'Berlin',
            data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
        }, {
            name: 'Berlin Bis',
            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8],
            linkedTo: 'berlin',
            visible: false
        }]
    });
    var chart = $('#container').highcharts();

    function hide() {
        chart.series[1].setVisible(false, false);
        chart.series[1].setData([-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5], false);
        chart.series[3].setVisible(false, false);
        chart.series[3].setData([3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8], false);
        chart.redraw();
    }
    function show() {
        chart.series[1].setVisible(true, false);
        chart.series[1].setData([-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5], false);
        chart.series[3].setVisible(true, false);
        chart.series[3].setData([3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8], false);
        chart.redraw();
    }

    // This sequence caused crash
    show();
    hide();
    show();

    assert.strictEqual(
        chart.series[1].graph.element.nodeName,
        'path',
        'Series has a path'
    );

});
QUnit.test('Updating master series, cause linked series to hide, with visible graph (#5618)', function (assert) {

    var chart = $('#container').highcharts({
            series: []
        }).highcharts(),
        offset;


    chart.addSeries({
        visible: false,
        id: 'main',
        data: [1, 101]
    }, false);

    chart.addSeries({
        visible: false,
        linkedTo: 'main',
        data: [100, 10]
    });

    chart.series[0].show();

    chart.series[0].update({
        dataLabels: {
            enabled: true
        }
    });

    offset = $(chart.container).offset();

    chart.pointer.onContainerMouseMove({
        type: 'mousemove',
        pageX: offset.left + 110,
        pageY: offset.top + 100,
        target: chart.container
    });

    assert.strictEqual(
        chart.hoverPoint.y,
        chart.series[1].points[0].y,
        'Correct point hovered'
    );
});

QUnit.test("Series should inherit visibility from parent when is linked.(#3879)", function (assert) {

    var chart = $('#container').highcharts({
        series: [{
            data: [1, 2, 3],
            id: 'a',
            visible: false
        }, {
            data: [0, 1, 0],
            type: 'column',
            linkedTo: 'a'
        }]
    }).highcharts();

    assert.strictEqual(
        chart.series[0].visible,
        chart.series[1].visible,
        'Linked series is hidden'
    );
});
QUnit.test('Mutually linked (#3341)', function (assert) {

    // #3341 caused exceeded stack size
    assert.expect(0);
    var chart = Highcharts.chart('container', {

        series: [{
            data: [1, 3, 2, 4],
            type: 'column',
            id: 'A',
            linkedTo: 'B'
        }, {
            data: [1, 4, 3, 5],
            type: 'line',
            id: 'B',
            linkedTo: 'A'
        }]

    });

    chart.get('A').hide();
});

// Highcharts 4.0.1, Issue #3028
// linkedTo after series.update() fails
QUnit.test('Linked series update (#3028)', function (assert) {

    TestTemplate.test('highcharts/line', {

        series: [{
            data: [0.6820803502018753, 0.05533494462052113],
            id: "a"
        }, {
            data: [0.07601782967260373, 0.1726532410217495],
            id: "b"
        }, {
            data: [0.9013182093899192, 0.3390551892767565],
            id: "c"
        }, {
            data: [0.551932400756212, 0.009206774065841805],
            linkedTo: "a"
        }, {
            data: [0.7640630116461821, 0.0380141771800222],
            linkedTo: "b"
        }, {
            data: [0.18496775541137755, 0.04887790962917371],
            linkedTo: "c"
        }, {
            data: [0.8241777419092826, 0.4921648208451488],
            linkedTo: "a"
        }, {
            data: [0.6752480091977303, 0.575652597336077],
            linkedTo: "b"
        }, {
            data: [0.7703115567784166, 0.18277585315778122],
            linkedTo: "c"
        }]

    }, function (template) {

        var chart = template.chart,
            series = chart.series,
            i, ie;

        for (i = 0, ie = series.length; i < ie; ++i) {
            series[i].update({
                dataLabels: {
                    enabled: true
                }
            });
        }

        series[0].hide();
        series[1].hide();
        series[2].hide();

        for (i = 0, ie = series.length; i < ie; ++i) {
            assert.ok(
                !series[i].visible,
                'Series should not be visible.'
            );
        }

    });

});
