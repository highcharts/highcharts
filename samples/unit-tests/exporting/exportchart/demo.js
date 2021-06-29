QUnit.test('Testing exportChart', function (assert) {
    var chart = Highcharts.chart('container', {
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
            filename: 'custom-file-name'
        }
    });

    var originalPost = Highcharts.Chart.prototype.post;

    try {
        var postData;

        Highcharts.Chart.prototype.post = function (url, data) {
            postData = data;
        };

        // Run export
        chart.exportChart();
        assert.strictEqual(postData.type, 'image/png', 'Posting for PNG');
        assert.strictEqual(
            postData.filename,
            'custom-file-name',
            'Custom filename'
        );
    } finally {
        Highcharts.Chart.prototype.post = originalPost;
    }
});
