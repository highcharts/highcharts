QUnit.test('Exported SVG characteristics', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            backgroundColor: {
                linearGradient: [0, 0, 0, 300],
                stops: [
                    [0, '#ffffff'],
                    [1, '#e0e0e0']
                ]
            },
            width: 600
        },
        credits: {
            enabled: false
        },
        accessibility: {
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
        navigation: {
            buttonOptions: {
                enabled: false
            }
        }
    });

    var originalPost = Highcharts.HttpUtilities.post;

    try {
        var postData;

        Highcharts.HttpUtilities.post = function (url, data) {
            postData = data;
        };

        // Run export width override options
        chart.exportChart(null, {
            chart: {
                backgroundColor: '#ffeeff'
            }
        });

        assert.strictEqual(postData.type, 'image/png', 'Posting for PNG');

        assert.strictEqual(typeof postData.svg, 'string', 'SVG is there');

        assert.strictEqual(
            postData.svg.indexOf('linearGradient'),
            -1,
            'Gradient is gone'
        );

        assert.notEqual(
            postData.svg.indexOf('#ffeeff'),
            -1,
            'Solid background is there'
        );


        // Test overrides for min and max (#7873)
        chart.xAxis[0].setExtremes(1, 5);
        chart.exportChart();
        assert.notEqual(
            postData.svg.indexOf('Jul'),
            -1,
            'No overrides, July should be within bounds'
        );
        assert.strictEqual(
            postData.svg.indexOf('Aug'),
            -1,
            'No overrides, August should be outside bounds'
        );

        chart.exportChart(void 0, {
            xAxis: {
                min: undefined,
                max: undefined
            }
        });
        assert.notEqual(
            postData.svg.indexOf('Jul'),
            -1,
            'No overrides, July should be within bounds'
        );
        assert.notEqual(
            postData.svg.indexOf('Aug'),
            -1,
            'No overrides, Dec should be within bounds'
        );

    } finally {
        Highcharts.HttpUtilities.post = originalPost;
    }
});
