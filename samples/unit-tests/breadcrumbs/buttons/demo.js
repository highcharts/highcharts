QUnit.test('Breadcrumbs button- check if the created path is correct.', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        xAxis: {
            type: 'category'
        },
        title: {
            text: null
        },
        series: [{
            name: 'Supply',
            data: [{
                name: 'Fruits',
                y: 5,
                drilldown: 'Fruits'
            },
            {
                name: 'Vegetables',
                y: 6,
                drilldown: 'Vegetables'
            },
            {
                name: 'Meat',
                y: 3
            }
            ]
        }],
        drilldown: {
            breadcrumbs: {
                showFullPath: false
            },
            animation: false,
            series: [{
                name: 'Fruits',
                id: 'Fruits',
                data: [{
                    name: 'Citrus',
                    y: 2,
                    drilldown: 'Citrus'
                }, {
                    name: 'Tropical',
                    y: 5,
                    drilldown: 'Tropical'
                },
                ['Other', 1]
                ]
            }, {
                name: 'Vegetables',
                id: 'Vegetables',
                data: [
                    ['Potatoes', 2],
                    ['Cucumber', 4]
                ]
            }, {
                name: 'Citrus',
                id: 'Citrus',
                data: [{
                    name: 'Lemon',
                    y: 5,
                    drilldown: 'Lemon'
                },
                ['Orange', 4]
                ]
            }, {
                name: 'Tropical',
                id: 'Tropical',
                data: [
                    ['Banana', 1],
                    ['Mango', 3]
                ]
            }, {
                name: 'Lemon',
                id: 'Lemon',
                data: [
                    ['Typ A', 2],
                    ['Typ B', 7]
                ]
            }
            ]
        }
    });

    chart.series[0].points[0].doDrilldown();
    assert.ok(
        chart.drillUpButton.element,
        'Initially, the breadcrumbs should be disabled and the drillUp button should exist.'
    );

    Highcharts.fireEvent(chart.breadcrumbs, 'up', { newLevel: 0 });

    chart.update({
        drilldown: {
            breadcrumbs: {
                showFullPath: true
            }
        }
    });

    chart.series[0].points[0].doDrilldown();
    assert.notOk(
        chart.drillUpButton,
        'Clasic button should not exist.'
    );
    assert.strictEqual(
        chart.container.getElementsByClassName('highcharts-breadcrumbs-group').length,
        1,
        'Breadcrumbs groups should be created.'
    );
    chart.series[0].points[0].doDrilldown();
    chart.series[0].points[0].doDrilldown();

    let buttons = chart
        .container
        .getElementsByClassName('highcharts-breadcrumbs-group')[0]
        .childNodes;

    assert.strictEqual(
        buttons[buttons.length - 1].textContent,
        'Lemon',
        'The last button should have text Lemon.'
    );
    Highcharts.fireEvent(chart.breadcrumbs, 'up', { newLevel: 1 });
    assert.strictEqual(
        buttons[buttons.length - 1].textContent,
        'Fruits',
        'The last button should have text Fruits.'
    );
    Highcharts.fireEvent(chart.breadcrumbs, 'up', { newLevel: 0 });
    assert.strictEqual(
        chart.container.getElementsByClassName('highcharts-breadcrumbs-group').length,
        1,
        'The breadcrumbs separators group should be destroyed.'
    );
    chart.series[0].points[1].doDrilldown();
    buttons = chart
        .container
        .getElementsByClassName('highcharts-breadcrumbs-group')[0]
        .childNodes;

    assert.strictEqual(
        buttons[buttons.length - 1].textContent,
        'Vegetables',
        'The last button should have text Vegetables.'
    );
});

