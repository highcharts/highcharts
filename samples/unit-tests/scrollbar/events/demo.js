QUnit.test('#6334 - double afterSetExtremes for scrollbar and navigator', function (assert) {
    var done = assert.async(),
        counter = 0,
        options = {
            xAxis: {
                minRange: 0.01,
                min: 3,
                max: 3.05,
                events: {
                    afterSetExtremes: function () {
                        counter++;
                    }
                }
            },
            rangeSelector: {
                enabled: false
            },
            navigator: {
                adaptToUpdatedData: false
            },
            scrollbar: {
                liveRedraw: false
            },
            series: [{
                data: [4, 20, 100, 5, 2, 33, 12, 23]
            }]
        },
        chart = Highcharts.stockChart('container', options),
        controller = TestController(chart),
        scrollbar = chart.navigator.scrollbar,
        group = scrollbar.group,
        thumbGroup = scrollbar.scrollbarGroup,
        thumb = scrollbar.scrollbar,
        thumbBox = thumb.getBBox(),
        x = group.translateX + thumbGroup.translateX + thumbBox.width / 2,
        y = group.translateY + thumbGroup.translateY + thumbBox.height / 2;

    controller.pan([x, y], [x + 90, y]);

    setTimeout(function () {
        assert.strictEqual(
            counter,
            1,
            'afterSetExtremes called just once'
        );
        done();
    }, 5);
});

QUnit.test('#1716 - very small range in navigator and scrollbar events', function (assert) {
    var done = assert.async(),
        min = 3,
        max = 3.000002,
        options = {
            xAxis: {
                minRange: 0.000001,
                min: min,
                max: max
            },
            rangeSelector: {
                enabled: false
            },
            series: [{
                data: [4, 20, 100, 5, 2, 33, 12, 23]
            }]
        },
        chart = Highcharts.stockChart('container', options),
        controller = TestController(chart),
        scrollbar = chart.navigator.scrollbar,
        group = scrollbar.group,
        extremes;

    controller.click(
        group.translateX + 5,
        group.translateY + 5
    );

    setTimeout(function () {
        extremes = chart.xAxis[0].getExtremes();
        assert.strictEqual(
            min > extremes.min && max > extremes.max,
            true,
            'Scrollbar moved to the left'
        );
        done();
    }, 5);
});