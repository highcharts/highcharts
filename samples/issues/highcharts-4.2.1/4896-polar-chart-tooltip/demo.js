
$(function () {
    QUnit.test("Non shared tooltip on polar chart - tooltip for first point should work." , function (assert) {
        var chart = $('#container').highcharts({
                "chart": {
                  "polar": true
                },
                "tooltip": {
                  "shared": false,
                },
                "plotOptions": {
                  "series": {
                    "threshold": null
                  }
                },
                "xAxis": {
                  "categories": [],
                  "tickmarkPlacement": "on"
                },
                "series": [{
                  "data": [49300, 30000, 50100, 130101, 80100, 2000070.21, 20000, 160100, 334845, 430100, 274200, 98000],
                  "pointPlacement": "on"
                }, {
                  "data": [2000070.21, 2000070.21, 2000070.21, 2000070.21, 2000070.21, 2000070.21, 2000070.21, 2000070.21, 2000070.21, 2000070.21, 2000070.21, 2000070.21],
                  "pointPlacement": "on"
                }]
              }).highcharts(),
            offset = $("#container").offset(),
            series = chart.series[1],
            point = series.points[0],
            x = offset.left + point.plotX + chart.plotLeft,
            y = offset.top + chart.plotTop + 5;

        chart.pointer.onContainerMouseMove({ 
            pageX: x, 
            pageY: y + chart.plotHeight - 15, // to the bottom
            target: point.graphic.element 
        });

        chart.pointer.onContainerMouseMove({ 
            pageX: x, 
            pageY: y, // from the top 
            target: point.graphic.element 
        });

        assert.strictEqual(
            chart.hoverPoints.indexOf(point) >= 0,
            true,
            "Proper hovered point.");
    });
});