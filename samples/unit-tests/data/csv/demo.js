QUnit.test('csv-datetime-axis', function (assert) {

    var data = 'Date,Value\n2016-01-01,1\n2016-02-01,2\n2016-03-01,3\n';


    var chart = Highcharts.chart('container', {

        title: {
            text: 'Datetime Axis'
        },

        subtitle: {
            text: 'Data input from CSV'
        },

        data: {
            csv: data
        },

        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
            }
        },

        series: [{
            lineWidth: 1
        }]
    });
    var options = chart.options
    ;

    assert.strictEqual(
        (Highcharts.isArray(options.xAxis) ? options.xAxis[0] : options.xAxis).type,
        'datetime',
        'X axis is date/time'
    );
});

if (!isNaN(Date.parse('Jan 16'))) { // Only Chrome parses "Jan 16" as of 2017
    QUnit.test('csv-current-year', function (assert) {

        // Don't log the error 'Could not deduce date format'
        var error = Highcharts.error;
        Highcharts.error = function () {};

        var csv = 'Date,Value\nJan 16,1\nFeb 16,2\nMar 16,3';

        var chart = Highcharts.chart('container', {

                title: {
                    text: 'Deduce that the year is the current year'
                },

                subtitle: {
                    text: 'Data input from CSV'
                },

                data: {
                    csv: csv
                },

                plotOptions: {
                    series: {
                        marker: {
                            enabled: false
                        }
                    }
                },

                series: [{
                    lineWidth: 1
                }]
            }),
            options = chart.options
            ;

        assert.strictEqual(
            (Highcharts.isArray(options.xAxis) ? options.xAxis[0] : options.xAxis).type,
            'datetime',
            'X axis is date/time'
        );

        assert.ok(
            // Chrome Date.parse assumes year 2001
            options.series[0].data[0][0] === 979603200000 ||
            // Safari Date.parse assumes year 2000
            options.series[0].data[0][0] === 947980800000,
            'Date for point one is correct'
        );

        // Reset
        Highcharts.error = error;
    });
}

QUnit.test('csv-deduce-delimiter', function (assert) {

    /*
     * Note that the input data is malformed. So what should happen is:
     *  - Guess that the delimiter is ;
     *  - There's a missing column in the header since the header is delimited on ,
     *  - A blank column should be inserted into the header
     *  - Result is one series - Series 1 - with three data points
     *
     * It should also fire a warning event or something similar eventually.
     */

    var csv = 'Date,Value\n2016-01-02;4\n2016-01-03;6\n2016-01-04;7';
    var chart = Highcharts.chart('container', {

            title: {
                text: 'Deduce delimiter'
            },

            subtitle: {
                text: 'Data input from CSV'
            },

            data: {
                csv: csv,
                decimalPoint: null,
                itemDelimiter: null
            },

            plotOptions: {
                series: {
                    marker: {
                        enabled: false
                    }
                }
            },

            series: [{
                lineWidth: 1
            }]
        }),
        options = chart.options
        ;

    assert.strictEqual(
        (Highcharts.isArray(options.xAxis) ? options.xAxis[0] : options.xAxis).type,
        'datetime',
        'X axis is date/time'
    );

    assert.strictEqual(
        options.series[0].data[0][1],
        4,
        'Point 1 is correct'
    );

    assert.strictEqual(
        options.series[0].data[1][1],
        6,
        'Point 2 is correct'
    );

    assert.strictEqual(
        options.series[0].data[2][1],
        7,
        'Point 3 is correct'
    );

});

QUnit.test('csv-deduce-delimiter-ambigious', function (assert) {

    var data = 'Date;Value\n2016-01-01;1,100\n2016-01-02;2,000\n2016-01-03;3,000';

    var chart = Highcharts.chart('container', {

            title: {
                text: 'Deduce ambigious delimiter'
            },

            subtitle: {
                text: 'Data input from CSV'
            },

            data: {
                csv: data,
                decimalPoint: null,
                itemDelimiter: null
            },

            plotOptions: {
                series: {
                    marker: {
                        enabled: false
                    }
                }
            },

            series: [{
                lineWidth: 1
            }]
        }),
        options = chart.options
        ;

    assert.strictEqual(
        (Highcharts.isArray(options.xAxis) ? options.xAxis[0] : options.xAxis).type,
        'datetime',
        'X axis is date/time'
    );

    assert.strictEqual(
        options.series[0].data[0][1],
        1.1,
        'Point 1 is correct'
    );

    assert.strictEqual(
        options.series[0].data[1][1],
        2,
        'Point 2 is correct'
    );

    assert.strictEqual(
        options.series[0].data[2][1],
        3,
        'Point 3 is correct'
    );

});

