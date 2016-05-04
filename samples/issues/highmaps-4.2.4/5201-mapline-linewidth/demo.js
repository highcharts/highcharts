$(function () {
    QUnit.test("Setting lineWidth of mapline series should work in all browsers", function (assert) {
        var chart = Highcharts.mapChart("container", {
                series: [{
                    type: 'mapline',
                    data: Highcharts.geojson(Highcharts.maps['countries/us/custom/us-small'], 'mapline'),
                    lineWidth: 30
                }]
            }),
            groupStroke = chart.series[0].group.element.getAttribute('stroke-width'),
            pointStroke = chart.series[0].points[0].graphic.element.getAttribute('stroke-width');

        assert.strictEqual(
            pointStroke === '30' ||
            pointStroke === 'inherit' && groupStroke === '30',
            true,
            'lineWidth has been set'
        );
    });
});
