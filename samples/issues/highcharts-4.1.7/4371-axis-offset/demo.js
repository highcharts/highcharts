$(function () {
    QUnit.test("Axis offsets - test series clips." , function (assert) {
        var chart = $('#container').highcharts({
                xAxis: {
                    offset: -150
                },
                yAxis: {
                    offset: -150
                },
                series: [{
                    data: [
                        [-3, 3],
                        [-2, 2],
                        [-1, 1],
                        [0, 0],
                        [1, 1],
                        [2, 2],
                        [3, 3]
                    ]
                }]
            }).highcharts(),
            clipID = chart.series[0].group.attr("clip-path"),
            clipElement = document.querySelectorAll(clipID.substring(4, clipID.length - 1) + ' rect')[0],
            clip = {
                width: clipElement.getAttribute("width"),
                height: clipElement.getAttribute("height"),
                id: clipID
            };

        assert.strictEqual(
            chart.plotWidth === parseInt(clip.width, 10) &&
            chart.plotHeight === parseInt(clip.height, 10),
            true,
            "CLip path has proper width and height"
        );
    });

});
