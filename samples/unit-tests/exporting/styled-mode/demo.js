QUnit.test("General exporting module tests with Styled Mode enabled.", function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            styledMode: true
        },

        defs: {
            glow: {
                tagName: 'filter',
                id: 'glow',
                children: [{
                    tagName: 'feGaussianBlur',
                    result: 'coloredBlur',
                    stdDeviation: 1
                }]
            }
        },

        series: [{
            data: [1, 2, 3]
        }]
    });

    var svg = chart.getSVG(),
        urls = svg.match(/url\(.*?\;?\)/g),
        matched = urls.filter(function (url) {
            return url.match(/\&quot;/);
        });

    assert.strictEqual(
        matched.length,
        0,
        "Exported chart CSS 'url' values does not have any unnecessary '&quot;' strings.",
    );
});