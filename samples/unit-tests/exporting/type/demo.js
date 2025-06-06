QUnit.test('Test type option with exportChart', async function (assert) {
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
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            exporting: {
                type: 'image/jpeg'
            }
        }),
        postData;

    var originalPost = Highcharts.HttpUtilities.post;

    try {
        Highcharts.HttpUtilities.post = function (url, data) {
            postData = data;
        };

        // Run export
        await chart.exporting.exportChart({
            type: 'application/pdf'
        });
        assert.strictEqual(postData.type, 'application/pdf', 'Posting for JPG');
    } finally {
        Highcharts.HttpUtilities.post = originalPost;
    }
});
