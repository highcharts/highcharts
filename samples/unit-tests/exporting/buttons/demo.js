
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
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
                    'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },

            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5,
                    216.4, 194.1, 95.6, 54.4]
            }],

            exporting: {
                buttons: {
                    contextButton: {
                        menuItems: [{
                            text: 'Export to PNG (small)',
                            onclick: function () {
                                this.exportChart({
                                    width: 250
                                });
                            }
                        }, {
                            text: 'Export to PNG (large)',
                            onclick: function () {
                                this.exportChart();
                            },
                            separator: false
                        }]
                    }
                }
            }

        });

    // Test menu items

    var button = chart.renderer.box.querySelector('.highcharts-button');

    assert.strictEqual(
        button.nodeName,
        'g',
        'Button is there'
    );

    // Click it
    var controller = TestController(chart),
        alignAttr = chart.exportSVGElements[0].alignAttr;
    controller.click(alignAttr.translateX + 5, alignAttr.translateY + 5);


    assert.strictEqual(
        document.querySelector('.highcharts-contextmenu').firstChild.childNodes.length,
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

    assert.strictEqual(
        button.nodeName,
        'g',
        'Button is there'
    );

    var originalPost = Highcharts.post;

    try {

        var postData;

        Highcharts.post = function (url, data) {
            postData = data;
        };

        // Click it
        $(button).click();
        assert.strictEqual(
            postData.type,
            'image/png',
            'Posting for PNG'
        );
        assert.strictEqual(
            typeof postData.svg,
            'string',
            'SVG is posted'
        );

    } finally {

        Highcharts.post = originalPost;

    }

});