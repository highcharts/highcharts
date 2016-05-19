/* eslint func-style:0 */
$(function () {

    var config = {
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

    var stockConfig = {
        chart: {
            animation: false,
            height: 300,
            plotBackgroundColor: '#eff'
        },

        series: [{
            animation: false,
            pointStart: Date.UTC(2016, 0, 1),
            pointInterval: 24 * 36e5,
            data: [1, 3, 5, 6, 7, 3, 5, 4, 6, 5, 4, 3, 5, 4, 5, 6, 7, 6, 5, 4, 5, 6, 7, 6, 4, 3, 2,
                1, 3, 5, 6, 7, 3, 5, 4, 6, 5, 4, 3, 5, 4, 5, 6, 7, 6, 5, 4, 5, 6, 7, 6, 4, 3, 2,
                1, 3, 5, 6, 7, 3, 5, 4, 6, 5, 4, 3, 5, 4, 5, 6, 7, 6, 5, 4, 5, 6, 7, 6, 4, 3, 2,
                1, 3, 5, 6, 7, 3, 5, 4, 6, 5, 4, 3, 5, 4, 5, 6, 7, 6, 5, 4, 5, 6, 7, 6, 4, 3, 2]
        }]
    };

    QUnit.test('Option chart.alignTicks update', function (assert) {
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], {

            chart: {
                alignTicks: false
            },

            yAxis: [{

            }, {
                opposite: true
            }],

            series: [{
                data: [1, 2, 3, 4]
            }, {
                data: [2, 4, 6],
                yAxis: 1
            }]

        });

        assert.notEqual(
            chart.yAxis[0].tickPositions.length,
            chart.yAxis[1].tickPositions.length,
            'Not aligned ticks'
        );

        chart.update({
            chart: {
                alignTicks: true
            }
        });

        assert.strictEqual(
            chart.yAxis[0].tickPositions.length,
            chart.yAxis[1].tickPositions.length,
            'Aligned ticks'
        );
    });

    QUnit.test('Option chart.animation update', function (assert) {
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], config);

        assert.strictEqual(
            chart.renderer.globalAnimation,
            undefined,
            'Undefined animation'
        );

        chart.update({
            chart: {
                animation: false
            }
        });

        assert.strictEqual(
            chart.renderer.globalAnimation,
            false,
            'Disabled animation'
        );

        chart.update({
            chart: {
                animation: true
            }
        });

        assert.strictEqual(
            chart.renderer.globalAnimation,
            true,
            'Enabled animation'
        );

    });

    QUnit.test('Option chart border and background update', function (assert) {
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], config);

        chart.update({
            chart: {
                backgroundColor: '#effecc',
                borderColor: '#abbaca',
                borderRadius: 10,
                borderWidth: 10
            }
        });
        assert.strictEqual(
            chart.chartBackground.element.getAttribute('fill'),
            '#effecc',
            'Chart background is updated'
        );
        assert.strictEqual(
            chart.chartBackground.element.getAttribute('stroke'),
            '#abbaca',
            'Chart border is updated'
        );
        assert.strictEqual(
            chart.chartBackground.element.getAttribute('stroke-width'),
            '10',
            'Chart border width is updated'
        );
        assert.strictEqual(
            chart.chartBackground.element.getAttribute('rx'),
            '10',
            'Chart border radius is updated'
        );

        // Back to default
        chart.update({
            chart: {
                backgroundColor: '#FFFFFF',
                borderColor: '#4572A7',
                borderRadius: 0,
                borderWidth: 0
            }
        });

        assert.strictEqual(
            chart.chartBackground.element.getAttribute('fill'),
            '#FFFFFF',
            'Chart background is updated'
        );
        assert.strictEqual(
            chart.chartBackground.element.getAttribute('stroke'),
            null,
            'Chart border is removed'
        );
        assert.strictEqual(
            chart.chartBackground.element.getAttribute('rx'),
            '0',
            'Chart border radius is updated'
        );
    });

    QUnit.test('Option chart className update', function (assert) {
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], config);

        assert.ok(
            chart.container.className.indexOf('my-class') === -1,
            'Default class name'
        );

        chart.update({
            chart: {
                className: 'my-class'
            }
        });

        assert.ok(
            chart.container.className.indexOf('my-class') > -1,
            'Custom class name'
        );

    });

    QUnit.test('Option chart plot border and background update', function (assert) {
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], config);

        chart.update({
            chart: {
                plotBackgroundColor: '#effecc',
                plotBackgroundImage: '404.png',
                plotBorderColor: '#abbaca',
                plotBorderWidth: 10
            }
        });
        assert.strictEqual(
            chart.plotBackground.element.getAttribute('fill'),
            '#effecc',
            'Plot background is updated'
        );
        assert.strictEqual(
            chart.plotBorder.element.getAttribute('stroke'),
            '#abbaca',
            'Plot border is updated'
        );
        assert.strictEqual(
            chart.plotBorder.element.getAttribute('stroke-width'),
            '10',
            'Plot border width is updated'
        );
        assert.strictEqual(
            chart.plotBGImage.element.getAttribute('href'),
            '404.png',
            'Image attempted loaded'
        );
    });

    QUnit.test('Credits update', function (assert) {
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], config);

        chart.update({
            credits: {
                enabled: false
            }
        });

        assert.ok(
            chart.credits === null,
            'Credits removed'
        );

        chart.update({
            credits: {
                text: 'Updated chart'
            }
        });

        assert.ok(
            chart.credits === null,
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
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], config);

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
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], config);

        chart.update({
            title: {
                text: ''
            }
        });

        assert.strictEqual(
            chart.title,
            null,
            'Removed title'
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
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], config);

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
            Highcharts.merge(config, {
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
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], config);

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
            chart.loadingDiv.style.background,
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
            chart.loadingDiv.style.background,
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
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], config);

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
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], config);

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

    QUnit.test('Navigator update', function (assert) {
        var chart = Highcharts.stockChart($('<div>').appendTo('#container')[0], Highcharts.merge(stockConfig)),
            originalPlotHeight = document.querySelector('.highcharts-plot-background').getBBox().height;

        assert.strictEqual(
            typeof chart.container.querySelector('.highcharts-navigator-mask-inside').getBBox().height,
            'number',
            'Height is valid'
        );
        assert.ok(
            chart.container.querySelector('.highcharts-navigator-mask-inside').getBBox().height < 60,
            'Height is 40'
        );

        chart.update({
            navigator: {
                height: 100
            }
        });

        assert.ok(
            chart.container.querySelector('.highcharts-navigator-mask-inside').getBBox().height > 60,
            'Height is updated'
        );

        chart.update({
            navigator: {
                enabled: false
            }
        });

        assert.strictEqual(
            chart.container.querySelector('.highcharts-navigator'),
            null,
            'Navigator element is missing'
        );

        assert.ok(
            document.querySelector('.highcharts-plot-background').getBBox().height > originalPlotHeight,
            'Plot area is now higher than it was'
        );
    });

    QUnit.test('Scrollbar update', function (assert) {
        var chart = Highcharts.stockChart($('<div>').appendTo('#container')[0], Highcharts.merge(stockConfig));

        assert.strictEqual(
            typeof chart.container.querySelector('.highcharts-scrollbar').getBBox().height,
            'number',
            'Height is valid'
        );

        chart.update({
            scrollbar: {
                enabled: false
            }
        });

        assert.strictEqual(
            chart.container.querySelector('.highcharts-scrollbar'),
            null,
            'Scrollbar is gone'
        );
    });

    QUnit.test('Range selector update', function (assert) {

        var chart = Highcharts.stockChart($('<div>').appendTo('#container')[0], stockConfig);

        assert.strictEqual(
            chart.container.querySelectorAll('g.highcharts-range-selector-buttons .highcharts-button').length,
            6,
            '6 range selector buttons'
        );

        assert.strictEqual(
            chart.container.querySelectorAll('g.highcharts-input-group .highcharts-label').length,
            4,
            '2 inputs and 2 labels'
        );

        chart.update({
            rangeSelector: {
                inputEnabled: false
            }
        });

        assert.strictEqual(
            chart.container.querySelectorAll('g.highcharts-input-group .highcharts-label').length,
            0,
            'No inputs'
        );

        chart.update({
            rangeSelector: {
                enabled: false
            }
        });

        assert.strictEqual(
            chart.container.querySelectorAll('g.highcharts-range-selector-buttons .highcharts-button').length,
            0,
            'No buttons'
        );

        assert.strictEqual(
            chart.container.querySelectorAll('g.highcharts-input-group .highcharts-label').length,
            0,
            'No inputs'
        );

        chart.update({
            rangeSelector: {
                enabled: true,
                inputEnabled: true
            }
        });

        assert.strictEqual(
            chart.container.querySelectorAll('g.highcharts-range-selector-buttons .highcharts-button').length,
            6,
            '6 range selector buttons'
        );

        assert.strictEqual(
            chart.container.querySelectorAll('g.highcharts-input-group .highcharts-label').length,
            4,
            '2 inputs and 2 labels'
        );

    });
});
