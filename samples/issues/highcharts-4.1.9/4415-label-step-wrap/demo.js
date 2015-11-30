
$(function () {
    QUnit.test('Labels should be wrapped', function (assert) {
        var chart = $("#container").highcharts({
            chart: {
                type: 'column',
                marginTop: 80,
                marginRight: 40
            },

            title: {
                text: 'Total fruit consumption, grouped by gender'
            },

            xAxis: {
                categories: ['Large Apples', 'Long Oranges', 'Posh Pears', 'Ransid Grapes', 'Clever Bananas', 'Bording Tomatos', 'Jolly Cabbage', 'Small Plumps', 'Wierd Apricots'],
                labels: {
                    step: 1
                }
            },

            yAxis: {
                allowDecimals: false,
                min: 0,
                title: {
                    text: 'Number of fruits'
                }
            },

            tooltip: {
                headerFormat: '<b>{point.key}</b><br>',
                pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y} / {point.stackTotal}'
            },

            plotOptions: {
                bar: {
                    depth: 40
                }
            },

            series: [{
                name: 'John',
                data: [5, 3, 4, 7, 2, 2, 7, 8, 4]
            }, {
                name: 'Joe',
                data: [3, 4, 4, 2, 5, 4, 3, 5, 3]
            }, {
                name: 'Jane',
                data: [2, 5, 6, 2, 1, 4, 5, 3, 6]
            }, {
                name: 'Janet',
                data: [3, 0, 4, 4, 3, 2, 3, 1, 3]
            }]
        }).highcharts();

        var xAxis = chart.xAxis[0],
            box0 = xAxis.ticks[xAxis.tickPositions[0]].label.getBBox(true),
            box1 = xAxis.ticks[xAxis.tickPositions[1]].label.getBBox(true);

        assert.equal(
            box0.x + box0.width <= box1.x,
            true,
            'No overlap'
        );
    });
});