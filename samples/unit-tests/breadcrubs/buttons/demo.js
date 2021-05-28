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
            name: "Supply",
            data: [{
                name: "Fruits",
                y: 5,
                drilldown: "Fruits"
            },
            {
                name: "Vegetables",
                y: 6,
                drilldown: "Vegetables"
            },
            {
                name: "Meat",
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
                name: "Fruits",
                id: "Fruits",
                data: [{
                    name: "Citrus",
                    y: 2,
                    drilldown: "Citrus"
                }, {
                    name: "Tropical",
                    y: 5,
                    drilldown: "Tropical"
                },
                ['Other', 1]
                ]
            }, {
                name: "Vegetables",
                id: "Vegetables",
                data: [
                    ["Potatoes", 2],
                    ["Cucumber", 4]
                ]
            }, {
                name: "Citrus",
                id: "Citrus",
                data: [{
                    name: "Lemon",
                    y: 5,
                    drilldown: "Lemon"
                },
                ["Orange", 4]
                ]
            }, {
                name: "Tropical",
                id: "Tropical",
                data: [
                    ["Banana", 1],
                    ["Mango", 3]
                ]
            }, {
                name: "Lemon",
                id: "Lemon",
                data: [
                    ["Typ A", 2],
                    ["Typ B", 7]
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
    chart.drillUp();

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
    assert.ok(
        chart.breadcrumbs.breadcrumbsGroup,
        'Breadcrumbs group should be created.'
    );
    chart.series[0].points[0].doDrilldown();
    chart.series[0].points[0].doDrilldown();

    let buttons = chart.breadcrumbs.breadcrumbsGroup.element.childNodes;

    assert.strictEqual(
        buttons[buttons.length - 1].textContent,
        'Lemon',
        'The last button should have text Lemon.'
    );
    chart.breadcrumbs.jumpBy(0);
    assert.strictEqual(
        buttons[buttons.length - 1].textContent,
        'Fruits',
        'The last button should have text Fruits.'
    );
    chart.breadcrumbs.jumpBy(null);
    assert.notOk(
        buttons.length,
        'The breadcrumbsButtonGroup should be empty.'
    );
    chart.series[0].points[1].doDrilldown();
    buttons = chart.breadcrumbs.breadcrumbsGroup.element.childNodes;
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
            name: "Supply",
            data: [{
                name: "Fruits",
                y: 5,
                drilldown: "Fruits"
            }, {
                name: "Vegetables",
                y: 6
            }, {
                name: "Meat",
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
                name: "Fruits",
                id: "Fruits",
                data: [
                    ["Citrus", 2],
                    ["Tropical", 5],
                    ['Other', 1]
                ]
            }]
        }
    });
    chart.series[0].points[0].doDrilldown();

    const buttons = chart.breadcrumbs.breadcrumbsGroup.element.childNodes;

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
                name: "Supply",
                data: [{
                    name: "Fruits",
                    y: 5,
                    drilldown: "Fruits"
                }, {
                    name: "Vegetables",
                    y: 6
                }, {
                    name: "Meat",
                    y: 3
                }]
            }],
            drilldown: {
                breadcrumbs: {
                    enabled: true,
                    showFullPath: true,
                    formatter: function (breadcrumb) {
                        let index;

                        if (breadcrumb[0] === null) {
                            index = 0;
                        } else {
                            index = breadcrumb[0] + 1;
                        }
                        return labels[index];
                    }
                },
                animation: false,
                series: [{
                    name: "Fruits",
                    id: "Fruits",
                    data: [
                        ["Citrus", 2],
                        ["Tropical", 5],
                        ['Other', 1]
                    ]
                }]
            }
        });
    chart.series[0].points[0].doDrilldown();

    const buttons = chart.breadcrumbs.breadcrumbsGroup.element.childNodes;

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
                name: "Fruits",
                y: 5,
                drilldown: "Fruits"
            }, {
                name: "Vegetables",
                y: 6
            }, {
                name: "Meat",
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
                name: "Fruits",
                id: "Fruits",
                data: [
                    ["Citrus", 2],
                    ["Tropical", 5],
                    ['Other', 1]
                ]
            }]
        }
    });
    chart.series[0].points[0].doDrilldown();

    const buttons = chart.breadcrumbs.breadcrumbsGroup.element.childNodes;

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
            width: 600
        },
        xAxis: {
            type: 'category'
        },
        title: {
            text: null
        },
        series: [{
            name: "Supply",
            data: [{
                name: "Fruits",
                y: 5,
                drilldown: "Fruits"
            },
            {
                name: "Vegetables",
                y: 6,
                drilldown: "Vegetables"
            },
            {
                name: "Meat",
                y: 3
            }
            ]
        }],
        drilldown: {
            animation: false,
            breadcrumbs: {
                showFullPath: true,
                position: {
                    align: 'center'
                }
            },
            series: [{
                name: "Fruits",
                id: "Fruits",
                data: [{
                    name: "Citrus",
                    y: 2,
                    drilldown: "Citrus"
                }, {
                    name: "Tropical",
                    y: 5,
                    drilldown: "Tropical"
                },
                ['Other', 1]
                ]
            }, {
                name: "Vegetables",
                id: "Vegetables",
                data: [
                    ["Potatoes", 2],
                    ["Cucumber", 4]
                ]
            }, {
                name: "Citrus",
                id: "Citrus",
                data: [{
                    name: "Lemon",
                    y: 5,
                    drilldown: "Lemon"
                },
                ["Orange", 4]
                ]
            }, {
                name: "Tropical",
                id: "Tropical",
                data: [
                    ["Banana", 1],
                    ["Mango", 3]
                ]
            }]
        }
    });

    chart.series[0].points[0].doDrilldown();
    let breadcrumbsWidth = chart.breadcrumbs.breadcrumbsGroup.getBBox().width,
        breadcrumbsXPosition = chart.breadcrumbs.breadcrumbsGroup.translateX;

    assert.strictEqual(
        breadcrumbsXPosition + breadcrumbsWidth / 2,
        chart.chartWidth / 2,
        'When buttons are aligned to the centre, their centre point should be in the middle of the chart width.'
    );

    chart.series[0].points[0].doDrilldown();
    breadcrumbsWidth = chart.breadcrumbs.breadcrumbsGroup.getBBox().width;
    breadcrumbsXPosition = chart.breadcrumbs.breadcrumbsGroup.translateX;
    assert.close(
        breadcrumbsXPosition + breadcrumbsWidth / 2,
        chart.chartWidth / 2,
        1,
        'After each iteration, the breadcrumbs group should stay in the middle.'
    );

    chart.drillUp();
    assert.close(
        breadcrumbsXPosition + breadcrumbsWidth / 2,
        chart.chartWidth / 2,
        1,
        'After each iteration, the breadcrumbs group should stay in the middle.'
    );
});