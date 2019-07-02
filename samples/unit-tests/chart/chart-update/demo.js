/* eslint func-style:0 */
(function () {

    function getConfig() {
        return {
            chart: {
                type: 'column',
                animation: false,
                height: 300
            },

            series: [{
                data: [1, 3, 2, 4],
                name: 'First'
            }, {
                data: [5, 3, 4, 1],
                name: 'Last'
            }]
        };
    }

    QUnit.test('Credits update', function (assert) {
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], getConfig());

        chart.update({
            credits: {
                enabled: false
            }
        });

        assert.strictEqual(
            chart.credits,
            undefined,
            'Credits removed'
        );

        chart.update({
            credits: {
                text: 'Updated chart'
            }
        });

        assert.strictEqual(
            chart.credits,
            undefined,
            'Still removed'
        );

        chart.update({
            credits: {
                enabled: true
            }
        });

        assert.strictEqual(
            chart.credits.element.textContent,
            'Updated chart',
            'Stepwise update'
        );
    });

    QUnit.test('Legend update', function (assert) {
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], getConfig());

        assert.ok(
            chart.legend.group.translateX < chart.chartWidth / 2,
            'Legend is centered'
        );
        chart.update({
            legend: {
                align: 'right',
                verticalAlign: 'middle',
                layout: 'vertical'
            }
        });
        assert.ok(
            chart.legend.group.translateX > chart.chartWidth / 2,
            'Legend is to the right of the middle'
        );


        chart.update({
            legend: {
                itemStyle: {
                    color: 'gray'
                }
            }
        });
        assert.strictEqual(
            chart.series[0].legendItem.styles.fill,
            'gray',
            'Text color is updated'
        );
    });

    QUnit.test('Title update', function (assert) {
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], getConfig());

        chart.update({
            title: {
                text: ''
            }
        });

        assert.strictEqual(
            chart.title.element.textContent,
            '',
            'Empty title (#6934)'
        );

        chart.update({
            title: {
                text: 'Updated title'
            }
        });

        assert.strictEqual(
            chart.title.element.textContent,
            'Updated title',
            'Updated title'
        );

    });

    QUnit.test('Subtitle update', function (assert) {
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], getConfig());

        chart.update({
            subtitle: {
                text: 'Updated subtitle'
            }
        });

        assert.strictEqual(
            chart.subtitle.element.textContent,
            'Updated subtitle',
            'Updated subtitle'
        );

    });

    QUnit.test('Colors update', function (assert) {
        var chart = Highcharts.chart(
            $('<div>').appendTo('#container')[0],
            Highcharts.merge(getConfig(), {
                title: {
                    text: 'Colors update'
                }
            })
        );

        chart.update({
            colors: ['#68266f', '#96a537', '#953255', '#679933']
        });

        assert.strictEqual(
            chart.series[0].color,
            '#68266f',
            'Color updated'
        );
    });

    QUnit.test('Loading update', function (assert) {
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], getConfig());

        chart.update({
            loading: {
                showDuration: 0,
                style: {
                    background: 'black'
                },
                labelStyle: {
                    color: 'white'
                }
            }
        });
        chart.showLoading();
        assert.strictEqual(
            chart.loadingDiv.style.background.substr(0, 5), // Firefox adds more
            'black',
            'Background OK'
        );
        assert.strictEqual(
            chart.loadingSpan.style.color,
            'white',
            'Font color ok'
        );

        chart.update({
            loading: {
                showDuration: 0,
                style: {
                    background: 'white'
                },
                labelStyle: {
                    color: 'black'
                }
            }
        });
        chart.showLoading();

        assert.strictEqual(
            chart.loadingDiv.style.background.substr(0, 5), // Firefox adds more
            'white',
            'Background OK'
        );
        assert.strictEqual(
            chart.loadingSpan.style.color,
            'black',
            'Font color ok'
        );

        chart.hideLoading();

    });

    QUnit.test('Exporting update', function (assert) {
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], getConfig());

        chart.update({
            exporting: {
                buttons: {
                    contextButton: {
                        width: 36,
                        height: 36,
                        symbolStroke: 'blue',
                        symbolSize: 26,
                        symbolX: 18,
                        symbolY: 18
                    }
                }
            }
        });
        assert.strictEqual(
            chart.container.querySelector('.highcharts-contextbutton .highcharts-button-symbol').getAttribute('stroke'),
            'blue',
            'Stroke is updated'
        );

        chart.update({
            exporting: {
                enabled: false
            }
        });

        assert.strictEqual(
            chart.container.querySelector('.highcharts-contextbutton .highcharts-button-symbol'),
            null,
            'Button is removed'
        );

        chart.update({
            exporting: {
                enabled: true,
                buttons: {
                    contextButton: {
                        width: 24,
                        height: 24,
                        symbolStroke: 'blue',
                        symbolSize: 14,
                        symbolX: 12,
                        symbolY: 12
                    }
                }
            }
        });

        assert.strictEqual(
            typeof chart.container.querySelector('.highcharts-contextbutton .highcharts-button-symbol'),
            'object',
            'Button is revived'
        );
    });

    QUnit.test('Plot options update', function (assert) {
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], getConfig());

        chart.update({
            plotOptions: {
                column: {
                    colorByPoint: true
                }
            }
        });
        assert.notEqual(
            chart.series[0].points[0].graphic.attr('fill'),
            chart.series[0].points[1].graphic.attr('fill'),
            'Color by point took effect'
        );

        chart.update({
            plotOptions: {
                column: {
                    colorByPoint: false
                }
            }
        });
        assert.strictEqual(
            chart.series[0].points[0].graphic.attr('fill'),
            chart.series[0].points[1].graphic.attr('fill'),
            'Color by point was reset'
        );
    });

    QUnit.test('Tooltip update', function (assert) {
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], getConfig());

        chart.series[0].points[0].onMouseOver();

        assert.strictEqual(
            chart.tooltip.isHidden,
            false,
            'Tooltip visible'
        );

        chart.update({
            tooltip: {
                enabled: false
            }
        });

        assert.strictEqual(
            chart.tooltip.isHidden,
            true,
            'Tooltip hidden'
        );

    });

    QUnit.test('Update all on 3D chart (#8641)', function (assert) {
        var chart = Highcharts.chart('container', {});

        assert.expect(0);

        chart.update({
            chart: {
                options3d: {
                    skew3d: false,
                    enabled: true,
                    alpha: 15,
                    beta: 0,
                    viewDistance: 25,
                    depth: 100
                }
            },
            xAxis: {
                categories: ['Ein', 'Zwei', 'Drei', 'Vier']
            },
            series: [{
                data: [1, 3, 2, 4]
            }]
        }, true, true);
    });

    QUnit.test('Options for chart.update should not be mutated', function (assert) {
        var options = {
            legend: {
                enabled: false
            },
            title: {
                text: 'Hello Bello'
            },
            series: [{
                data: [1, 4, 3, 5]
            }]
        };
        var chart = Highcharts.chart('container', options);

        var cfg = JSON.stringify(options, null, '  ');

        chart.update(options);

        assert.strictEqual(
            cfg,
            JSON.stringify(options, null, '  '),
            'Options should not be mutated after chart.update'
        );
    });

    QUnit.test('Update to non-ordinal (#4196)', function (assert) {

        var data = [/* Jun 2006 */
            [1149120000000, 62.17],
            [1149206400000, 61.66],
            [1149465600000, 60.00],
            [1149552000000, 59.72],
            [1149638400000, 58.56],
            [1149724800000, 60.76],
            [1149811200000, 59.24],
            [1150070400000, 57.00],
            [1150156800000, 58.33],
            [1150243200000, 57.61],
            [1150329600000, 59.38],
            [1150416000000, 57.56],
            [1150675200000, 57.20],
            [1150761600000, 57.47],
            [1150848000000, 57.86],
            [1150934400000, 59.58],
            [1151020800000, 58.83],
            [1151280000000, 58.99],
            [1151366400000, 57.43],
            [1151452800000, 56.02],
            [1151539200000, 58.97],
            [1151625600000, 57.27]
        ];

        // Create the chart
        $('#container').highcharts('StockChart', {


            rangeSelector: {
                selected: 1
            },

            title: {
                text: 'AAPL Stock Price'
            },

            xAxis: {
                ordinal: true
            },

            series: [{
                name: 'AAPL Stock Price',
                data: data,
                marker: {
                    enabled: true,
                    radius: 3
                },
                shadow: true,
                tooltip: {
                    valueDecimals: 2
                },
                animation: false
            }]
        });

        var chart = $('#container').highcharts(),
            xAxis = chart.xAxis[0],
            points = chart.series[0].points;


        // In an ordinal axis, the point distance is the same even though the actual time distance is
        // different.
        assert.equal(
            Math.round(points[1].plotX - points[0].plotX),
            Math.round(points[2].plotX - points[1].plotX),
            'Ordinal'
        );

        xAxis.update({
            ordinal: !xAxis.options.ordinal
        });

        // In a non-ordinal axis, the point distance reflects the time distance.
        assert.equal(
            3 * (points[1].plotX - points[0].plotX),
            points[2].plotX - points[1].plotX,
            'Non-ordinal'
        );
    });
}());
