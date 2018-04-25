QUnit.test('Options importantance order static', function (assert) {
    /* The importantance asscending order:
    * 1) default / global -> tooltip
    * 2) default / global -> plotOptions.series
    * 3) default / global -> plotOptions.<seriesType>
    * 4) user set -> tooltip
    * 5) user set -> plotOptions.series
    * 6) user set -> plotOptions.<seriesType>
    * 7) user set -> series
    */
    var resetTo = {
        padding: Highcharts.defaultOptions.tooltip.padding,
        pointFormat: Highcharts.defaultOptions.tooltip.pointFormat,
        borderRadius: Highcharts.defaultOptions.tooltip.pointFormat
    };
    Highcharts.setOptions({
        tooltip: {
            valueDecimals: '1', // 1)
            padding: 1,
            pointFormat: 'WRONG 1',
            borderRadius: 1,
            valueSuffix: 'WRONG 1',
            footerFormat: 'WRONG 1',
            valuePrefix: 'WRONG 1'
        },
        plotOptions: {
            series: {
                tooltip: {
                    padding: 42, // 2)
                    pointFormat: 'WRONG 2',
                    borderRadius: 2,
                    valueSuffix: 'WRONG 2',
                    footerFormat: 'WRONG 2',
                    valuePrefix: 'WRONG 2'
                }
            },
            line: {
                tooltip: {
                    pointFormat: 'point', // 3)
                    borderRadius: 3,
                    valueSuffix: 'WRONG 3',
                    footerFormat: 'WRONG 3',
                    valuePrefix: 'WRONG 3'
                }
            }
        }
    });

    var chart = Highcharts.chart('container', {
            tooltip: {
                borderRadius: 20, // 4)
                valueSuffix: 'WRONG 4',
                footerFormat: 'WRONG 4',
                valuePrefix: 'WRONG 4'
            },
            plotOptions: {
                series: {
                    tooltip: {
                        valueSuffix: ' suffix', // 5)
                        footerFormat: 'WRONG 5',
                        valuePrefix: 'WRONG 5'
                    }
                },
                line: {
                    tooltip: {
                        footerFormat: 'foot', // 6)
                        valuePrefix: 'WRONG 6'
                    }
                }
            },
            series: [{
                data: [1.12345, 2, 3],
                tooltip: {
                    valuePrefix: 'prefix ' // 7)
                }
            }]
        }),
        defaultOptions = Highcharts.getOptions(),
        series = chart.series[0];

    // 1) default / global -> tooltip
    assert.strictEqual(
        series.tooltipOptions.valueDecimals,
        defaultOptions.tooltip.valueDecimals,
        '1) defaultOptions.tooltip used'
    );
    assert.strictEqual(
        series.tooltipOptions.valueDecimals,
        '1',
        '...and 1) option was merged correctly'
    );

    // 2) default / global -> plotOptions.series
    assert.strictEqual(
        series.tooltipOptions.padding,
        defaultOptions.plotOptions.series.tooltip.padding,
        '2) defaultOptions.plotOptions.series used'
    );
    assert.strictEqual(
        series.tooltipOptions.padding,
        42,
        '...and 2) option was merged correctly'
    );

    // 3) default / global -> plotOptions.<seriesType>
    assert.strictEqual(
        series.tooltipOptions.pointFormat,
        defaultOptions.plotOptions.line.tooltip.pointFormat,
        '3) defaultOptions.plotOptions.<seriesType> used'
    );
    assert.strictEqual(
        series.tooltipOptions.pointFormat,
        'point',
        '...and 3) option was merged correctly'
    );

    // 4) user set -> tooltip
    assert.strictEqual(
        series.tooltipOptions.borderRadius,
        chart.options.tooltip.userOptions.borderRadius,
        '4) chart.options.tooltip.userOptions used'
    );
    assert.strictEqual(
        series.tooltipOptions.borderRadius,
        20,
        '...and 4) option was merged correctly'
    );

    // 5) user set -> plotOptions.series
    assert.strictEqual(
        series.tooltipOptions.valueSuffix,
        chart.options.plotOptions.series.tooltip.valueSuffix,
        '5) chart.options.plotOptions.series used'
    );
    assert.strictEqual(
        series.tooltipOptions.valueSuffix,
        ' suffix',
        '...and 5) option was merged correctly'
    );

    // 6) user set -> plotOptions.<seriesType>
    assert.strictEqual(
        series.tooltipOptions.footerFormat,
        chart.options.plotOptions.line.tooltip.footerFormat,
        '6) chart.options.plotOptions.<seriesType> used'
    );
    assert.strictEqual(
        series.tooltipOptions.footerFormat,
        'foot',
        '...and 6) option was merged correctly'
    );

    // 7) user set -> series
    assert.strictEqual(
        series.tooltipOptions.valuePrefix,
        chart.series[0].userOptions.tooltip.valuePrefix,
        '7) chart.series[n] used'
    );
    assert.strictEqual(
        series.tooltipOptions.valuePrefix,
        'prefix ',
        '...and 7) option was merged correctly'
    );

    // Reset
    delete Highcharts.defaultOptions.tooltip.valueDecimals;
    delete Highcharts.defaultOptions.tooltip.valueSuffix;
    delete Highcharts.defaultOptions.tooltip.footerFormat;
    delete Highcharts.defaultOptions.tooltip.valuePrefix;
    Highcharts.setOptions({
        tooltip: resetTo
    });

    delete Highcharts.defaultOptions.plotOptions.series.tooltip;
    delete Highcharts.defaultOptions.plotOptions.line.tooltip;
});

