QUnit.test('Breadcrumbs button', function (assert) {
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
    chart.breadcrumbs.multipleDrillUp(0);
    assert.strictEqual(
        buttons[buttons.length - 1].textContent,
        'Fruits',
        'The last button should have text Fruits.'
    );
    chart.breadcrumbs.multipleDrillUp(null);
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

QUnit.test('Breadcrumbs format', function (assert) {
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
                showFullPath: true,
                format: 'Go to {point.name}'
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

QUnit.test('Breadcrumbs formatter', function (assert) {
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
        buttons[0].textContent,
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
                enabled: true
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
        '◁ Major',
        'The button should show ◁ Major.'
    );
});