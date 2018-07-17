QUnit.test('Axis showEmpty', function (assert) {

    var chart = Highcharts.chart('container', {

        title: {
            text: 'Y axis showEmpty demo'
        },

        subtitle: {
            text: 'Left axis shows even if Series 1 is hidden. Right axis does not show when Series 2 is hidden.'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        yAxis: [{
            lineWidth: 2
            // showEmpty: true // by default
        }, {
            lineWidth: 2,
            opposite: true,
            showEmpty: false
        }],

        series: [{
            data: [1, 3, 2, 4],
            yAxis: 0
        }, {
            data: [3, 2, 5, 4],
            yAxis: 1,
            visible: false
        }]
    });

    function isHidden() {
        return (
            chart.yAxis[1].axisTitle.attr('visibility') === 'hidden' &&
            chart.yAxis[1].axisLine.attr('visibility') === 'hidden'
        );
    }

    assert.ok(
        isHidden(),
        'Axis should be hidden when showEmpty is false and no data'
    );

    chart.yAxis[1].update({
        showEmpty: true
    });

    assert.notOk(
        isHidden(),
        'Axis should be visible when showEmpty is true and no data'
    );

    chart.series[1].update({
        visible: true
    });

    assert.notOk(
        isHidden(),
        'Axis should be visible when showEmpty is true and valid data'
    );

    chart.yAxis[1].update({
        showEmpty: false
    });

    assert.notOk(
        isHidden(),
        'Axis should be visible when showEmpty is false and valid data'
    );

});