QUnit.test('Options importantance order dynamic (#6218)', function (assert) {
    /* The importantance asscending order:
    * 1) default / global -> tooltip
    * 2) default / global -> plotOptions.series
    * 3) default / global -> plotOptions.<seriesType>
    * 4) user set -> tooltip
    * 5) user set -> plotOptions.series
    * 6) user set -> plotOptions.<seriesType>
    * 7) user set -> series
    */
    var resetTo = {
        padding: Highcharts.defaultOptions.tooltip.padding,
        pointFormat: Highcharts.defaultOptions.tooltip.pointFormat,
        borderRadius: Highcharts.defaultOptions.tooltip.pointFormat
    };

    Highcharts.setOptions({
        tooltip: {
            headerFormat: '1' // 1)
        },
        plotOptions: {
            series: {
                tooltip: {
                    //headerFormat: '2' // 2)
                }
            },
            line: {
                tooltip: {
                    //headerFormat: '3' // 3)
                }
            }
        }
    });

    var chart = Highcharts.chart('container', {
        tooltip: {
            //headerFormat: '4' // 4)
        },
        plotOptions: {
            series: {
                tooltip: {
                    //headerFormat: '5' // 5)
                }
            },
            line: {
                tooltip: {
                    //headerFormat: '6' // 6)
                }
            }
        },
        series: [{
            data: [1.1234, 2, 3],
            tooltip: {
                //headerFormat: '7' // 7)
            }
        }]
    });

    // 1) default / global -> tooltip
    assert.strictEqual(
        chart.series[0].tooltipOptions.headerFormat,
        '1',
        '1) defaultOptions.tooltip used'
    );

    Highcharts.setOptions({
        plotOptions: {
            series: {
                tooltip: {
                    headerFormat: '2'
                }
            }
        }
    });
    chart.series[0].update({});

    // 2) default / global -> plotOptions.series
    assert.strictEqual(
        chart.series[0].tooltipOptions.headerFormat,
        '2',
        '2) defaultOptions.plotOptions.series used'
    );

    Highcharts.setOptions({
        plotOptions: {
            line: {
                tooltip: {
                    headerFormat: '3'
                }
            }
        }
    });
    chart.series[0].update({});

    // 3) default / global -> plotOptions.<seriesType>
    assert.strictEqual(
        chart.series[0].tooltipOptions.headerFormat,
        '3',
        '3) defaultOptions.plotOptions.<seriesType> used'
    );

    chart.update({
        tooltip: {
            headerFormat: '4'
        }
    });

    // 4) user set -> tooltip
    assert.strictEqual(
        chart.series[0].tooltipOptions.headerFormat,
        '4',
        '4) chart.options.tooltip.userOptions used'
    );

    chart.update({
        plotOptions: {
            series: {
                tooltip: {
                    headerFormat: '5'
                }
            }
        }
    });

    // 5) user set -> plotOptions.series
    assert.strictEqual(
        chart.series[0].tooltipOptions.headerFormat,
        '5',
        '5) chart.options.plotOptions.series used'
    );

    chart.update({
        plotOptions: {
            line: {
                tooltip: {
                    headerFormat: '6'
                }
            }
        }
    });

    // 6) user set -> plotOptions.<seriesType>
    assert.strictEqual(
        chart.series[0].tooltipOptions.headerFormat,
        '6',
        '6) chart.options.plotOptions.<seriesType> used'
    );

    chart.series[0].update({
        tooltip: {
            headerFormat: '7'
        }
    });

    // 7) user set -> series
    assert.strictEqual(
        chart.series[0].tooltipOptions.headerFormat,
        '7',
        '7) chart.series[n] used'
    );

    // Reset
    delete Highcharts.defaultOptions.tooltip.valueDecimals;
    delete Highcharts.defaultOptions.tooltip.valueSuffix;
    delete Highcharts.defaultOptions.tooltip.footerFormat;
    delete Highcharts.defaultOptions.tooltip.valuePrefix;
    Highcharts.setOptions({
        tooltip: resetTo
    });

    delete Highcharts.defaultOptions.plotOptions.series.tooltip;
    delete Highcharts.defaultOptions.plotOptions.line.tooltip;
});
