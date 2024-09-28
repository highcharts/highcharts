QUnit.test('Axis crossing', function (assert) {

    const chart = Highcharts.chart('container', {
        xAxis: {
            min: -5,
            max: 5,
            crossing: 1,
            tickInterval: 1
        },

        yAxis: {
            min: -5,
            max: 5,
            crossing: 1,
            lineWidth: 1,
            tickWidth: 1,
            tickInterval: 1
        },

        series: [
            {
                data: [0, 1, 2, 3]
            }
        ]
    });

    const verifyCrossing = () => {
        const xCrossing = chart.xAxis[0].options.crossing,
            yCrossing = chart.yAxis[0].options.crossing;

        let horiz = chart.xAxis[0].horiz;
        assert.strictEqual(
            chart.xAxis[0].axisLine.pathArray[0][horiz ? 2 : 1],
            chart.yAxis[0].ticks[xCrossing].mark.pathArray[0][horiz ? 2 : 1],
            'The y coordinate of x-axis line and tick mark should match at ' +
            xCrossing
        );

        horiz = chart.yAxis[0].horiz;
        assert.strictEqual(
            chart.yAxis[0].axisLine.pathArray[0][horiz ? 2 : 1],
            chart.xAxis[0].ticks[yCrossing].mark.pathArray[0][horiz ? 2 : 1],
            'The x coordinate of y-axis line and tick mark should match at ' +
            yCrossing
        );
    };

    verifyCrossing();

    // Asymmetric
    chart.update({
        xAxis: {
            min: -2
        },
        yAxis: {
            min: -2
        }
    });

    verifyCrossing();

    // Reversed
    chart.update({
        xAxis: {
            reversed: true
        },
        yAxis: {
            reversed: true
        }
    });

    verifyCrossing();

    // Inverted
    chart.update({
        chart: {
            inverted: true
        }
    });

    verifyCrossing();

});
