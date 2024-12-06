QUnit.test('Crisp', assert => {

    const chart = Highcharts.chart('container', {
        chart: {
            marginLeft: 64,
            width: 600
        },
        title: {
            text: 'Pixel perfection test'
        },
        subtitle: {
            text: 'Horizontally scaled for visual inspection'
        },
        series: [{
            type: 'scatter',
            data: [10, 10, 10, 10, 10, 10, 10],
            marker: {
                symbol: 'diamond',
                radius: 5
            },
            name: 'scatter'
        }, {
            type: 'errorbar',
            name: 'error',
            whiskerLength: 0,
            data: [{
                high: 20,
                low: 10
            }, {
                high: 20,
                low: 10
            }, {
                high: 20,
                low: 10
            }, {
                high: 20,
                low: 10
            }, {
                high: 20,
                low: 10
            }, {
                high: 20,
                low: 10
            }, {
                high: 20,
                low: 10
            }]
        }, {
            type: 'column',
            name: 'column',
            pointWidth: 1,
            borderWidth: 0,
            data: [10, 10, 10, 10, 10, 10, 10]
        }],
        xAxis: {
            gridLineWidth: 1,
            tickInterval: 1
        }
    });

    const testWidth = width => {
        if (width) {
            chart.setSize(width);
        } else {
            width = chart.chartWidth;
        }
        for (let i = 0; i < 7; i++) {
            const rawPixelX = chart.xAxis[0].toPixels(i),
                gridLineCenter = Number(
                    chart.xAxis[0].ticks[i].gridLine.d.split(' ')[1]
                ),
                scatterCenter = chart.plotLeft +
                    Number(chart.series[0].points[i].graphic.d.split(' ')[1]),
                columnCenter = chart.plotLeft +
                    chart.series[2].points[i].shapeArgs.x +
                    chart.series[2].points[i].shapeArgs.width / 2,
                errorbarCenter = chart.plotLeft +
                    Number(chart.series[1].points[i].stem.d.split(' ')[1]);

            assert.close(
                gridLineCenter,
                rawPixelX,
                0.501,
                `At width=${width}, i=${i}, grid line center should be no more
                than 0.5 pixels off raw pixel x`
            );

            assert.close(
                scatterCenter,
                rawPixelX,
                0.501,
                `At width=${width}, i=${i}, scatter center should be no more
                than 0.5 pixels off raw pixel x`
            );

            assert.close(
                columnCenter,
                rawPixelX,
                0.501,
                `At width=${width}, i=${i}, column center should be no more
                than 0.5 pixels off raw pixel x`
            );

            assert.close(
                errorbarCenter,
                rawPixelX,
                0.501,
                `At width=${width}, i=${i}, errorbar center should be no more
                than 0.5 pixels off raw pixel x`
            );

            assert.strictEqual(
                errorbarCenter,
                columnCenter,
                `At width=${width}, i=${i}, errorbar center should be the same
                as column center`
            );

        }
    };

    testWidth();
    testWidth(500);
    testWidth(400);
});