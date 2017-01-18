$(function () {

    QUnit.test('Single touch drag should not zoom (#5790)', function (assert) {

        var chart = Highcharts.chart('container', {
            chart: {
                zoomType: 'xy',
                animation: false
            },
            series: [{
                type: 'line',
                data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                animation: false
            }]
        });
        var offset = Highcharts.offset(chart.container);

        Array.prototype.item = function (i) { // eslint-disable-line no-extend-native
            return this[i];
        };

        // Swipe across the plot area
        chart.pointer.onContainerTouchStart({
            type: 'touchstart',
            touches: [{
                pageX: offset.left + 100,
                pageY: offset.top + 100
            }],
            preventDefault: function () {}
        });

        chart.pointer.onContainerTouchMove({
            type: 'touchmove',
            touches: [{
                pageX: offset.left + 200,
                pageY: offset.top + 100
            }],
            preventDefault: function () {}
        });

        chart.pointer.onDocumentTouchEnd({
            type: 'touchend',
            touches: [{
                pageX: offset.left + 200,
                pageY: offset.top + 100
            }]
        });


        assert.strictEqual(
            typeof chart.resetZoomButton,
            'undefined',
            'Zoom button not created'
        );
    });
});