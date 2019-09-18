QUnit.test('Test dynamic behaviour of Scrollable PlotArea', function (assert) {

    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            scrollablePlotArea: {
                minWidth: 2000,
                scrollPositionX: 1
            }
        }
    });

    chart.setTitle({ text: 'New title' });

    assert.equal(
        chart.title.element.parentNode.parentNode.classList.contains('highcharts-fixed'),
        true,
        'Title should be outside the scrollable plot area (#11966)'
    );
});
