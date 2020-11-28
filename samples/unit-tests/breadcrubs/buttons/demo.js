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
        'Initially, the breadcrumbs should be disabled and the classic drillUp button should exist.'
    );
    chart.drillUp();

    chart.update({
        drilldown: {
            breadcrumbs: {
                enabled: true
            }
        }
    });

    chart.series[0].points[0].doDrilldown();
    assert.notOk(
        chart.drillUpButton,
        'Clasic button should not exist.'
    );
    assert.ok(
        chart.drilldown.breadcrumbs.breadcrumbsGroup,
        'Breadcrumbs group should be created.'
    );
    chart.series[0].points[0].doDrilldown();
    chart.series[0].points[0].doDrilldown();

    const buttons = chart.drilldown.breadcrumbs.breadcrumbsGroup.element.childNodes;

    assert.strictEqual(
        buttons[buttons.length - 1].textContent,
        'Lemon',
        'The last button should have text Lemon.'
    );
    chart.drilldown.breadcrumbs.multipleDrillUp(0);
    assert.strictEqual(
        buttons[buttons.length - 1].textContent,
        'Fruits',
        'The last button should have text Fruits.'
    );
    chart.drilldown.breadcrumbs.multipleDrillUp(-1);
    assert.notOk(
        buttons.length,
        'The breadcrumbsButtonGroup should be empty.'
    );
    chart.series[0].points[1].doDrilldown();
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
                y: 6,
                drilldown: "Vegetables"
            }, {
                name: "Meat",
                y: 3
            }]
        }],
        drilldown: {
            animation: false,
            breadcrumbs: {
                enabled: true,
                format: 'Go to {value}'
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
                }, ['Other', 1]
                ]
            }]
        }
    });
    chart.series[0].points[0].doDrilldown();

    const buttons = chart.drilldown.breadcrumbs.breadcrumbsGroup.element.childNodes;

    assert.strictEqual(
        buttons[buttons.length - 1].textContent,
        'Go to Fruits',
        'The last button should have text Go to Fruits.'
    );
});