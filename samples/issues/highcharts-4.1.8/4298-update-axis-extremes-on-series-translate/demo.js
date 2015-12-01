$(function () {
    QUnit.test("Axis extremes should be reset after updated data." , function (assert) {
        var chart = $('#container').highcharts({
                series: [{
                    type: "treemap",
                    layoutAlgorithm: 'squarified',
                    allowDrillToNode: true,
                    data: [{
                        id: "A"
                    }, {
                        id: "B",
                        value: 2
                    }, {
                        id: "A1",
                        parent: "A",
                        value: 1
                    }]
                }]
            }).highcharts(),
            series = chart.series[0],
            extremesX,
            extremesY,
            root;

        // Actions
        series.drillToNode("A");
        series.addPoint({
            id: "A2",
            parent: "A",
            value: 1
        });
        root = series.nodeMap[series.rootNode].pointValues;
        extremesX = series.xAxis.getExtremes();
        extremesY = series.yAxis.getExtremes();

        // Tests
        assert.strictEqual(series.rootNode, "A", "Root node is updated to A");
        assert.strictEqual(root.x, extremesX.min, "xAxis.min equals root.x");
        assert.strictEqual(root.x + root.width, extremesX.max, "xAxis.max equals root.x + root.width");
        assert.strictEqual(root.y, extremesY.min, "yAxis.min equals root.y");
        assert.strictEqual(root.y + root.height, extremesY.max, "yAxis.max equals root.y + root.height");
    });
});
