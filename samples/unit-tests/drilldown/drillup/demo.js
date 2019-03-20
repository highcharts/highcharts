// Highcharts 4.1.10, Issue #4667: Column Satcked chart - Bar's color opacity not comes to 1 after drillup
QUnit.test('Drilling up left one column semi-opaque (#4667)', function (assert) {

    var drilldownCfg = [
        {
            name: 'Oranges',
            color: '#009900',
            data: [{ name: '1', y: 5 }, { name: '2', y: 2 }, { name: '3', y: 4 }]
        }, {
            name: 'Apples',
            color: '#FE9900',
            data: [{ name: '1', y: 1 }, { name: '2', y: 5 }, { name: '3', y: 2 }]
        }, {
            name: 'Bananas',
            color: '#FE0000',
            data: [{ name: '1', y: 1 }, { name: '2', y: 5 }, { name: '3', y: 2 }]
        }
    ];

    var series = [
        {
            name: 'Oranges',
            color: '#009900',
            data: [{ name: '2014', y: 5, drilldown: 'to' }, { name: '2015', y: 2, drilldown: 'to' }, { name: '2016', y: 4, drilldown: 'to' }]
        }, {
            name: 'Apples',
            color: '#FE9900',
            data: [{ name: '2014', y: 1, drilldown: 'to' }, { name: '2015', y: 5, drilldown: 'to' }, { name: '2016', y: 2, drilldown: 'to' }]
        }
    ];

    var chartConfig = {
        chart: {
            height: 300,
            type: 'column',
            renderTo: 'container',
            events: {
                drilldown: function (event) {
                    // do not drilldown for categories
                    if (typeof event.category === 'number') {
                        return;
                    }

                    drilldownCfg.forEach(function (item) {
                        this.addSingleSeriesAsDrilldown(event.point, item);
                    }, this);

                    this.applyDrilldown();
                }
            }
        },
        drilldown: {
            animation: {
                duration: 500
            },
            series: []
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            title: false
        },
        title: false,
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                animation: false,
                borderWidth: 0,
                dataLabels: {
                    enabled: false
                },
                stacking: 'normal'
            }
        },
        series: series
    };

    var clock = TestUtilities.lolexInstall();

    try {

        var chart = new Highcharts.Chart(chartConfig),
            done = assert.async();

        setTimeout(function () {
            assert.strictEqual(
                chart.series[0].points[0].graphic.attr('opacity'),
                1,
                'First point should be fully opaque'
            );
            done();
        }, 800);

        // Drill down and up in quick succession sparked the bug
        chart.series[0].points[1].doDrilldown();
        chart.drillUp();

        TestUtilities.lolexRunAndUninstall(clock);

    } finally {

        TestUtilities.lolexUninstall(clock);

    }
});

// Highcharts 4.0.4, Issue #3544
// Drillup does not work when data are set dynamically
QUnit.test('Drill up failed on top level (#3544)', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            renderTo: 'container',
            animation: false
        },
        xAxis: {
            type: 'category'
        },

        drilldown: {
            animation: false,
            series: [{
                id: 'fruits',
                name: 'Fruits',
                data: [
                    ['Apples', 4],
                    ['Pears', 6]
                ]
            }]
        },

        series: [{
            name: 'Overview',
            colorByPoint: true,
            id: 'top'
        }]
    });
    chart.series[0].setData([{
        name: 'Fruits',
        y: 10,
        drilldown: 'fruits'
    }]);


    var controller = new TestController(chart);

    var columnCenterX = (chart.plotSizeX + chart.plotLeft) / 2,
        columnCenterY = (chart.plotSizeY + chart.plotTop) / 2;

    controller.moveTo(columnCenterX, columnCenterY);

    assert.ok(
        controller.getPosition().relatedTarget,
        "Drilldown column is not visible"
    );


    controller.click();

    assert.deepEqual(
        chart.xAxis[0].names,
        ['Apples', 'Pears'],
        "Drilldown failed"
    );
    controller.moveTo(columnCenterX, columnCenterY);

    var drillUpButton = chart.drillUpButton,
        drillUpButtonX = drillUpButton.x - (drillUpButton.getBBox().width / 2),
        drillUpButtonY = drillUpButton.y + (drillUpButton.getBBox().height / 2);

    assert.notEqual(
        drillUpButton,
        undefined,
        "Drill up button is undefined"
    );

    controller.moveTo(drillUpButtonX, drillUpButtonY);
    controller.click();
    controller.moveTo(columnCenterX, columnCenterY);

    assert.deepEqual(
        chart.xAxis[0].names,
        ['Fruits'],
        "Categories is not visible after drillUp"
    );

    assert.notEqual(
        controller.getPosition().relatedTarget,
        undefined,
        "Column element is undefined after drillUp"
    );
});

