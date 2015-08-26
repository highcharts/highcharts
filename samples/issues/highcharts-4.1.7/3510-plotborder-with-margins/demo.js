$(function () {
    QUnit.test("PlotBorder shouldn't move during redraws" , function (assert) {
        var basicPosition, 
            i = 10,
            chart_2, 
            chart = $("#container_3510").highcharts({
                chart: {
                    plotBorderWidth: 1,
                    marginLeft: 0
                },
                series: [{
                    data: [10, 20]
                }]
            }).highcharts();

        // When initialized, plotBorder has proper position
        basicPosition = {
            x: chart.plotBorder.x,
            y: chart.plotBorder.y,
            width: chart.plotBorder.width,
            height: chart.plotBorder.height
        };


        // Add a couple of points. Event when plotLeft == 0, plotBorder shouldn't move for each redraw
        while(i--) {
            chart.series[0].addPoint(Math.random(), true, false, false);
        }

        assert.strictEqual(
            basicPosition.x === chart.plotBorder.x &&
            basicPosition.y === chart.plotBorder.y &&
            basicPosition.width === chart.plotBorder.width &&
            basicPosition.height === chart.plotBorder.height,
            true, 
            "PlotBorder aligned - #3510"
        );

        chart_2 = $('#container_3282').highcharts({
            chart: {
                plotBorderWidth: 1
            },
            series: [{
                name: 'Tokyo',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }, {
                name: 'New York',
                data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
            }]
        }).highcharts();

        // hide series to redraw "y" position for the plotBorder
        chart_2.series[0].hide();

        basicPosition = {
            y: chart.plotBorder.y,
            height: chart.plotBorder.height
        };

        assert.strictEqual(
            basicPosition.y === chart.plotBorder.y &&
            basicPosition.height === chart.plotBorder.height,
            true, 
            "PlotBorder aligned - #3282"
        );
    });
});