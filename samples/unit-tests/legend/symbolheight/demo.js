QUnit.test(
    'Legend symbol marker should not exceed symbolHeight (#6202)',
    function (assert) {
        const url =
            location.host.substr(0, 12) === 'localhost:98' ?
                'url(base/test/testimage.png)' : // karma
                'url(testimage.png)', // utils
            chart = Highcharts.chart('container', {
                series: [
                    {
                        data: [1, 3, 2, 4],
                        marker: {
                            radius: 20
                        }
                    },
                    {
                        data: [2, 4, 3, 5],
                        marker: {
                            symbol: url.replace(')', '?' + Date.now() + ')')
                        }
                    }
                ]
            });

        assert.strictEqual(
            Math.round(
                chart.series[0].legendItem.symbol
                    .getBBox().height
            ),
            Math.round(chart.legend.symbolHeight),
            'Legend symbol is reduced to symbolHeight'
        );

        assert.strictEqual(
            Math.round(
                chart.series[1].legendItem.symbol
                    .getBBox().height
            ),
            Math.round(chart.legend.symbolHeight),
            'Legend image is reduced to symbolHeight'
        );

        chart.series[0].update({
            type: 'column'
        }, false);

        chart.update({
            legend: {
                symbolHeight: 0
            }
        });

        assert.strictEqual(
            chart.series[0].legendItem.symbol.height,
            void 0,
            `There should be no symbol when legend.symbolHeight is set to 0
            for column chart (squareSymbol is set to true) (#16514).`
        );

        chart.update({
            legend: {
                symbolWidth: 0
            }
        });

        assert.strictEqual(
            chart.series[1].legendItem.symbol,
            void 0,
            `There should be no symbol when legend.symbolWidth is set to 0
            for line chart.`
        );

        const newColor = '#ff0000';

        chart.update({
            legend: {
                symbolWidth: 10,
                symbolHeight: 10
            }
        }, false);

        chart.series[0].update({
            legendColor: newColor
        });

        assert.strictEqual(
            chart.series[0].legendItem.symbol.attr('fill'),
            newColor,
            'First symbol should be red when series.legendColor is set to red.'
        );

        chart.series[0].update({
            legendColor: undefined
        });

        assert.strictEqual(
            chart.series[0].legendItem.symbol.attr('fill'),
            chart.options.colors[0],
            `First symbol should be set to default color when 
            series.legendColor is undefined.`
        );

        chart.addSeries({
            type: 'pie',
            data: [
                {
                    name: 'Point 1',
                    y: 20,
                    legendColor: newColor
                }
            ],
            center: ['10%', '20%'],
            size: 60,
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        });

        assert.strictEqual(
            chart.series[2].points[0].legendItem.symbol.attr('fill'),
            newColor,
            `First symbol of pie series should be red when 
            series.legendColor is set to red.`
        );

        chart.series[2].data[0].update({
            legendColor: undefined
        });

        assert.strictEqual(
            chart.series[2].points[0].legendItem.symbol.attr('fill'),
            chart.options.colors[0],
            `First symbol of pie series should be set to default color when 
            series.legendColor is undefined.`
        );
    }
);