QUnit.test('Breadcrumbs button format.', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        xAxis: {
            type: 'category'
        },
        series: [{
            name: 'Supply',
            data: [{
                name: 'Fruits',
                y: 5,
                drilldown: 'Fruits'
            }, {
                name: 'Vegetables',
                y: 6
            }, {
                name: 'Meat',
                y: 3
            }]
        }],
        drilldown: {
            breadcrumbs: {
                enabled: true,
                format: 'Go to {level.name}'
            },
            animation: false,
            series: [{
                name: 'Fruits',
                id: 'Fruits',
                data: [
                    ['Citrus', 2],
                    ['Tropical', 5],
                    ['Other', 1]
                ]
            }]
        }
    });
    chart.series[0].points[0].doDrilldown();

    const buttons = chart.breadcrumbs.group.element.childNodes;
    assert.strictEqual(
        buttons[buttons.length - 1].textContent,
        'Go to Fruits',
        'The last button should have text Go to Fruits.'
    );
});

QUnit.test('Breadcrumbs button formatter.', function (assert) {
    const labels = [1, 2, 3, 4],
        chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            xAxis: {
                type: 'category'
            },
            series: [{
                name: 'Supply',
                data: [{
                    name: 'Fruits',
                    y: 5,
                    drilldown: 'Fruits'
                }, {
                    name: 'Vegetables',
                    y: 6
                }, {
                    name: 'Meat',
                    y: 3
                }]
            }],
            drilldown: {
                breadcrumbs: {
                    enabled: true,
                    showFullPath: true,
                    formatter: function (breadcrumb) {
                        const index = breadcrumb.level;

                        return labels[index];
                    }
                },
                animation: false,
                series: [{
                    name: 'Fruits',
                    id: 'Fruits',
                    data: [
                        ['Citrus', 2],
                        ['Tropical', 5],
                        ['Other', 1]
                    ]
                }]
            }
        });
    chart.series[0].points[0].doDrilldown();

    const buttons = chart.breadcrumbs.group.element.childNodes;

    assert.strictEqual(
        buttons[1].textContent,
        '1',
        'The first button should have text 1.'
    );
    assert.strictEqual(
        buttons[2].textContent,
        '2',
        'The next button should have text 2.'
    );
});

QUnit.test('Breadcrumbs with no series name, lang', function (assert) {
    Highcharts.setOptions({
        lang: {
            mainBreadcrumb: 'Major'
        }
    });
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        xAxis: {
            type: 'category'
        },
        series: [{
            data: [{
                name: 'Fruits',
                y: 5,
                drilldown: 'Fruits'
            }, {
                name: 'Vegetables',
                y: 6
            }, {
                name: 'Meat',
                y: 3
            }]
        }],
        drilldown: {
            breadcrumbs: {
                enabled: true,
                showFullPath: false
            },
            animation: false,
            series: [{
                name: 'Fruits',
                id: 'Fruits',
                data: [
                    ['Citrus', 2],
                    ['Tropical', 5],
                    ['Other', 1]
                ]
            }]
        }
    });
    chart.series[0].points[0].doDrilldown();

    const buttons = chart.breadcrumbs.group.element.childNodes;

    assert.strictEqual(
        buttons[0].textContent,
        '← Major',
        'The button should show Major.'
    );
});

