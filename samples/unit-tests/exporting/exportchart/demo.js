QUnit.test('Testing exportChart', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 400,
            height: 300
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
        yAxis: {
            title: {
                useHTML: true
            }
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
            filename: 'custom-file-name',
            allowHTML: true
        }
    });

    var originalPost = Highcharts.HttpUtilities.post;

    try {
        var postData;

        Highcharts.HttpUtilities.post = function (url, data) {
            postData = data;
        };

        // Run export
        chart.exportChart();

        // Assert
        assert.strictEqual(postData.type, 'image/png', 'Posting for PNG');

        assert.strictEqual(
            postData.filename,
            'custom-file-name',
            'Custom filename'
        );

        assert.ok(
            /foreignObject/.test(postData.svg),
            'The generated SVG should contain a foreignObjet'
        );

        assert.notOk(
            /NaN/.test(postData.svg),
            'The generated SVG should not contain NaN (17498)'
        );

    } finally {
        Highcharts.HttpUtilities.post = originalPost;
    }
});
