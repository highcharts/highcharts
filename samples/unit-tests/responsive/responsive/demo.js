
QUnit.test('Adapt height', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            height: 400,
            animation: false
        },
        plotOptions: {
            series: {
                animation: false
            }
        },
        series: [{
            data: [1, 3, 2, 5]
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    chart: {
                        height: 300
                    }
                }
            }]
        }
    });

    chart.setSize(400);

    assert.strictEqual(
        chart.chartWidth,
        400,
        'Width updated'
    );
    assert.strictEqual(
        chart.chartHeight,
        300,
        'Height updated'
    );

    chart.setSize(600);

    assert.strictEqual(
        chart.chartWidth,
        600,
        'Width reset'
    );
    assert.strictEqual(
        chart.chartHeight,
        400,
        'Height reset'
    );
});

QUnit.test('Callback', function (assert) {

    var condition = true;

    var chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            height: 400,
            animation: false
        },
        plotOptions: {
            series: {
                animation: false
            }
        },
        series: [{
            data: [1, 3, 2, 5]
        }],
        responsive: {
            rules: [{
                condition: {
                    callback: function () {
                        return condition;
                    }
                },
                chartOptions: {
                    chart: {
                        width: 300
                    }
                }
            }]
        }
    });

    assert.strictEqual(
        chart.chartWidth,
        300,
        'Width updated'
    );
});

QUnit.test('Responsive on chart.update', function (assert) {

    var chart = Highcharts.chart('container', {

        credits: {
            text: 'Initial',
            href: 'http://www.example.com'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }],

        responsive: {
            rules: [{
                condition: {
                    callback: function () {
                        return this.options.credits.position.verticalAlign === 'top';
                    }
                },
                chartOptions: {
                    credits: {
                        text: 'Updated'
                    }
                }
            }]
        }

    });

    assert.strictEqual(
        chart.container.querySelector('.highcharts-credits').textContent,
        'Initial',
        'Initial credits'
    );

    // Trigger a redraw and make the responsive condition true
    chart.update({
        credits: {
            position: {
                verticalAlign: 'top'
            }
        }
    });

    assert.strictEqual(
        chart.container.querySelector('.highcharts-credits').textContent,
        'Updated',
        'Updated credits'
    );

    // Trigger a redraw and make the responsive condition false
    chart.update({
        credits: {
            position: {
                verticalAlign: 'bottom'
            }
        }
    });

    assert.strictEqual(
        chart.container.querySelector('.highcharts-credits').textContent,
        'Initial',
        'Back to initial credits'
    );
});

QUnit.test(
    'Nested property names like series or xAxis (#6208)',
    function (assert) {
        var chart = Highcharts.chart('container', {

            chart: {
                animation: false
            },

            series: [{
                data: [1, 4, 3],
                animation: false,
                yAxis: 0
            }],

            yAxis: [{
                min: 0,
                max: 10
            }, {
                opposite: true,
                min: -10,
                max: 10
            }],

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        plotOptions: {
                            series: {
                                color: 'red'
                            }
                        },
                        series: [{
                            yAxis: 1
                        }]
                    }
                }]
            }
        });

        assert.notEqual(
            chart.series[0].graph.attr('stroke'),
            'red',
            'Initial color'
        );
        assert.strictEqual(
            chart.series[0].yAxis,
            chart.yAxis[0],
            'Initial axis'
        );

        chart.setSize(400);

        assert.strictEqual(
            chart.series[0].graph.attr('stroke'),
            'red',
            'Responsive color'
        );
        assert.strictEqual(
            chart.series[0].yAxis,
            chart.yAxis[1],
            'Responsive axis'
        );

    }
);

QUnit.test(
    'Revert axis properties',
    function (assert) {
        var chart = Highcharts.chart('container', {

            chart: {
                width: 600
            },

            xAxis: {
                categories: ['January', 'February']
            },

            series: [{
                name: 'Sales',
                data: [434, 523]
            }],

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        xAxis: {
                            labels: {
                                format: 'sample'
                            }
                        },
                        yAxis: {
                            labels: {
                                align: 'left',
                                x: 0,
                                y: -2
                            }
                        }
                    }
                }]
            }
        });

        assert.strictEqual(
            chart.xAxis[0].ticks[0].label.textStr,
            'January',
            'Initial label'
        );

        chart.setSize(400);

        assert.strictEqual(
            chart.xAxis[0].ticks[0].label.textStr,
            'sample',
            'Responsive label'
        );

        chart.setSize(600);

        assert.strictEqual(
            chart.xAxis[0].ticks[0].label.textStr,
            'January',
            'Initial label'
        );

    }
);


QUnit.test('Multiple rules order (#6291)', function (assert) {

    var container = document.getElementById('container');

    container.style.position = '';

    var chart = Highcharts.chart(container, {
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 400
                },
                chartOptions: {
                    title: {
                        text: 'Max width 400'
                    }
                }
            }, {
                condition: {
                    maxWidth: 300
                },
                chartOptions: {
                    title: {
                        text: 'Max width 300'
                    }
                }
            }, {
                condition: {
                    maxWidth: 200
                },
                chartOptions: {
                    title: {
                        text: 'Max width 200'
                    }
                }
            }]
        },
        chart: {
            width: 450,
            animation: false
        },
        title: {
            text: 'No restrictions'
        },
        series: [{
            name: 'USD to EUR',
            data: [1, 2, 3],
            animation: false
        }]
    });

    assert.strictEqual(
        chart.title.textStr,
        'No restrictions',
        'No restrictions (initial)'
    );

    chart.setSize(350);
    assert.strictEqual(
        chart.title.textStr,
        'Max width 400',
        'Max width 400'
    );

    chart.setSize(250);
    assert.strictEqual(
        chart.title.textStr,
        'Max width 300',
        'Max width 300'
    );

    chart.setSize(150);
    assert.strictEqual(
        chart.title.textStr,
        'Max width 200',
        'Max width 200'
    );

    chart.setSize(250);
    assert.strictEqual(
        chart.title.textStr,
        'Max width 300',
        'Max width 300'
    );

    chart.setSize(null);
    assert.strictEqual(
        chart.title.textStr,
        'No restrictions',
        'No restrictions (final)'
    );
});

QUnit.test('Mismatch of collection length (#6347)', function (assert) {
    var chart = Highcharts.chart('container', {
        responsive: {
            rules: [{
                condition: {
                    maxHeight: 180
                },
                chartOptions: {
                    yAxis: [{
                        labels: {
                            style: {
                                color: 'lightgreen',
                                fontSize: '12px'
                            }
                        }
                    }, {
                        labels: {
                            style: {
                                color: 'lightgreen',
                                fontSize: '12px'
                            }
                        }
                    }]
                }
            }]
        },
        chart: {
            height: 250
        },
        series: [{
            name: 'Sales',
            data: [434, 523, 345, 785, 565, 843, 726, 590, 665, 434, 312, 432]
        }],
        yAxis: [{
            labels: {
                style: {
                    fontSize: '22px'
                }
            }
        }]
    });

    assert.strictEqual(
        chart.yAxis[0].ticks[chart.yAxis[0].tickPositions[0]]
            .label.styles.fontSize,
        '22px',
        'Initial font size'
    );

    chart.setSize(500, 170, false);
    assert.strictEqual(
        chart.yAxis[0].ticks[chart.yAxis[0].tickPositions[0]]
            .label.styles.fontSize,
        '12px',
        'Responsive font size'
    );
});
