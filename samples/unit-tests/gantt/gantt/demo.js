(function () {
    var defaultChartConfig,
        getSpacing = function (chart, tick1, tick2) {
            var yAxis = chart.yAxis[0],
                ticks = yAxis.ticks,
                tick1Space = ticks[Highcharts.pick(tick1, '-1')].mark.getBBox()
                    .y,
                tick2Space = ticks[Highcharts.pick(tick2, '0')].mark.getBBox()
                    .y;

            return tick2Space - tick1Space;
        },
        getToday = function () {
            var today = new Date();
            // Set to 00:00:00:000 today
            today.setUTCHours(0);
            today.setUTCMinutes(0);
            today.setUTCSeconds(0);
            today.setUTCMilliseconds(0);
            return today.getTime();
        },
        click = function (element) {
            var evObj = document.createEvent('Events');
            evObj.initEvent('click', true, false);
            element.dispatchEvent(evObj);
        };

    QUnit.testStart(function () {
        defaultChartConfig = {
            title: {
                text: 'Projects'
            },
            series: [
                {
                    name: 'Project 1',
                    borderRadius: 10,
                    data: [
                        {
                            id: 'start_prototype',
                            start: Date.UTC(2014, 10, 18),
                            end: Date.UTC(2014, 10, 25),
                            taskGroup: 'Start prototype',
                            name: 'Start prototype',
                            y: 0,
                            partialFill: 0.25
                        },
                        {
                            id: 'prototype_done',
                            start: Date.UTC(2014, 10, 25, 12),
                            milestone: true,
                            name: 'Prototype done',
                            taskGroup: 'Prototype done',
                            y: 1
                        },
                        {
                            id: 'test_prototype',
                            start: Date.UTC(2014, 10, 27),
                            end: Date.UTC(2014, 10, 28),
                            name: 'Test prototype',
                            taskGroup: 'Test prototype',
                            y: 2
                        },
                        {
                            id: 'development',
                            start: Date.UTC(2014, 10, 20),
                            end: Date.UTC(2014, 10, 25),
                            taskGroup: 'Develop',
                            name: 'Develop',
                            y: 3,
                            partialFill: 0.12
                        },
                        {
                            id: 'unit_tests',
                            start: Date.UTC(2014, 10, 20),
                            end: Date.UTC(2014, 10, 22),
                            y: 4,
                            parent: 'development',
                            taskGroup: 'Create unit tests',
                            name: 'Create unit tests',
                            partialFill: {
                                amount: 0.5,
                                fill: '#fa0'
                            }
                        },
                        {
                            id: 'implement',
                            start: Date.UTC(2014, 10, 22),
                            end: Date.UTC(2014, 10, 25),
                            y: 5,
                            taskGroup: 'Implement',
                            parent: 'development',
                            name: 'Implement'
                        },
                        {
                            id: 'acceptance_tests',
                            start: Date.UTC(2014, 10, 23),
                            end: Date.UTC(2014, 10, 26),
                            name: 'Run acceptance tests',
                            taskGroup: 'Run acceptance tests',
                            y: 6
                        }
                    ]
                }
            ]
        };
    });

    /**
     * Checks that milestones are drawn differently than tasks
     */
    QUnit.test('Milestones', function (assert) {
        var chart = Highcharts.ganttChart('container', defaultChartConfig),
            points = chart.series[0].points,
            taskPoint = points[0],
            milestonePoint = points[1],
            milestone = milestonePoint.graphic,
            path,
            isDiamond,
            topX,
            topY,
            rightX,
            rightY,
            bottomX,
            bottomY,
            leftX,
            leftY,
            height,
            width,
            floatError = 0.00001;

        assert.equal(
            taskPoint.milestone,
            undefined,
            'Point with no miliestone:true is not a milestone'
        );

        assert.equal(
            milestonePoint.milestone,
            true,
            'Point with milestone:true is a milestone'
        );

        assert.equal(
            typeof milestone.d,
            'string', 'Milestone has a \'d\' value'
        );

        // Remove path letters
        path = milestone.d.replace(/[a-zA-Z]/g, '');
        // Replace sequences of space characters with single spaces
        path = path.replace(/\s+/g, ' ');
        // Remove surrounding spaces
        path = path.trim();
        // Split on spaces to create an array
        path = path.split(' ');

        topX = parseFloat(path[0]);
        topY = parseFloat(path[1]);
        rightX = parseFloat(path[2]);
        rightY = parseFloat(path[3]);
        bottomX = parseFloat(path[4]);
        bottomY = parseFloat(path[5]);
        leftX = parseFloat(path[6]);
        leftY = parseFloat(path[7]);

        height = bottomY - topY;
        width = rightX - leftX;

        // The path is a diamond if:
        // 1. The top and bottom x values are aligned
        // 2. The left and right y values are aligned
        // 3. The width and height are the same
        // 4. The path has only 4 vectors
        isDiamond =
            topX === bottomX &&
            leftY === rightY &&
            Math.abs(width - height) < floatError;

        assert.ok(isDiamond, 'Milestone path is a diamond');
    });

    QUnit.test('Axis breaks and staticScale', function (assert) {
        var today = getToday(),
            day = 1000 * 60 * 60 * 24,
            spaceExpanded,
            spaceCollapsed,
            axisLineLength,
            axisLine,
            tick,
            chart,
            chartConfig = {
                xAxis: {
                    min: today - 3 * day,
                    max: today + 18 * day
                },

                series: [
                    {
                        name: 'Offices',
                        data: [
                            {
                                name: 'New offices',
                                id: 'new_offices',
                                start: today - 2 * day,
                                end: today + 14 * day
                            },
                            {
                                name: 'Prepare office building',
                                id: 'prepare_building',
                                parent: 'new_offices',
                                start: today - 2 * day,
                                end: today + 6 * day
                            },
                            {
                                name: 'Inspect building',
                                id: 'inspect_building',
                                parent: 'new_offices',
                                start: today + 6 * day,
                                end: today + 8 * day
                            },
                            {
                                name: 'Passed inspection',
                                id: 'passed_inspection',
                                parent: 'new_offices',
                                start: today + 9.5 * day,
                                milestone: true
                            },
                            {
                                name: 'Relocate',
                                id: 'relocate',
                                parent: 'new_offices',
                                start: today + 10 * day,
                                end: today + 14 * day
                            },
                            {
                                name: 'Relocate staff',
                                id: 'relocate_staff',
                                parent: 'relocate',
                                start: today + 10 * day,
                                end: today + 11 * day
                            },
                            {
                                name: 'Relocate test facility',
                                parent: 'relocate',
                                start: today + 11 * day,
                                end: today + 13 * day
                            },
                            {
                                name: 'Relocate cantina',
                                parent: 'relocate',
                                start: today + 11 * day,
                                end: today + 14 * day
                            }
                        ]
                    }
                ]
            };

        chart = Highcharts.ganttChart(
            'container',
            Highcharts.merge(chartConfig)
        );

        // Check spacing after collapsing
        spaceExpanded = getSpacing(chart);

        click(chart.yAxis[0].ticks['4'].label.element);

        spaceCollapsed = getSpacing(chart);

        assert.equal(
            spaceCollapsed,
            spaceExpanded,
            'Space between two first ticks does not change after collapsing'
        );

        // Check spacing after expanding
        click(chart.yAxis[0].ticks['4'].label.element);

        spaceExpanded = getSpacing(chart);

        assert.equal(
            spaceExpanded,
            spaceCollapsed,
            'Space between two first ticks does not change after expanding ' +
            'again'
        );

        // Check spacing after collapsing single root parent
        click(chart.yAxis[0].ticks['0'].label.element);

        spaceCollapsed = getSpacing(chart);
        axisLineLength = chart.yAxis[0].axisLine.element.getBBox().height;

        assert.equal(
            axisLineLength,
            spaceCollapsed,
            'Single root node spacing is correct'
        );

        // Check spacing after collapsing two root parents
        chartConfig.series.push({
            name: 'Second series',
            data: [
                {
                    name: 'Second series task 1',
                    id: '2_1',
                    start: today - 2 * day,
                    end: today + 14 * day
                },
                {
                    name: 'Second series task 2',
                    id: '2_2',
                    parent: '2_1',
                    start: today - 2 * day,
                    end: today + 6 * day
                }
            ]
        });
        chart = Highcharts.ganttChart(
            'container',
            Highcharts.merge(chartConfig)
        );

        click(chart.yAxis[0].ticks['8'].label.element);

        click(chart.yAxis[0].ticks['0'].label.element);

        axisLine = chart.yAxis[0].axisLine.getBBox();
        tick = chart.yAxis[0].ticks['0'].mark.getBBox();

        assert.equal(
            tick.y,
            axisLine.y + chart.yAxis[0].options.staticScale + 0.5,
            'Ticks are mainated when collapsing two series'
        );
    });

    QUnit.test('Point.update', assert => {
        const today = +new Date();
        const day = 24 * 60 * 60 * 1000;
        const chart = Highcharts.ganttChart('container', {
            series: [
                {
                    data: [
                        {
                            name: 'Planning',
                            start: today,
                            end: today + day
                        },
                        {
                            name: 'Moving',
                            id: 'moving',
                            collapsed: true
                        },
                        {
                            name: 'Packing',
                            parent: 'moving',
                            start: today + 2 * day,
                            end: today + 4 * day
                        },
                        {
                            name: 'Wash down',
                            parent: 'moving',
                            start: today + 4 * day,
                            end: today + 5 * day
                        },
                        {
                            name: 'Bye',
                            parent: 'moving',
                            start: today + 5 * day,
                            milestone: true
                        }
                    ]
                }
            ]
        });
        const updateValues = {
            start: today + day,
            end: today + 2 * day
        };
        const {
            series: [{
                points,
                points: [point]
            }]
        } = chart;
        // Run Point.update
        point.update(updateValues);

        // Test that point values are as expected.
        assert.strictEqual(
            point.start,
            updateValues.start,
            'Should have point.start equal the updated value'
        );
        assert.strictEqual(
            point.end,
            updateValues.end,
            'Should have point.end equal the updated value'
        );

        // Test that number of points has not changed
        assert.strictEqual(
            points.length,
            5,
            'Should not change the number of points after update. #11231, ' +
            '#11486'
        );

        // Test that collapsed graphics are removed
        assert.strictEqual(
            points.filter(p => Boolean(p.graphic)).length,
            2,
            'Collapsed graphics should not be rendered (#12617)'
        );

        // Changing id of a parent
        points[1].update({ id: '_moving' });

        assert.strictEqual(
            chart.series[0].yAxis.treeGrid.tree.children.length,
            5,
            'Orphaned nodes should appear as direct children of root (#15196).'
        );
    });

    QUnit.test('Collapsing subtasks', assert => {
        const today = new Date();
        const day = 24 * 60 * 60 * 1000;

        let chart = Highcharts.ganttChart('container', {
            chart: {
                height: 300
            },
            title: {
                text: 'Highcharts Gantt With Subtasks'
            },
            xAxis: {
                min: today.getTime() - 2 * day,
                max: today.getTime() + 32 * day
            },
            series: [{
                name: 'Project 1',
                data: [{
                    name: 'Planning',
                    id: 'planning',
                    start: today.getTime(),
                    end: today.getTime() + 20 * day
                }, {
                    name: 'Requirements',
                    id: 'requirements',
                    parent: 'planning',
                    start: today.getTime(),
                    end: today.getTime() + 5 * day
                }, {
                    name: 'Design',
                    id: 'design',
                    dependency: 'requirements',
                    parent: 'planning',
                    start: today.getTime() + 3 * day,
                    end: today.getTime() + 20 * day
                }, {
                    name: 'Layout',
                    id: 'layout',
                    parent: 'design',
                    start: today.getTime() + 3 * day,
                    end: today.getTime() + 10 * day
                }, {
                    name: 'Develop',
                    id: 'develop',
                    start: today.getTime() + 5 * day,
                    end: today.getTime() + 30 * day
                }]
            }]
        });
        click(chart.yAxis[0].ticks['2'].label.element);
        click(chart.yAxis[0].ticks['0'].label.element);

        assert.strictEqual(
            document.querySelectorAll('.highcharts-yaxis .highcharts-tick')
                .length,
            chart.yAxis[0].tickPositions.length + 1,
            'Should have the correct amount of ticks remaining after ' +
            'collapsing subtask before parent (#12012)'
        );

        click(chart.yAxis[0].ticks['0'].label.element);
        chart.xAxis[0].update({
            min: today.getTime() + 2 * day
        });
        assert.strictEqual(
            chart.pathfinder.connections.length,
            1,
            '#12691: The connector should not disappear when the task is ' +
            'partially visible'
        );

        chart = Highcharts.ganttChart('container', {
            series: [{
                data: [{
                    name: 'A',
                    id: 'A'
                }, {
                    name: 'A1',
                    id: 'A1',
                    parent: 'A'
                }, {
                    name: 'A1_a',
                    id: 'A1_a',
                    parent: 'A1',
                    start: today.getTime() + 5 * day,
                    end: today.getTime() + 30 * day
                }]
            }, {
                data: [{
                    name: 'B',
                    id: 'B'
                }, {
                    name: 'B1',
                    id: 'B1',
                    parent: 'B',
                    start: today.getTime() + 5 * day,
                    end: today.getTime() + 30 * day
                }]
            }]
        });
        chart.series[0].points[1].update({
            id: '_a1'
        });
        click(chart.yAxis[0].ticks[2].label.element);
        assert.ok(
            chart.series[1].points[0].collapsed,
            `After clicking the tick label, the proper point should be
            collapsed.`
        );

        click(chart.yAxis[0].ticks[2].label.element);
        assert.notOk(
            chart.series[1].points[0].collapsed,
            `After clicking the tick label again, the proper point should not be
            collapsed.`
        );

        chart.yAxis[0].update({
            visible: false
        });

        assert.ok(
            true,
            `There shouldn't be any error in the console after changing the
            visibility of axis (#20180).`
        );
    });

    QUnit.test('No series', function (assert) {
        Highcharts.ganttChart('container', {
            title: {
                text: 'Gantt'
            }
        });

        assert.ok(true, 'Gantt should be initialized with no errors (#13246).');
    });

    QUnit.test(
        'The ticks should be generated correctly during scrolling with the ' +
        'grid axis, #13072.',
        assert => {
            const chart = Highcharts.ganttChart('container', {
                yAxis: {
                    min: 0,
                    max: 2,
                    type: 'category',
                    scrollbar: {
                        enabled: true
                    },
                    grid: {
                        enabled: true,
                        columns: [
                            {
                                title: {
                                    text: 'Project'
                                },
                                labels: {
                                    format: '{point.name}'
                                }
                            },
                            {
                                title: {
                                    text: 'Assignee'
                                },
                                labels: {
                                    format: '{point.assignee}'
                                }
                            }
                        ]
                    }
                },
                series: [
                    {
                        name: 'Project 1',
                        data: [
                            {
                                start: 1,
                                end: 2,
                                name: 'Task A',
                                assignee: 'Person 1',
                                y: 0
                            },
                            {
                                start: 3,
                                end: 4,
                                name: 'Task B',
                                assignee: 'Person 2',
                                y: 1
                            },
                            {
                                start: 5,
                                end: 6,
                                name: 'Task C',
                                assignee: 'Person 3',
                                y: 2
                            },
                            {
                                start: 6,
                                end: 9,
                                name: 'Task D',
                                assignee: 'Person 4',
                                y: 3
                            },
                            {
                                start: 4,
                                end: 10,
                                name: 'Task E',
                                assignee: 'Person 5',
                                y: 4
                            }
                        ]
                    }
                ]
            });

            assert.ok(
                chart.yAxis[0].grid.axisLineExtra,
                'The extra left line for grid should exist.'
            );
            assert.notOk(
                chart.yAxis[0].grid.columns[0].grid.lowerBorder,
                'The extra lower border for grid should not exist because ' +
                'the last tick mark exists.'
            );
            assert.notOk(
                chart.yAxis[0].grid.columns[0].grid.upperBorder,
                'The extra upper border for grid should not exist because ' +
                'the first tick mark exists.'
            );

            assert.strictEqual(
                chart.yAxis[0].ticks[0].label.textStr,
                'Task A',
                'First tick on the left columns should be Task A.'
            );
            assert.strictEqual(
                chart.yAxis[0].ticks[2].label.textStr,
                'Task C',
                'Third tick on the left columns should be Task C.'
            );
            chart.yAxis[0].setExtremes(0.4, 2.4);

            assert.ok(
                chart.yAxis[0].grid.lowerBorder,
                'The extra lower border for grid should exist.'
            );
            assert.ok(
                chart.yAxis[0].grid.upperBorder,
                'The extra upper border for grid should exist.'
            );
            assert.strictEqual(
                chart.yAxis[0].ticks[0].label.textStr,
                'Task A',
                'First tick on the left columns should be Task A.'
            );
            assert.strictEqual(
                chart.yAxis[0].grid.columns[0].ticks[3].label.visibility,
                'hidden',
                'Fourth tick on the left columns should not be visible.'
            );
            chart.yAxis[0].setExtremes(0.8, 2.8);

            assert.strictEqual(
                chart.yAxis[0].grid.columns[0].ticks[0].label.visibility,
                'hidden',
                'First tick on the left columns should not be visible.'
            );
            assert.ok(
                chart.yAxis[0].grid.columns[0].ticks[0].mark,
                'First tick mark on the left columns should exist.'
            );
            assert.strictEqual(
                chart.yAxis[0].ticks[3].label.textStr,
                'Task D',
                'Last visible tick on the left columns should be Task D.'
            );
            assert.strictEqual(
                chart.yAxis[0].grid.columns[0].ticks[3].mark.visibility,
                'hidden',
                'Tick marker with index 3 should not be visible.'
            );
            chart.yAxis[0].setExtremes(1, 3);

            assert.strictEqual(
                chart.yAxis[0].ticks[3].label.textStr,
                'Task D',
                'Last visible tick on the left columns should be Task D.'
            );
            chart.yAxis[0].setExtremes(1.4, 3.4);

            assert.strictEqual(
                chart.yAxis[0].grid.columns[0].ticks[3].label.visibility,
                'inherit',
                'Tick marker with index 3 should be visible again.'
            );
        }
    );

    QUnit.test(
        'When navigator enabled there should be no errors in the console ' +
        'caused by unsorted data, (#13376).',
        function (assert) {
            const chart = Highcharts.ganttChart('container', {
                navigator: {
                    enabled: true
                },
                series: [
                    {
                        data: [
                            {
                                name: 'Task 1',
                                start: 2,
                                end: 3
                            },
                            {
                                name: 'Task 2',
                                start: 3,
                                end: 4
                            },
                            {
                                name: 'Task 3',
                                start: 1,
                                end: 2
                            }
                        ]
                    }
                ]
            });

            assert.notOk(
                chart.series[1].requireSorting,
                'No error 15 in the console.'
            );
        }
    );

    QUnit.test('Gantt using the keys feature #13768', function (assert) {
        var chart = Highcharts.ganttChart('container', {
            series: [
                {
                    keys: ['start', 'end'],
                    data: [[Date.UTC(2014, 10, 20), Date.UTC(2014, 10, 25)]]
                }
            ]
        });

        assert.strictEqual(
            chart.series[0].processedXData[0] !== undefined,
            true,
            'The processedXData should be applied by using the keys feature ' +
            '#13768'
        );
        assert.strictEqual(
            chart.series[0].processedYData[0] !== undefined,
            true,
            'The processedYData should be applied by using the keys feature ' +
            '#13768'
        );
    });

    QUnit.test(
        'Gantt with scrollbar using uniqueNames, #14808.', function (assert) {
            Highcharts.ganttChart('container', {
                yAxis: {
                    min: 0,
                    max: 1,
                    uniqueNames: true,
                    scrollbar: {
                        enabled: true
                    }
                },
                series: [{
                    type: 'gantt',
                    name: 's1',
                    data: [{
                        name: 'Task 1',
                        start: Date.UTC(2020, 5, 1),
                        end: Date.UTC(2020, 5, 3)
                    }, {
                        name: 'Task 2',
                        start: Date.UTC(2020, 5, 1),
                        end: Date.UTC(2020, 5, 3)
                    }]
                }, {
                    type: 'gantt',
                    name: 's2',
                    data: [{
                        name: 'Task 3',
                        start: Date.UTC(2020, 5, 1),
                        end: Date.UTC(2020, 5, 3)
                    }]
                }]
            });

            assert.ok(
                true,
                'There should be no errors in the console.'
            );
        });

    QUnit.test(
        'Gantt rangeSelector with scrollablePlotArea is fixed, #20940',
        function (assert) {

            const chart = Highcharts.ganttChart('container', {
                chart: {
                    scrollablePlotArea: {
                        minHeight: 500
                    }
                },
                rangeSelector: {
                    enabled: true
                },
                series: [
                    {
                        data: [
                            {
                                name: 'Task 1',
                                start: 2,
                                end: 3
                            },
                            {
                                name: 'Task 2',
                                start: 3,
                                end: 4
                            },
                            {
                                name: 'Task 3',
                                start: 1,
                                end: 2
                            }
                        ]
                    }
                ]
            });

            assert.ok(
                chart.rangeSelector.buttonGroup
                    .element.closest('.highcharts-fixed'),
                'rangeSelector is a part of fixed elements.'
            );
        });

    QUnit.test(
        'Gantt using array-based points, #17738',
        function (assert) {
            const chart = Highcharts.ganttChart('container', {
                series: [
                    {
                        data: [
                            [Date.UTC(2014, 10, 20), Date.UTC(2014, 10, 25)],
                            [Date.UTC(2014, 10, 21), Date.UTC(2014, 10, 26)],
                            [Date.UTC(2014, 10, 23), Date.UTC(2014, 10, 29)]
                        ]
                    }
                ]
            });

            assert.strictEqual(
                chart.series[0].yAxis.tickPositions.length,
                3,
                'Array-based points are loaded into the chart'
            );
        });
}());
