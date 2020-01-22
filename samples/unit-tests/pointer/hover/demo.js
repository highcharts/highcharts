QUnit.test("Tooltip isn't displayed when on column, when yAxis.max is lower than column's value. (#4511)", function (assert) {
    var chart = $('#container').highcharts({
        chart: {
            type: "column"
        },
        yAxis: {
            max: 5
        },
        tooltip: {
            shared: true
        },
        series: [{
            data: [29.9, 71.5, 106.4]
        }]
    }).highcharts();


    chart.pointer.onContainerMouseMove({
        pageX: 150,
        pageY: 310,
        target: chart.series[0].group.element
    });

    assert.strictEqual(
        chart.tooltip.isHidden,
        false,
        'Tooltip displayed properly'
    );

});

QUnit.test('JS error on hovering after destroy chart (#4998)', function (assert) {
    var chart,
        options = {

            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },

            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
                type: 'column'
            }]

        };

    chart = Highcharts.chart('container', options);

    chart.pointer.onContainerMouseMove({
        pageX: 200,
        pageY: 200,
        type: 'mousemove'
    });
    assert.ok(
        true,
        'No error yet'
    );

    // Create a new chart
    chart = Highcharts.chart('container', options);

    chart.pointer.onContainerMouseMove({
        pageX: 200,
        pageY: 200,
        type: 'mousemove'
    });
    assert.ok(
        true,
        'No error'
    );
});

QUnit.test('Testing hovering over panes.', function (assert) {
    var chart = Highcharts.chart('container', {

            chart: {
                polar: true,
                plotBackgroundColor: '#f2f2f2'
            },

            pane: [{
                center: ['25%', '50%']
            }, {
                center: ['75%', '50%']
            }],

            series: [{
                data: [140, 130, 53, 54, 50]
            }, {
                data: [120, 32, 64, 142],
                yAxis: 1,
                xAxis: 1
            }],

            xAxis: [{
                pane: 0
            }, {
                pane: 1
            }],

            yAxis: [{
                max: 100,
                pane: 0
            }, {
                max: 100,
                pane: 1
            }]

        }),
        controller = new TestController(chart),
        x = 260,
        y = 180;

    controller.moveTo(x, y);

    assert.strictEqual(
        chart.hoverPoint,
        chart.series[0].points[2],
        'The other pane\'s point should be ignored' // #11148
    );

    chart.tooltip.hide(0);

    x = 300;
    y = 180;
    controller.setPosition(x - 1, y - 1);
    controller.moveTo(x, y);

    assert.ok(
        chart.tooltip.isHidden,
        'Tooltip should not be displayed' // #11148
    );

    x = 340;
    y = 180;
    controller.setPosition(x - 1, y - 1);
    controller.moveTo(x, y);

    assert.ok(
        chart.tooltip.isHidden,
        'Tooltip should not be displayed (point is out of pane)' // #11148
    );
});