// Highcharts 4.0.4, Issue #3579
// Levels get mixed by use of multi-level drilldown
QUnit.test('Multi-level drilldown gets mixed  (#3579)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            animation: false
        },
        title: {
            text: 'Multilevel drilldown. Levels got mixed up.'
        },
        xAxis: {
            type: 'category'
        },

        legend: {
            enabled: true
        },

        plotOptions: {
            series: {
                animation: false,
                borderWidth: 0,
                colorByPoint: true,
                dataLabels: {
                    enabled: true
                }
            }
        },

        series: [{
            name: 'Things',
            data: [{
                name: 'Animals',
                y: 5,
                drilldown: 'animals'
            }]
        }, {
            name: 'Things2',
            data: [{
                name: 'Animals',
                y: 1,
                drilldown: 'animals2'
            }]
        }],
        drilldown: {
            animation: false,
            series: [{
                id: 'animals',
                name: 'Animals',
                data: [{
                    name: 'Cats',
                    y: 4,
                    drilldown: 'specialcat'
                }

                ]
            }, {
                id: 'animals2',
                name: 'Animals2',
                data: [{
                    name: 'Cats',
                    y: 3,
                    drilldown: 'specialcat2'
                }]
            }, {
                id: 'specialcat',
                name: 'Cats2',
                data: [
                    ['Siamese', 5],
                    ['Tabby', 10]
                ]
            }, {
                id: 'specialcat2',
                name: 'Cats2-2',
                data: [
                    ['Siamese2', 5],
                    ['Tabby2', 10]
                ]
            }]
        }
    });

    var controller = new TestController(chart),
        tickLabel = chart.xAxis[0].ticks[0].label,
        tickCoordinates = tickLabel.xy;

    controller.moveTo(tickCoordinates.x, tickCoordinates.y);
    controller.click();
    var leftColumn  = chart.series[0].data[0].shapeArgs,
        leftColumnX = leftColumn.x + (leftColumn.width / 2),
        leftColumnY = leftColumn.y + (leftColumn.height / 2);
    controller.moveTo(leftColumnX + chart.plotLeft, leftColumnY + chart.plotTop);
    controller.click();

    var drillUpButton = chart.drillUpButton,
        drillUpButtonX = drillUpButton.x - (drillUpButton.getBBox().width / 2),
        drillUpButtonY = drillUpButton.y + (drillUpButton.getBBox().height / 2);

    assert.notEqual(
        drillUpButton,
        undefined,
        "Drill up button is undefined"
    );

    controller.moveTo(drillUpButtonX, drillUpButtonY);
    controller.click();

    var rightColumn  = chart.series[0].data[0].shapeArgs,
        rightColumnX = rightColumn.x + (rightColumn.width / 2),
        rightColumnY = rightColumn.y + (rightColumn.height / 2);

    controller.moveTo(rightColumnX + chart.plotLeft, rightColumnY + chart.plotTop);
    controller.click();

    assert.ok(
        chart.series.length  === 1,
        "The series got mixed up"
    );
    assert.ok(
        chart.legend.allItems.length  === 1,
        "The legend is not showing right information"
    );
});