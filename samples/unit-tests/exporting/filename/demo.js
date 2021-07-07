QUnit.test('Default file name from title', function (assert) {
    function fn(title) {
        return Highcharts.Chart.prototype.getFilename.call({
            options: {
                exporting: {}
            },
            userOptions: {
                title: title
            }
        });
    }

    assert.strictEqual(fn({ text: 'Hello' }), 'hello', 'Basic title');

    assert.strictEqual(fn(undefined), 'chart', 'Undefined title');
    assert.strictEqual(fn({ text: undefined }), 'chart', 'Undefined text');
    assert.strictEqual(fn({ text: 0 }), 'chart', 'Text is number');
    assert.strictEqual(fn({ text: 'Hi' }), 'chart', 'Text is too short');
    assert.strictEqual(
        fn({ text: 'The quick brown fox jumps over the lazy dog' }),
        'the-quick-brown-fox-jump',
        'Text is shortened'
    );
    assert.strictEqual(
        fn({ text: 'ÆÅ$# Some English $$$%%999' }),
        'some-english-999',
        'None-latin characters are removed'
    );

    assert.strictEqual(
        fn({ text: '---- Chart Title ---' }),
        'chart-title',
        'Trimming of dashes'
    );

    assert.strictEqual(
        fn({ text: '<span style="color:red">HTML is stripped</span>' }),
        'html-is-stripped',
        'HTML is stripped'
    );
});

QUnit.test('POST filename', function (assert) {
    var chart = Highcharts.chart('container', {
        title: {
            text: 'Exports a pdf with name: my-pdf'
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

        // Run export width custom file name
        chart.exportChart({
            type: 'application/pdf',
            filename: 'my-pdf'
        });
        assert.strictEqual(postData.type, 'application/pdf', 'Posting for PDF');

        assert.strictEqual(
            postData.filename,
            'my-pdf',
            'File name came through'
        );

        // Run export width custom file name
        chart.exportChart({
            type: 'application/pdf',
            filename: 'lorem/ipsum'
        });

        assert.strictEqual(
            postData.filename,
            'lorem-ipsum',
            'Forward slash in filename was replaced'
        );
    } finally {
        Highcharts.HttpUtilities.post = originalPost;
    }
});

QUnit.test('Filename option', assert => {
    const chart = title =>
        Highcharts.chart('container', {
            title: {
                text: 'Title text'
            },
            exporting: {
                filename: title
            }
        });

    assert.strictEqual(
        chart('Medical/Dental office').getFilename(),
        'Medical-Dental office',
        'Forward slash should be replaced with dash'
    );
});
