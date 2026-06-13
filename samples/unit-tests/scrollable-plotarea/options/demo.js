QUnit.test('fixedRenderer options', function (assert) {
    var chart = new Highcharts.Chart('container', {
        chart: {
            type: 'spline',
            style: {
                fontFamily: 'Papyrus'
            },
            scrollablePlotArea: {
                minWidth: 2000,
                scrollPositionX: 0,
                scrollPositionY: 0
            }
        },
        series: [
            {
                name: 'Hestavollane',
                data: [
                    0.2,
                    0.8,
                    0.8,
                    0.8,
                    1,
                    1.3,
                    1.5,
                    2.9,
                    1.9,
                    2.6,
                    1.6,
                    3,
                    4,
                    3.6,
                    5.5,
                    6.2,
                    5.5,
                    4.5,
                    4,
                    3.1,
                    2.7,
                    4,
                    2.7,
                    2.3,
                    2.3,
                    4.1,
                    7.7,
                    7.1,
                    5.6,
                    6.1,
                    5.8,
                    8.6,
                    7.2,
                    9,
                    10.9,
                    11.5,
                    11.6,
                    11.1,
                    12,
                    12.3,
                    10.7,
                    9.4,
                    9.8,
                    9.6,
                    9.8,
                    9.5,
                    8.5,
                    7.4,
                    7.6
                ]
            }
        ]
    });
    assert.equal(
        chart.scrollablePlotArea.fixedRenderer.style.fontFamily,
        chart.options.chart.style.fontFamily,
        'fixedRenderer should inherit style from options'
    );
});

QUnit.test(
    'Scrollable plot area keeps native scrollbars inside chart, #24416',
    function (assert) {
        const data = [1, 3, 2],
            getScrollbarHeight = scrollingContainer => (
                scrollingContainer.offsetHeight -
                scrollingContainer.clientHeight
            ),
            getScrollbarWidth = scrollingContainer => (
                scrollingContainer.offsetWidth -
                scrollingContainer.clientWidth
            ),
            chart = Highcharts.chart('container', {
                chart: {
                    scrollablePlotArea: {
                        minWidth: 2000
                    }
                },
                series: [{
                    data
                }]
            });

        let scrollingContainer =
                chart.scrollablePlotArea.scrollingContainer;
        const scrollbarHeight = getScrollbarHeight(scrollingContainer);

        assert.strictEqual(
            scrollingContainer.offsetHeight,
            chart.chartHeight,
            'Horizontal scrolling container should not exceed chart height'
        );

        if (scrollbarHeight) {
            const creditsBox =
                    chart.credits.element.getBoundingClientRect(),
                scrollingBox = scrollingContainer.getBoundingClientRect();

            assert.ok(
                creditsBox.bottom <=
                    scrollingBox.top + scrollingContainer.clientHeight + 1,
                'Credits should not overlap the horizontal scrollbar'
            );
        } else {
            assert.ok(true, 'No non-overlay horizontal scrollbar');
        }

        chart.update({
            chart: {
                scrollablePlotArea: {
                    minWidth: null,
                    minHeight: 1000
                },
                type: 'bar',
                marginRight: 30
            },
            xAxis: {
                categories: ['A', 'B', 'C'],
                title: {
                    text: null
                }
            },
            yAxis: {
                lineWidth: 1,
                title: {
                    text: 'Votes',
                    align: 'high'
                },
                showLastLabel: false
            },
            series: [{
                type: 'bar',
                data
            }]
        }, true, true);

        scrollingContainer =
            chart.scrollablePlotArea.scrollingContainer;

        const scrollbarWidth = getScrollbarWidth(scrollingContainer);

        assert.strictEqual(
            scrollingContainer.offsetWidth,
            chart.chartWidth,
            'Vertical scrolling container should not exceed chart width'
        );

        if (scrollbarWidth) {
            const creditsBox =
                    chart.credits.element.getBoundingClientRect(),
                axisTitleBox =
                    chart.yAxis[0].axisTitle.element
                        .getBoundingClientRect(),
                scrollingBox = scrollingContainer.getBoundingClientRect();

            assert.ok(
                creditsBox.right <=
                    scrollingBox.left +
                    scrollingContainer.clientWidth + 1,
                'Credits should not overlap the vertical scrollbar'
            );
            assert.ok(
                axisTitleBox.right <=
                    scrollingBox.left +
                    scrollingContainer.clientWidth + 1,
                'Axis title should not overlap the vertical scrollbar'
            );
        } else {
            assert.ok(true, 'No non-overlay vertical scrollbar');
        }
    }
);
