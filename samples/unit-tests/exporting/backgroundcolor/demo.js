
QUnit.test('Capture POST', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            backgroundColor: {
                linearGradient: [0, 0, 0, 300],
                stops: [
                    [0, '#ffffff'],
                    [1, '#e0e0e0']
                ]
            }
        },
        credits: {
            enabled: false
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }],
        navigation: {
            buttonOptions: {
                enabled: false
            }
        }
    });

    var originalPost = Highcharts.post;

    try {

        var postData;

        Highcharts.post = function (url, data) {
            postData = data;
        };

        // Run export width custom background
        chart.exportChart(null, {
            chart: {
                backgroundColor: '#ffeeff'
            }
        });
        assert.strictEqual(
            postData.type,
            'image/png',
            'Posting for PNG'
        );

        assert.strictEqual(
            typeof postData.svg,
            'string',
            'SVG is there'
        );

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

    } finally {

        Highcharts.post = originalPost;

    }

});
