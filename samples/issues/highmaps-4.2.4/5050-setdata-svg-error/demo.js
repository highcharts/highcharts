$(function () {
    QUnit.test("Using setData with allAreas=true should not cause errors", function (assert) {
        assert.expect(0);
        var chart = Highcharts.mapChart("container", {
            series: [{
                data: [],
                mapData: Highcharts.maps['custom/world-palestine-highres'],
                joinBy: 'hc-key'
            }]
        });

        chart.series[0].setData([{
            "hc-key": "in",
            "value": 10000
        }]);
    });
});
