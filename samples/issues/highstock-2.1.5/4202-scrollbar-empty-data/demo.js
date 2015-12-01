$(function () {

    QUnit.test('Update to non-ordinal', function (assert) {

        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container'
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            scrollbar: {
                enabled: true
            }
        });


        // In an ordinal axis, the point distance is the same even though the actual time distance is
        // different.
        assert.equal(
            typeof chart.scroller.scrollbarGroup,
            'undefined',
            'No scrollbar group generated'
        );
    });
});