QUnit.test('csv-deduce-format-ddmmyyyy', function (assert) {

    var data = 'Date,Value\n1/1/2016,4\n3/2/2016,6\n14/4/2016,7';
    var chart = Highcharts.chart('container', {

            title: {
                text: 'Deduce ddmmyyyy format'
            },

            subtitle: {
                text: 'Data input from CSV'
            },

            data: {
                csv: data,
                decimalPoint: null,
                itemDelimiter: null
            },

            plotOptions: {
                series: {
                    marker: {
                        enabled: false
                    }
                }
            },

            series: [{
                lineWidth: 1
            }]
        }),
        options = chart.options
        ;

    assert.strictEqual(
        (Highcharts.isArray(options.xAxis) ? options.xAxis[0] : options.xAxis).type,
        'datetime',
        'X axis is date/time'
    );

    assert.strictEqual(
        options.series[0].data[2][0],
        1460592000000,
        'Format is DD/MM/YYYY'
    );

});

QUnit.test('csv-deduce-format-iso', function (assert) {

    // Don't log the error 'Could not deduce date format'
    var error = Highcharts.error;
    Highcharts.error = function () {};

    var data = 'Date,Value\n2016-01-29,1\n2016-01-30,2\n2016-01-31,3\n2016-02-01,3\n2016-02-02,3';

    var chart = Highcharts.chart('container', {

            title: {
                text: 'Deduce ISO format'
            },

            subtitle: {
                text: 'Data input from CSV'
            },

            data: {
                csv: data,
                decimalPoint: null,
                itemDelimiter: null
            },

            plotOptions: {
                series: {
                    marker: {
                        enabled: false
                    }
                }
            },

            series: [{
                lineWidth: 1
            }]
        }),
        options = chart.options
        ;

    assert.strictEqual(
        (Highcharts.isArray(options.xAxis) ? options.xAxis[0] : options.xAxis).type,
        'datetime',
        'X axis is date/time'
    );

    assert.strictEqual(
        options.series[0].data[0][0],
        1454025600000,
        'Format is DD/MM/YYYY'
    );

    // Reset
    Highcharts.error = error;

});

QUnit.test('csv-deduce-format-mmddyyyy', function (assert) {

    var data = 'Date,Value\n1/1/2016,4\n3/2/2016,6\n4/14/2016,7';

    var chart = Highcharts.chart('container', {

            title: {
                text: 'Deduce mmddyyyy format'
            },

            subtitle: {
                text: 'Data input from CSV'
            },

            data: {
                csv: data,
                decimalPoint: null,
                itemDelimiter: null
            },

            plotOptions: {
                series: {
                    marker: {
                        enabled: false
                    }
                }
            },

            series: [{
                lineWidth: 1
            }]
        }),
        options = chart.options
        ;

    assert.strictEqual(
        (Highcharts.isArray(options.xAxis) ? options.xAxis[0] : options.xAxis).type,
        'datetime',
        'X axis is date/time'
    );


    assert.strictEqual(
        options.series[0].data[2][0],
        1460592000000,
        'Format is DD/MM/YYYY'
    );

});

QUnit.test('csv-deduce-format-us', function (assert) {
    // Don't log the error 'Could not deduce date format'
    var error = Highcharts.error;
    Highcharts.error = function () {};

    var data = 'Date,Value\n2016/1/29,1\n2016/1/30,2\n2016/1/31,3\n2016/2/1,3\n2016/2/1,3';
    var chart = Highcharts.chart('container', {

            title: {
                text: 'Deduce US format'
            },

            subtitle: {
                text: 'Data input from CSV'
            },

            data: {
                csv: data,
                decimalPoint: null,
                itemDelimiter: null,
                dateFormat: false
            },

            plotOptions: {
                series: {
                    marker: {
                        enabled: false
                    }
                }
            },

            series: [{
                lineWidth: 1
            }]
        }),
        options = chart.options
        ;

    assert.strictEqual(
        (Highcharts.isArray(options.xAxis) ? options.xAxis[0] : options.xAxis).type,
        'datetime',
        'X axis is date/time'
    );

    assert.strictEqual(
        options.series[0].data[0][0],
        1454025600000,
        'Date for point one is correct'
    );

    // Reset
    Highcharts.error = error;

});

QUnit.test('csv-datetime-short-year-1900', function (assert) {

    // When using shorthand, it's assumed the year belongs to the 2000's if
    // it's less or equal to the current year, 1900's if not.
    var data = 'Date,Value\n11/1/99,4\n12/1/99,6\n13/1/99,7\n';

    var chart = Highcharts.chart('container', {

        title: {
            text: 'Deduce that the year is in the 20st century'
        },

        subtitle: {
            text: 'Data input from CSV'
        },

        data: {
            csv: data
        },

        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
            }
        },

        series: [{
            lineWidth: 1
        }]
    });

    assert.strictEqual(
        chart.options.series[0].data.length,
        3,
        'Loaded Data'
    );

    assert.strictEqual(
        (chart.options.series[0].data[0][1]),
        4,
        'Point one is correct'
    );

    assert.strictEqual(
        (chart.options.series[0].data[1][1]),
        6,
        'Point two is correct'
    );

    assert.strictEqual(
        (chart.options.series[0].data[2][1]),
        7,
        'Point three is correct'
    );

    assert.strictEqual(
        (chart.options.series[0].data[0][0]),
        916012800000,
        'Date for point one is correct'
    );

    assert.strictEqual(
        (chart.options.series[0].data[1][0]),
        916099200000,
        'Date for point two is correct'
    );

});

