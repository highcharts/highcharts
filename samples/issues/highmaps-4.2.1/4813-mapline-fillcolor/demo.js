$(function () {
    QUnit.test("Mapline should not have fill in hover state, unless fillColor directly set.", function (assert) {
        var chart = Highcharts.mapChart("container", {
                series: [{
                    type: "mapline",
                    data: [{
                        path: "M775,578 C820,550,600,250,573,285"
                    }]
                }, {
                    type: "mapline",
                    fillColor: "#ff00ff",
                    data: [{
                        path: "M275,278 C820,550,600,250,573,285"
                    }]
                }]
            }),
            p1 = chart.series[0].data[0],
            p2 = chart.series[1].data[0];

        p1.setState("hover");
        p2.setState("hover");

        assert.strictEqual(
            p1.graphic.attr("fill"),
            "none",
            "No fill - ok"
        );

        assert.ok(
            p2.graphic.attr("fill"),
            "#ff00ff",
            "Fill for path is set"
        );
    });
});