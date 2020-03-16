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


QUnit.test('Responsive scrollable plot area (#12991)', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            scrollablePlotArea: {
                minHeight: 400
            },
            height: 300
        },
        series: [{
            data: [1]
        }]
    });

    chart.setSize(null, 500);

    var scrolling = document.getElementsByClassName('highcharts-scrolling')[0];
    console.log('Test: ' + (scrolling.clientHeight > 300));

    assert.ok(
        document.getElementsByClassName('highcharts-scrolling')[0].clientHeight > 300,
        'The scrollbar should disasppear after increasing the height of the chart (#12991)'
    );
});
