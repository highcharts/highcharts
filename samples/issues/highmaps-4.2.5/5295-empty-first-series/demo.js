$(function () {
    QUnit.test("Empty first series in map should render without problems", function (assert) {
        var chart = Highcharts.mapChart("container", {
            colorAxis: {
                min: 0,
                minColor: "#EFEFFF",
                maxColor: "#102D4C"
            },
            series : [{}, {
                data: [{
                    "hc-key": "au-nt",
                    "value": 0
                }],
                mapData: Highcharts.maps['countries/au/au-all'],
                joinBy: 'hc-key'
            }]
        });

        assert.strictEqual(chart.series[1].points[0].color, 'rgb(128,142,166)', 'Color has been set correctly');
    });
});