QUnit.test('csv-datetime-short-year-2000', function (assert) {

    // Should assume that full year is 2000 + short hand, since the shorthand is
    // more likely to be on this side of the century. It also assumes that 16 is
    // the year, since it's stable accross the data points.
    var data = 'Date,Value\n11/1/16,4\n12/1/16,6\n13/1/16,7';
    var chart = Highcharts.chart('container', {

            title: {
                text: 'Datetime Short Year Deduction (2000)'
            },

            subtitle: {
                text: 'Data input from CSV'
            },

            data: {
                csv: data
            },

            plotOptions: {
                series: {
                    marker: {
                        enabled: true
                    }
                }
            },

            series: [{
                lineWidth: 1
            }]
        }),
        options = chart.options
        ;

    assert.strictEqual(
        (Highcharts.isArray(options.xAxis) ? options.xAxis[0] : options.xAxis).type,
        'datetime',
        'X axis is date/time'
    );

    assert.strictEqual(
        (chart.options.series[0].data[0][0]),
        1452470400000,
        'Date for point one is correct'
    );

    assert.strictEqual(
        (chart.options.series[0].data[0][1]),
        4,
        'Data for point one is correct'
    );
});

QUnit.test('csv-quoted-data', function (assert) {

    // Everything inside double quotes should be interpreted as a single string.
    var data = '"Category","Value"\n"Cat, A",1\n"Cat; B",2\n"Cat C",3\n';

    var chart = Highcharts.chart('container', {

        title: {
            text: 'Quotes'
        },

        subtitle: {
            text: 'Data input from CSV'
        },

        data: {
            csv: data
        },

        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
            }
        },

        series: [{
            lineWidth: 1
        }]
    });

    assert.strictEqual(
        chart.options.series[0].data.length,
        3,
        'Loaded Data'
    );

    assert.strictEqual(
        (chart.xAxis[0].names).length,
        3,
        'Has categories'
    );

    assert.strictEqual(
        chart.xAxis[0].names[0],
        'Cat, A',
        'Quoting works'
    );
});

QUnit.test('csv-quoted-data-escaped', function (assert) {

    var data = '"Category","Value"\n"Cat: ""Foobar"" A",1\n"Cat; B",2\n"Cat C",3';

    var chart = Highcharts.chart('container', {

        title: {
            text: 'Escaped quotes'
        },

        subtitle: {
            text: 'Data input from CSV'
        },

        data: {
            csv: data
        },

        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
            }
        },

        series: [{
            lineWidth: 1
        }]
    });

    assert.strictEqual(
        chart.options.series[0].data.length,
        3,
        'Loaded Data'
    );

    assert.strictEqual(
        (chart.xAxis[0].names).length,
        3,
        'Has categories'
    );

    assert.strictEqual(
        chart.xAxis[0].names[0],
        'Cat: "Foobar" A',
        'Quotes included'
    );
});


QUnit.test('startRow, endRow, startColumn, endColumn', function (assert) {
    var data =
        'Pad,Pad,Pad,Pad\n' +
        'Pad,Apples,Pears,Pad\n' +
        'Pad,1,2,Pad\n' +
        'Pad,5,6,Pad\n' +
        'Pad,Pad,Pad,Pad';

    Highcharts.data({
        csv: data,
        startRow: 1,
        endRow: 3,
        startColumn: 1,
        endColumn: 2,
        parsed: function () {

            assert.strictEqual(
                this.columns.length,
                2,
                'Two columns included'
            );
            assert.strictEqual(
                this.columns[0].join(','),
                'Apples,1,5',
                'First column ok'
            );
            assert.strictEqual(
                this.columns[0].length,
                3,
                'Three rows included'
            );
        }
    });

});

QUnit.test('Comments in CSV', function (assert) {
    var data = [
        '# -------',
        '# Comment',
        '# ----',
        'Apples,Pears',
        '1,2# Inline comment',
        '3,4',
        '5,6'
    ].join('\n');

    Highcharts.data({
        csv: data,
        parsed: function () {
            assert.strictEqual(
                this.columns[0].join(','),
                'Apples,1,3,5',
                'First column ok'
            );
            assert.strictEqual(
                this.columns[1].join(','),
                'Pears,2,4,6',
                'Second column ok'
            );
        }
    });
});
