QUnit.test(
    'Legend events', function (assert) {
        let legendItemClickFlag = false;
        const chart = Highcharts.chart('container', {
                chart: {
                    type: 'area',
                    events: {
                        load: function () {
                            const renderer = this.renderer;
                            const size = 10;
            
                            for (let row = 0; row < size; row++) {
                                for (let col = 0; col < size; col++) {
                                    renderer.rect(col + 41, row + 17, 1, 1)
                                        .attr({
                                            class: `grid-point col-${col} row-${row}`,
                                            zIndex: 99,
                                            fill: '#000' // black color for the grid points
                                        })
                                        .add();
                                }
                            }

                            // 2nd grid around the real target
                            for (let row = 0; row < size; row++) {
                                for (let col = 0; col < size; col++) {
                                    renderer.rect(col + 149 - 5, row + 370 - 5, 1, 1)
                                        .attr({
                                            class: `grid-2-point col-${col} row-${row}`,
                                            zIndex: 99,
                                            fill: '#f00' // red color for the grid points
                                        })
                                        .add();
                                }
                            }
                        }
                    }
                },
                legend: {
                    useHTML: true
                },
                series: [{
                    name: 'Installation 1',
                    data: [1]
                }, {
                    name: 'Installation 2',
                    data: [2]
                }, {
                    name: 'Installation 3',
                    data: [3]
                }]
            }),
            test = TestController(chart),
            series = chart.series[0],
            legendGroup = chart.legend.group,
            bbox = series.legendItem.symbol.getBBox(true),
            seriesLegendGroup = series.legendItem.group,
            x = seriesLegendGroup.translateX +
                legendGroup.translateX +
                bbox.x +
                bbox.width / 2,
            y = seriesLegendGroup.translateY +
                legendGroup.translateY +
                bbox.y +
                bbox.height / 2;

        test.click(x, y, void 0, true);

        const chartOffset = Highcharts.offset(chart.container);
        let elem = document.elementFromPoint(
            x + chartOffset.left,
            y + chartOffset.top
        );
        // const htmlContent = document.documentElement.outerHTML;

        assert.strictEqual(
            chart.series[0].visible,
            false,
            `Hide series on legend item symbol click when useHTML: true
            (#6553).`
        );

        // Try to get more info
        assert.strictEqual(
            chartOffset,
            [x, chartOffset.left,
            y, chartOffset.top],
            'Logging chartOffset vs elementFromPoint [x,x_offset, y,y_offset]'
        );
        // assert.strictEqual(
        //     htmlContent,
        //     'htmlContent',
        //     'Logging htmlContent'
        // );
        // const hcEvents = series.legendItem.symbol.element.hcEvents;
        // assert.strictEqual(
        //     hcEvents,
        //     'hcEvents',
        //     'Logging hcEvents'
        // );
        // assert.strictEqual(
        //     hcEvents?.click?.[0].fn.toString(),
        //     'hcEvents click',
        //     'Logging hcEvents click'
        // );

        assert.strictEqual(
            elem,
            'legend item cover (~5,5)',
            'Logging elementFromPoint'
        );
        // Offset by the a11y proxy-container-after
        elem = document.elementFromPoint(
            chartOffset.left + 3.1 + 41,
            chartOffset.top + 3 + 17
        );
        assert.strictEqual(
            elem,
            'top grid target (3,3)',
            'Logging top grid target (3,3) elementFromPoint'
        );

        chart.legend.update({
            events: {
                itemClick: function () {
                    legendItemClickFlag = true;
                }
            }
        });

        assert.notEqual(
            chart.legend.options.events.itemClick,
            void 0,
            'Legend event item click should be created after update.'
        );

        test.click(x, y);

        assert.ok(
            legendItemClickFlag,
            'Legend item click configures in legend.events should fire.'
        );
    }
);
