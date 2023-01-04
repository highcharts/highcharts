QUnit.test('Export buttons', function (assert) {
    var chartClickEventRan = false,
        chart = Highcharts.chart('container', {
            chart: {
                events: {
                    click: function () {
                        chartClickEventRan = true;
                    }
                }
            },

            title: {
                text: ''
            },

            credits: {
                enabled: false
            },

            xAxis: {
                categories: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec'
                ]
            },

            series: [
                {
                    data: [
                        29.9,
                        71.5,
                        106.4,
                        129.2,
                        144.0,
                        176.0,
                        135.6,
                        148.5,
                        216.4,
                        194.1,
                        95.6,
                        54.4
                    ]
                }
            ],

            exporting: {
                buttons: {
                    contextButton: {
                        menuItems: [
                            {
                                text: 'Export to PNG (small)',
                                onclick: function () {
                                    this.exportChart({
                                        width: 250
                                    });
                                }
                            },
                            {
                                text: 'Export to PNG (large)',
                                onclick: function () {
                                    this.exportChart();
                                },
                                separator: false
                            }
                        ]
                    }
                }
            }
        });

    // Test menu items

    var button = chart.renderer.box.querySelector('.highcharts-button');

    assert.strictEqual(button.nodeName, 'g', 'Button is there');

    // Click it
    var controller = new TestController(chart),
        alignAttr = chart.exportSVGElements[0].alignAttr;
    controller.click(alignAttr.translateX + 5, alignAttr.translateY + 5);

    assert.strictEqual(
        document.querySelector('.highcharts-contextmenu').firstChild.childNodes
            .length,
        2,
        'Two menu items'
    );

    // but don't run chart click event
    assert.strictEqual(
        chartClickEventRan,
        false,
        'No chart click event on context menu click (#3495)'
    );

    // Test click without menuItems

    chart.update({
        exporting: {
            buttons: {
                contextButton: {
                    menuItems: null,
                    onclick: function () {
                        this.exportChart();
                    }
                }
            }
        }
    });

    button = chart.renderer.box.querySelector('.highcharts-button');

    assert.strictEqual(button.nodeName, 'g', 'Button is there');

    var originalPost = Highcharts.HttpUtilities.post;

    try {
        var postData;

        Highcharts.HttpUtilities.post = function (url, data) {
            postData = data;
        };

        // Click it
        Highcharts.fireEvent(button, 'click');

        assert.strictEqual(postData.type, 'image/png', 'Posting for PNG');
        assert.strictEqual(typeof postData.svg, 'string', 'SVG is posted');
    } finally {
        Highcharts.HttpUtilities.post = originalPost;
    }
});

QUnit.test('View/hide data table button, #14338.', function (assert) {
    const chart = Highcharts.chart('container', {
        exporting: {
            buttons: {
                contextButton: {
                    menuItems: [
                        'viewData',
                        'viewFullscreen',
                        'viewFullscreen',
                        'viewFullscreen',
                        'viewFullscreen',
                        'viewFullscreen',
                        'viewFullscreen',
                        'viewFullscreen',
                        'viewFullscreen',
                        'viewFullscreen',
                        'viewFullscreen',
                        'viewFullscreen',
                        'viewFullscreen',
                        'viewFullscreen'
                    ]
                }
            }
        },
        series: [
            {
                data: [1, 4, 3, 5]
            }
        ]
    });

    // Test menu items
    const controller = new TestController(chart),
        alignAttr = chart.exportSVGElements[0].alignAttr;

    // Click on the export menu to trigger list creation.
    controller.click(alignAttr.translateX + 5, alignAttr.translateY + 5);

    chart.toggleDataTable();
    assert.strictEqual(
        chart.exportDivElements[0].innerText,
        'Hide data table',
        'There should be text indicating that the table is visible and can be hidden.'
    );

    chart.toggleDataTable();
    assert.strictEqual(
        chart.exportDivElements[0].innerText,
        'View data table',
        'There should be text indicating that the table is hidden and can be visible again.'
    );
});

QUnit.test(
    'When chart initialized with the table, show a proper button for hiding the table, #14352.',
    function (assert) {
        const chart = Highcharts.chart('container', {
            exporting: {
                showTable: true,
                buttons: {
                    contextButton: {
                        menuItems: ['viewData']
                    }
                }
            },
            series: [
                {
                    data: [1, 4, 3, 5]
                }
            ]
        });

        // Test menu items
        const controller = new TestController(chart),
            alignAttr = chart.exportSVGElements[0].alignAttr;

        // Click on the export menu to trigger list creation.
        controller.click(alignAttr.translateX + 5, alignAttr.translateY + 5);

        assert.strictEqual(
            chart.exportDivElements[0].innerText,
            'Hide data table',
            'There should be text indicating that the table is visible and can be hidden.'
        );

        chart.toggleDataTable();
        assert.strictEqual(
            chart.exportDivElements[0].innerText,
            'View data table',
            'There should be text indicating that the table is hidden and can be visible again.'
        );
    }
);
