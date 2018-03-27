
QUnit.test('Export buttons', function (assert) {

    var chart = Highcharts
        .chart('container', {

            credits: {
                enabled: false
            },

            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },

            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
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
    $(button).click();
    assert.strictEqual(
        document.querySelector('.highcharts-contextmenu').firstChild.childNodes.length,
        2,
        'Two menu items'
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