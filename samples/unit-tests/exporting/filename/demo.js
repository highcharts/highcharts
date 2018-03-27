
QUnit.test('POST filename', function (assert) {
    var chart = Highcharts
        .chart('container', {
            title: {
                text: 'Exports a pdf with name: my-pdf'
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


        // Run export width custom file name
        chart.exportChart({
            type: 'application/pdf',
            filename: 'my-pdf'
        });
        assert.strictEqual(
            postData.type,
            'application/pdf',
            'Posting for PDF'
        );

        assert.strictEqual(
            postData.filename,
            'my-pdf',
            'File name came through'
        );

    } finally {

        Highcharts.post = originalPost;

    }


});
