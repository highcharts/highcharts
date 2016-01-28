$(function () {
    QUnit.test('SplineSeries.getPointSpline', function (assert) {
        var getPointSpline = Highcharts.seriesTypes.spline.prototype.getPointSpline,
            segment = [{
                plotX: -5,
                plotY: 10
            }, {
                plotX: 240,
                plotY: 250
            }, {
                plotX: 510,
                plotY: 0
            }];

        function pathToString(arr) {
            return arr.join(' ');
        }

        assert.strictEqual(
            pathToString(getPointSpline(segment, segment[1], 1)),
            pathToString(['C', -5, 10, 142, 250, 240, 250]),
            'Path to point.1 is correct'
        );
        assert.strictEqual(
            pathToString(getPointSpline(segment, segment[2], 2)),
            pathToString(['C', 348, 250, 510, 0, 510, 0]),
            'Path to point.2 is correct'
        );
    });
});