QUnit.test('Breadcrumbs button positioning.', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            width: 600,
            plotBorderWidth: 1,
            scrollablePlotArea: {
                minHeight: 1000
            }
        },
        xAxis: {
            type: 'category'
        },
        title: {
            text: null
        },
        series: [{
            name: 'Supply',
            data: [{
                name: 'Fruits',
                y: 5,
                drilldown: 'Fruits'
            },
            {
                name: 'Vegetables',
                y: 6,
                drilldown: 'Vegetables'
            },
            {
                name: 'Meat',
                y: 3
            }
            ]
        }],
        navigation: {
            breadcrumbs: {
                buttonSpacing: 0
            }
        },
        drilldown: {
            animation: false,
            breadcrumbs: {
                theme: {
                    padding: 0
                },
                position: {
                    alignTo: 'plotBox',
                    align: 'center'
                }
            },
            series: [{
                name: 'Fruits',
                id: 'Fruits',
                data: [{
                    name: 'Citrus',
                    y: 2,
                    drilldown: 'Citrus'
                }, {
                    name: 'Tropical',
                    y: 5,
                    drilldown: 'Tropical'
                },
                ['Other', 1]
                ]
            }, {
                name: 'Vegetables',
                id: 'Vegetables',
                data: [
                    ['Potatoes', 2],
                    ['Cucumber', 4]
                ]
            }, {
                name: 'Citrus',
                id: 'Citrus',
                data: [{
                    name: 'Lemon',
                    y: 5,
                    drilldown: 'Lemon'
                },
                ['Orange', 4]
                ]
            }, {
                name: 'Tropical',
                id: 'Tropical',
                data: [
                    ['Banana', 1],
                    ['Mango', 3]
                ]
            }]
        }
    });

    chart.series[0].points[0].doDrilldown();
    let breadcrumbsWidth = chart.breadcrumbs.group.getBBox().width,
        breadcrumbsXPosition = chart.breadcrumbs.group.translateX;
    assert.close(
        breadcrumbsXPosition + breadcrumbsWidth / 2,
        chart.plotWidth / 2 + chart.plotLeft,
        3,
        'When buttons are aligned to the centre, their centre point should be in the middle of the chart width.'
    );

    chart.series[0].points[0].doDrilldown();
    breadcrumbsWidth = chart.breadcrumbs.group.getBBox().width;
    breadcrumbsXPosition = chart.breadcrumbs.group.translateX;
    assert.close(
        breadcrumbsXPosition + breadcrumbsWidth / 2,
        chart.plotWidth / 2 + chart.plotLeft,
        3,
        'After each iteration, the breadcrumbs group should stay in the middle.'
    );

    chart.drillUp();
    assert.close(
        breadcrumbsXPosition + breadcrumbsWidth / 2,
        chart.plotWidth / 2 + chart.plotLeft,
        3,
        'After each iteration, the breadcrumbs group should stay in the middle.'
    );

    assert.strictEqual(
        chart.breadcrumbs.options.buttonSpacing,
        0,
        'Options from navigation.breadcrumbs should be handled'
    );

    assert.ok(
        chart.breadcrumbs.group.element.closest('.highcharts-fixed'),
        'Breadcrumbs should be a part of fixedSelectors group #17963.'
    );
});

QUnit.test('Breadcrumbs list when drilling down category, #17188.', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Basic drilldown'
        },
        xAxis: {
            type: 'category'
        },
        series: [{
            name: '2020',
            colorByPoint: true,
            data: [{
                name: 'Animals',
                y: 5,
                drilldown: 'animals'
            }]
        }, {
            name: '2021',
            colorByPoint: true,
            data: [{
                name: 'Animals',
                y: 1,
                drilldown: 'animals2'
            }]
        }],
        drilldown: {
            series: [{
                id: 'animals',
                name: '2020',
                data: [{
                    name: 'Cats',
                    y: 4,
                    drilldown: 'cats'
                },
                {
                    name: 'Dogs',
                    y: 2
                }]
            }, {
                id: 'animals2',
                name: '2021',
                data: [{
                    name: 'Cats',
                    y: 3,
                    drilldown: 'cats'
                },
                {
                    name: 'frogs',
                    y: 5
                },
                {
                    name: 'Cows',
                    y: 6
                },
                {
                    name: 'Sheep',
                    y: 2
                },
                {
                    name: 'Pigs',
                    y: 2
                }]
            }, {
                id: 'cats',
                name: '2021',
                data: [{
                    name: 'Exotic Shorthair Cats',
                    y: 3
                },
                {
                    name: 'Ragdoll Cats',
                    y: 5
                },
                {
                    name: 'British Shorthair',
                    y: 6
                },
                {
                    name: 'Persian Cats',
                    y: 2
                },
                {
                    name: 'Maine Coon Cats',
                    y: 2
                }]
            }]
        }
    });

    chart.xAxis[0].drilldownCategory(0);
    chart.xAxis[0].drilldownCategory(0);
    Highcharts.fireEvent(chart.breadcrumbs, 'up', { newLevel: 1 });
    assert.strictEqual(
        chart.drilldownLevels.length,
        2,
        `When drilling down categories and then drilling up, a correct list
        should be displayed and the correct level should be shown.`
    );
});