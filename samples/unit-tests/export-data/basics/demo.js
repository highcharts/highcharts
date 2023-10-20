QUnit.test('Categorized', function (assert) {
    $('#container').highcharts({
        title: {
            text: 'Categorized chart'
        },

        xAxis: {
            categories: [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
                'Oct', 'Nov', 'Dec'
            ]
        },

        series: [
            {
                data: [
                    29.9, 0, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4,
                    194.1, 95.6, 54.4
                ]
            }
        ]
    });

    var csv =
        '"Category","Series 1"\n' +
        '"Jan",29.9\n' +
        '"Feb",0\n' +
        '"Mar",106.4\n' +
        '"Apr",129.2\n' +
        '"May",144\n' +
        '"Jun",176\n' +
        '"Jul",135.6\n' +
        '"Aug",148.5\n' +
        '"Sep",216.4\n' +
        '"Oct",194.1\n' +
        '"Nov",95.6\n' +
        '"Dec",54.4';

    assert.equal(
        $('#container').highcharts().getCSV(),
        csv,
        'Basic categorized content'
    );

    $('#container')
        .highcharts()
        .addSeries({
            data: [1, 2, 3, 4, 5, 6, 7, 7],
            visible: false
        });

    assert.equal(
        $('#container').highcharts().getCSV(),
        csv,
        'Added invisible series'
    );
    $('#container').highcharts().destroy();
});

QUnit.test('Chart event', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            events: {
                exportData: function (event) {
                    event.dataRows[2][0] = 'Apples';
                    event.dataRows[2][1] = 4;
                }
            }
        },
        xAxis: {
            title: {
                text: 'Fruit'
            },
            type: 'category'
        },
        series: [
            {
                type: 'line',
                name: 'Number',
                data: [
                    ['Bananas', 1],
                    ['Pears', 2],
                    ['Oranges', 3]
                ]
            }
        ]
    });

    assert.deepEqual(
        chart.getDataRows(),
        [
            ['Fruit', 'Number'],
            ['Bananas', 1],
            ['Apples', 4],
            ['Oranges', 3]
        ],
        '2 "Pears" should be replaced with 4 "Apples".'
    );
});

QUnit.test('Named points', function (assert) {
    $('#container').highcharts({
        title: {
            text: 'Named points'
        },

        xAxis: {
            type: 'category'
        },

        series: [
            {
                data: [
                    ['Apples', 1],
                    ['Pears', 2],
                    ['Oranges', 3]
                ]
            }
        ]
    });

    var csv =
        '"Category","Series 1"\n' +
        '"Apples",1\n' +
        '"Pears",2\n' +
        '"Oranges",3';

    assert.equal($('#container').highcharts().getCSV(), csv, 'Named points');

    $('#container').highcharts().destroy();
});

QUnit.test('Datetime', function (assert) {
    $('#container').highcharts({
        title: {
            text: 'Datetime chart'
        },

        xAxis: {
            type: 'datetime'
        },

        series: [
            {
                data: [
                    29.9,
                    71.5,
                    106.4,
                    129.2,
                    144.0,
                    176.0,
                    135.6,
                    148.5,
                    216.4,
                    194.1,
                    95.6,
                    54.4
                ],
                pointStart: Date.UTC(2014, 0, 1),
                pointInterval: 24 * 36e5
            }
        ]
    });

    var csv =
        '"DateTime","Series 1"\n' +
        '"2014-01-01 00:00:00",29.9\n' +
        '"2014-01-02 00:00:00",71.5\n' +
        '"2014-01-03 00:00:00",106.4\n' +
        '"2014-01-04 00:00:00",129.2\n' +
        '"2014-01-05 00:00:00",144\n' +
        '"2014-01-06 00:00:00",176\n' +
        '"2014-01-07 00:00:00",135.6\n' +
        '"2014-01-08 00:00:00",148.5\n' +
        '"2014-01-09 00:00:00",216.4\n' +
        '"2014-01-10 00:00:00",194.1\n' +
        '"2014-01-11 00:00:00",95.6\n' +
        '"2014-01-12 00:00:00",54.4';

    assert.equal(
        $('#container').highcharts().getCSV(),
        csv,
        'Basic datetime content'
    );
    $('#container').highcharts().destroy();
});

QUnit.test('Datetime multiseries', function (assert) {
    $('#container').highcharts({
        title: {
            text: 'Datetime chart'
        },

        xAxis: {
            type: 'datetime'
        },

        plotOptions: {
            series: {
                pointStart: Date.UTC(2014, 0, 1),
                pointInterval: 24 * 36e5
            }
        },

        series: [
            {
                data: [1, 2, 3, 4]
            },
            {
                data: [2, 3, 4, 5]
            },
            {
                data: [3, 4, 5, 6]
            },
            {
                data: [4, 5, 6, 7]
            }
        ]
    });

    var csv =
        '"DateTime","Series 1","Series 2","Series 3","Series 4"\n' +
        '"2014-01-01 00:00:00",1,2,3,4\n' +
        '"2014-01-02 00:00:00",2,3,4,5\n' +
        '"2014-01-03 00:00:00",3,4,5,6\n' +
        '"2014-01-04 00:00:00",4,5,6,7';
    assert.equal(
        $('#container').highcharts().getCSV(),
        csv,
        'Datetime with two series'
    );
    $('#container').highcharts().destroy();
});

QUnit.test('Numeric', function (assert) {
    $('#container').highcharts({
        title: {
            text: 'Numerix X axis chart'
        },

        series: [
            {
                data: [
                    29.9,
                    71.5,
                    106.4,
                    129.2,
                    144.0,
                    176.0,
                    135.6,
                    148.5,
                    216.4,
                    194.1,
                    95.6,
                    54.4
                ]
            }
        ]
    });

    var csv =
        '"Category","Series 1"\n' +
        '0,29.9\n' +
        '1,71.5\n' +
        '2,106.4\n' +
        '3,129.2\n' +
        '4,144\n' +
        '5,176\n' +
        '6,135.6\n' +
        '7,148.5\n' +
        '8,216.4\n' +
        '9,194.1\n' +
        '10,95.6\n' +
        '11,54.4';
    assert.equal(
        $('#container').highcharts().getCSV(),
        csv,
        'Basic numeric content'
    );
    $('#container').highcharts().destroy();
});

QUnit.test('Pie chart', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [
            {
                data: [
                    ['', 1], // #7404, missing name
                    ['Pears', 2],
                    ['Oranges', 3]
                ],
                type: 'pie'
            }
        ]
    });

    var csv =
        '"Category","Series 1"\n"",1\n"Pears",2\n"Oranges",3';

    assert.equal(chart.getCSV(), csv, 'Pie chart');

    chart.series[0].setData([
        ['p1', 1],
        ['p1', 2]
    ]);

    csv = '"Category","Series 1"\n"p1",1\n"p1",2';

    assert.equal(
        chart.getCSV(),
        csv,
        'Pie chart/sunburst with the same names (#10737).'
    );

    chart.destroy();
});

QUnit.test('Pie chart, multiple', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'pie'
        },
        title: {
            text: 'Donut'
        },
        plotOptions: {
            pie: {
                center: ['50%', '50%']
            }
        },
        series: [
            {
                name: 'Categories',
                data: [
                    ['Animals', 2],
                    ['Plants', 2]
                ],
                dataLabels: {
                    distance: -50
                },
                size: '60%'
            },
            {
                name: 'Subcategories',
                data: [
                    ['Cats', 1],
                    ['Dogs', 1],
                    ['Potatoes', 1],
                    ['Trees', 1]
                ],
                size: '80%',
                innerSize: '60%'
            }
        ],
        exporting: {
            showTable: true
        }
    });

    var csv = [
        '"Category","Categories","Subcategories"',
        '"Animals",2,',
        '"Cats",,1',
        '"Plants",2,',
        '"Dogs",,1',
        '"Potatoes",,1',
        '"Trees",,1'
    ].join('\n');

    assert.equal(chart.getCSV(), csv, 'Pie chart, multiple');
    chart.destroy();
});

QUnit.test('Bubble chart', function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'bubble'
        },
        series: [
            {
                lineWidth: 2,
                data: [
                    [1, 1, 1],
                    [1.5, 2, 2],
                    [2, 1, 3],
                    [2.5, 2, 4]
                ]
            }
        ],
        exporting: {
            csv: {
                // Don't use accessibility's extended formatter
                columnHeaderFormatter: function () {
                    return false; // Use built-in formatter
                }
            }
        }
    });
    var rows = chart.getDataRows();
    assert.equal(
        rows[0].join(','),
        'Category,Series 1 (y),Series 1 (z)',
        'All rows'
    );
});

QUnit.test('Scatter chart, multiple points on same X (#49)', function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'scatter'
        },
        series: [
            {
                lineWidth: 2,
                data: [
                    [1, 1],
                    [1, 2],
                    [2, 2],
                    [2, 1]
                ]
            }
        ]
    });
    var rows = chart.getDataRows();
    assert.equal(rows.length, 5, 'All points are added');
});

QUnit.test('Scatter chart, multiple series (#6761)', function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'scatter'
        },

        series: [
            {
                name: 'New York',
                data: [
                    {
                        x: -8,
                        y: 445.42
                    },
                    {
                        x: -7,
                        y: 450.83
                    }
                ]
            },
            {
                name: 'Tokyo',
                data: [
                    {
                        x: -12,
                        y: 594.25
                    },
                    {
                        x: -11,
                        y: 710.83
                    },
                    {
                        x: -6,
                        y: 549.58
                    }
                ]
            }
        ]
    });
    var rows = chart.getDataRows();
    assert.equal(rows.length, 6, 'All points are added');
});

QUnit.test('Heatmap, all points added', function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'heatmap'
        },
        series: [
            {
                data: [
                    [1, 1, 1],
                    [1, 2, 1],
                    [2, 2, 1],
                    [2, 1, 1]
                ]
            }
        ]
    });
    var rows = chart.getDataRows();
    assert.equal(rows.length, 5, 'All points are added');
    assert.equal(rows[0].length, 3, 'Three columns in headers');

    assert.equal(rows[1].length, 3, 'Three columns in data');
});

QUnit.test('Categories on Y axis', function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'bubble'
        },
        xAxis: {
            categories: ['xEin', 'xTo']
        },
        yAxis: {
            categories: ['yEin', 'yTo']
        },
        series: [
            {
                data: [
                    [0, 0, 1],
                    [0, 1, 1],
                    [1, 1, 1],
                    [1, 0, 1]
                ]
            }
        ]
    });
    var rows = chart.getDataRows();
    assert.equal(rows.length, 5, 'All points are added');
    assert.equal(rows[1].join(','), 'xEin,yEin,1', 'First row');
    assert.equal(rows[2].join(','), 'xEin,yTo,1', 'Second row');
});

QUnit.test('Datetime Y axis', function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container'
        },
        yAxis: {
            type: 'datetime'
        },
        series: [
            {
                data: [Date.UTC(2017, 0, 1), Date.UTC(2018, 0, 1)]
            }
        ]
    });
    var rows = chart.getDataRows();
    assert.equal(rows.length, 3, 'All points are added');
    assert.equal(rows[1].join(','), '0,2017-01-01 00:00:00', 'First row');
    assert.equal(rows[2].join(','), '1,2018-01-01 00:00:00', 'Second row');
});

QUnit.test('Datetime Y axis, column range', function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'columnrange'
        },
        yAxis: {
            type: 'datetime'
        },
        series: [
            {
                data: [
                    [Date.UTC(2017, 0, 1), Date.UTC(2017, 1, 1)],
                    [Date.UTC(2018, 0, 1), Date.UTC(2018, 1, 1)]
                ]
            }
        ]
    });
    var rows = chart.getDataRows();
    assert.equal(rows.length, 3, 'All points are added');
    assert.equal(
        rows[1].join(','),
        '0,2017-01-01 00:00:00,2017-02-01 00:00:00',
        'First row'
    );
    assert.equal(
        rows[2].join(','),
        '1,2018-01-01 00:00:00,2018-02-01 00:00:00',
        'Second row'
    );
});

QUnit.test('X axis title as column header', function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container'
        },
        xAxis: {
            categories: ['January', 'February'],
            title: {
                text: 'Month'
            }
        },
        series: [
            {
                data: [1, 2],
                name: 'Observation'
            }
        ]
    });
    var rows = chart.getDataRows();
    assert.equal(rows[0].join(','), 'Month,Observation', 'Axis title');
});

QUnit.test('Missing data in first series (#78)', function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container'
        },
        series: [
            {
                data: [
                    [0, 1],
                    [1, 1],
                    [3, 3],
                    [4, 4]
                ],
                name: 'Drop 2'
            },
            {
                data: [
                    [0, 1],
                    [1, 1],
                    [2, 2],
                    [3, 3],
                    [4, 4]
                ],
                name: 'Full'
            }
        ]
    });

    assert.deepEqual(
        chart
            .getTable()
            // Remove the extra attributes and caption tag that the
            // accessibility module added.
            .replace(/<table[^>]+>/g, '<table>')
            .replace('<caption>Chart title</caption>', '')
            .replace(/>/g, '>\n'),
        '<table><caption class=\"highcharts-table-caption\">Chart title</caption><thead><tr><th class=\"highcharts-text\" scope=\"col\">Category</th><th class=\"highcharts-text\" scope=\"col\">Drop 2</th><th class=\"highcharts-text\" scope=\"col\">Full</th></tr></thead><tbody><tr><th class=\"highcharts-number\" scope=\"row\">0</th><td class=\"highcharts-number\">1</td><td class=\"highcharts-number\">1</td></tr><tr><th class=\"highcharts-number\" scope=\"row\">1</th><td class=\"highcharts-number\">1</td><td class=\"highcharts-number\">1</td></tr><tr><th class=\"highcharts-number\" scope=\"row\">2</th><td class=\"highcharts-empty\"></td><td class=\"highcharts-number\">2</td></tr><tr><th class=\"highcharts-number\" scope=\"row\">3</th><td class=\"highcharts-number\">3</td><td class=\"highcharts-number\">3</td></tr><tr><th class=\"highcharts-number\" scope=\"row\">4</th><td class=\"highcharts-number\">4</td><td class=\"highcharts-number\">4</td></tr></tbody></table>'
            .replace(/>/g, '>\n'),
        'Empty data in table'
    );

    assert.equal(
        chart.getCSV(),
        '"Category","Drop 2","Full"\n0,1,1\n1,1,1\n2,,2\n3,3,3\n4,4,4',
        'Empty data in CSV'
    );
});

QUnit.test('Multiple X axes (#119)', function (assert) {
    var chart = new Highcharts.Chart('container', {
        title: {
            text: 'Categorized chart'
        },

        xAxis: [
            {
                categories: ['Jan', 'Feb', 'Mar']
            },
            {
                categories: ['Apples', 'Bananas', 'Oranges'],
                opposite: true
            }
        ],

        series: [
            {
                data: [3, 5, 6]
            },
            {
                data: [8, 9, 6],
                xAxis: 1
            },
            {
                data: [3, 6, 2],
                xAxis: 1
            }
        ]
    });

    assert.equal(
        chart.getCSV(),
        '"Category","Series 1","Category","Series 2","Series 3"\n"Jan",3,"Apples",8,3\n"Feb",5,"Bananas",9,6\n"Mar",6,"Oranges",6,2',
        'Multiple X axes'
    );
});

QUnit.test('Stock chart', function (assert) {
    var chart = Highcharts.stockChart('container', {
        chart: {
            renderTo: 'container'
        },

        navigator: {
            series: {
                includeInDataExport: false
            }
        },
        series: [
            {
                data: [1, 3, 2, 4],
                pointStart: Date.UTC(2013, 0, 1),
                pointInterval: 24 * 36e5
            }
        ],

        exporting: {
            csv: {
                dateFormat: '%Y-%m-%d'
            }
        }
    });

    assert.equal(
        chart.getCSV(),
        '"DateTime","Series 1"\n"2013-01-01",1\n"2013-01-02",3\n"2013-01-03",2\n"2013-01-04",4',
        'Stock chart'
    );
});

QUnit.test('Combined column and scatter', function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container'
        },

        plotOptions: {
            series: {
                pointStart: 0,
                pointInterval: 10
            }
        },

        series: [
            {
                data: [1, 2, 3, 4],
                type: 'column'
            },
            {
                data: [2, 4, 6, 8],
                name: 'Total',
                type: 'scatter'
            }
        ]
    });

    assert.equal(
        chart.getCSV(),
        '"Category","Series 1","Total"\n0,1,2\n10,2,4\n20,3,6\n30,4,8',
        'Combination chart'
    );
});

QUnit.test('Item delimiter and decimal point', function (assert) {

    /* eslint no-extend-native: 0 */
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container'
        },

        xAxis: {
            categories: ['Apples', 'Pears']
        },

        series: [
            {
                data: [1.3, 2.1]
            }
        ]
    });

    assert.equal(
        chart.getCSV(),
        '"Category","Series 1"\n"Apples",1.3\n"Pears",2.1',
        'Default values without useLocalDecimalPoint'
    );

    // Automatic detection
    var toLocaleString = Number.prototype.toLocaleString;

    Number.prototype.toLocaleString = function () {
        // eslint-disable-line no-extend-native
        return String(this).replace('.', ',');
    };
    assert.equal(
        chart.getCSV(true),
        '"Category";"Series 1"\n"Apples";1,3\n"Pears";2,1',
        'Auto-detect European locale'
    );

    Number.prototype.toLocaleString = function () {
        // eslint-disable-line no-extend-native
        return String(this).replace(',', '.');
    };
    assert.equal(
        chart.getCSV(true),
        '"Category","Series 1"\n"Apples",1.3\n"Pears",2.1',
        'Auto-detect Anglo-american locale'
    );
    // Reset
    Number.prototype.toLocaleString = toLocaleString; // eslint-disable-line no-extend-native

    // Explicit options
    chart.update({
        exporting: {
            csv: {
                decimalPoint: '_',
                itemDelimiter: '|'
            }
        }
    });
    assert.equal(
        chart.getCSV(true),
        '"Category"|"Series 1"\n"Apples"|1_3\n"Pears"|2_1',
        'Explicit decimalPoint and itemDelimiter with useLocalDecimalPoint'
    );
    assert.equal(
        chart.getCSV(),
        '"Category"|"Series 1"\n"Apples"|1_3\n"Pears"|2_1',
        'Explicit decimalPoint and itemDelimiter without useLocalDecimalPoint'
    );

});

QUnit.test('Zoomed chart', function (assert) {
    var numberOfPoints = 400,
        data = [],
        i = 0;

    for (; i < numberOfPoints; i++) {
        data.push(i);
    }

    var chart = Highcharts.chart('container', {
        xAxis: {
            min: 50,
            max: 70
        },
        series: [
            {
                data: data,
                marker: {
                    enabled: false
                }
            }
        ]
    });

    assert.strictEqual(
        chart.getDataRows().length,
        401,
        'All data points should be exported (#7913)'
    );
});

QUnit.test('Boosted chart', function (assert) {
    var chart = Highcharts.chart('container', {
        plotOptions: {
            series: {
                pointStart: 0,
                pointInterval: 10
            }
        },

        series: [
            {
                data: [1, 2, 3, 4],
                boostThreshold: 1
            }
        ]
    });

    assert.deepEqual(
        chart.getDataRows(),
        [
            ['Category', 'Series 1'],
            [0, 1],
            [10, 2],
            [20, 3],
            [30, 4]
        ],
        'Boosted chart'
    );
});

QUnit.test('Gantt chart', function (assert) {
    var chart = Highcharts.ganttChart('container', {
        title: {
            text: 'Simple Gantt Chart'
        },
        series: [
            {
                name: 'Project 1',
                data: [
                    {
                        id: 's',
                        name: 'Start prototype',
                        start: Date.UTC(2014, 10, 18),
                        end: Date.UTC(2014, 10, 20)
                    },
                    {
                        id: 'b',
                        name: 'Develop',
                        start: Date.UTC(2014, 10, 20),
                        end: Date.UTC(2014, 10, 25),
                        dependency: 's'
                    },
                    {
                        id: 'a',
                        name: 'Run acceptance tests',
                        start: Date.UTC(2014, 10, 23),
                        end: Date.UTC(2014, 10, 26)
                    },
                    {
                        name: 'Test prototype',
                        start: Date.UTC(2014, 10, 27),
                        end: Date.UTC(2014, 10, 29),
                        dependency: ['a', 'b']
                    }
                ]
            }
        ]
    });

    assert.deepEqual(
        chart.getDataRows(),
        [
            [
                'DateTime',
                'Project 1 (start)',
                'Project 1 (end)',
                'Project 1 (y)'
            ],
            [
                'Start prototype',
                '2014-11-18 00:00:00',
                '2014-11-20 00:00:00',
                'Start prototype'
            ],
            [
                'Develop',
                '2014-11-20 00:00:00',
                '2014-11-25 00:00:00',
                'Develop'
            ],
            [
                'Run acceptance tests',
                '2014-11-23 00:00:00',
                '2014-11-26 00:00:00',
                'Run acceptance tests'
            ],
            [
                'Test prototype',
                '2014-11-27 00:00:00',
                '2014-11-29 00:00:00',
                'Test prototype'
            ]
        ],
        'Gantt chart'
    );
});

QUnit.test('X-range chart', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'xrange'
        },
        title: {
            text: 'Simple X-range Chart'
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: ''
            },
            categories: ['Prototyping', 'Development', 'Testing'],
            reversed: true
        },
        series: [{
            name: 'Project 1',
            data: [{
                x: Date.UTC(2023, 10, 21),
                x2: Date.UTC(2023, 11, 2),
                name: 'Start prototype',
                y: 0
            }, {
                x: Date.UTC(2023, 11, 2),
                x2: Date.UTC(2023, 11, 5),
                name: 'Develop',
                y: 1
            }, {
                x: Date.UTC(2023, 11, 10),
                x2: Date.UTC(2023, 11, 23),
                name: 'Run acceptance tests',
                y: 2
            }]
        }]
    });

    assert.deepEqual(
        chart.getDataRows(),
        [
            [
                'DateTime',
                'Project 1 (x)',
                'Project 1 (x2)',
                'Project 1 (y)'
            ],
            [
                'Start prototype',
                '2023-11-21 00:00:00',
                '2023-12-02 00:00:00',
                'Prototyping'
            ],
            [
                'Develop',
                '2023-12-02 00:00:00',
                '2023-12-05 00:00:00',
                'Development'
            ],
            [
                'Run acceptance tests',
                '2023-12-10 00:00:00',
                '2023-12-23 00:00:00',
                'Testing'
            ]
        ],
        'X-range chart (#14108).'
    );
});

QUnit.test('Parallel coordinates', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                parallelCoordinates: true
            },
            yAxis: [
                {
                    type: 'datetime'
                },
                {
                    categories: ['a', 'b', 'c']
                },
                {
                    type: 'linear'
                }
            ],

            series: [
                {
                    data: [1563494433000, 1, -1000]
                }
            ]
        }),
        csv = chart.getCSV().split('\n');

    assert.strictEqual(
        csv[1],
        '0,"2019-07-19 00:00:33"',
        'Value should be translated to datetime format (#11477)'
    );

    assert.strictEqual(
        csv[2],
        '1,"b"',
        'Value should be translated to category name (#11477)'
    );

    assert.strictEqual(
        csv[3],
        '2,-1000',
        'Value should not be translated (#11477)'
    );
});

QUnit.test('Descending categories', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            xAxis: {
                type: 'category'
            },
            series: [
                {
                    name: 'New',
                    data: [
                        {
                            name: 'Category 1',
                            y: 34
                        }
                    ]
                },
                {
                    name: 'In Progress',
                    data: [
                        {
                            name: 'Category 2',
                            y: 16
                        },
                        {
                            name: 'Category 1',
                            y: 66
                        }
                    ]
                }
            ],
            exporting: {
                showTable: true
            }
        }),
        csv = chart.getCSV().split('\n');

    assert.strictEqual(
        csv[2],
        '"Category 1",34,66',
        'First point should be in Category 2 (#12767)'
    );
});

QUnit.test('Point name (#13293)', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [
                {
                    data: [
                        {
                            x: 1,
                            y: 9,
                            name: 'Point2'
                        },
                        {
                            x: 2,
                            y: 6,
                            name: 'Point1'
                        }
                    ]
                },
                {
                    data: [
                        {
                            x: 20,
                            y: 9
                        },
                        {
                            x: 30,
                            y: 6
                        }
                    ]
                }
            ],
            exporting: {
                showTable: true
            }
        }),
        csv =
            '"Category","Series 1 (x)","Series 1 (y)","Series 2"\n' +
            '"Point2",1,9,\n' +
            '"Point1",2,6,\n' +
            '20,,,9\n' +
            '30,,,6';

    assert.strictEqual(
        chart.getCSV(),
        csv,
        'The first series should render point name, y and x value (#13293)'
    );
});

QUnit.test('Point name with category (#13293)', function (assert) {
    var chart = Highcharts.chart('container', {
            xAxis: {
                type: 'category'
            },
            series: [
                {
                    data: [
                        {
                            x: 1,
                            y: 9,
                            name: 'Point2'
                        },
                        {
                            x: 2,
                            y: 6,
                            name: 'Point1'
                        }
                    ]
                },
                {
                    data: [
                        {
                            x: 20,
                            y: 9
                        },
                        {
                            x: 30,
                            y: 6
                        }
                    ]
                }
            ],
            exporting: {
                showTable: true
            }
        }),
        csv =
            '"Category","Series 1","Series 2"\n' +
            '"Point2",9,\n' +
            '"Point1",6,\n' +
            '20,,9\n' +
            '30,,6';

    assert.strictEqual(
        chart.getCSV(),
        csv,
        'The first series should render just a point name and y value (#13293)'
    );
});

QUnit.test('Toggle data table (#13690)', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [
            {
                data: [2, 5, 1, 6, 7]
            }
        ]
    });

    assert.notOk(chart.dataTableDiv, 'Table should not be visible.');
    chart.viewData();

    assert.ok(chart.dataTableDiv, 'Table should be visible.');
    chart.hideData();

    assert.strictEqual(
        chart.dataTableDiv.style.display,
        'none',
        'Table should not be visible again.'
    );

    chart.viewData();
    const csv = '"Category","Series 1"\n' +
        '0,2\n' +
        '1,5\n' +
        '2,1\n' +
        '3,6\n' +
        '4,7';
    assert.strictEqual(
        csv,
        chart.getCSV(),
        'The table should show the values.'
    );

    chart.series[0].update({
        data: [7, 6, 5, 4, 3]
    });
    const csvUpdated = '"Category","Series 1"\n' +
        '0,7\n' +
        '1,6\n' +
        '2,5\n' +
        '3,4\n' +
        '4,3';
    assert.strictEqual(
        csvUpdated,
        chart.getCSV(),
        'The table should re-render after a data update, #14320.'
    );
    chart.hideData();
});

QUnit.test('Point without y data, but with value (#13785)', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [
                {
                    type: 'sunburst',
                    data: [
                        {
                            id: '1',
                            name: 'test'
                        },
                        {
                            parent: '1',
                            name: 'test1',
                            value: 5
                        },
                        {
                            parent: '1',
                            name: 'test2',
                            value: 10
                        },
                        {
                            parent: '1',
                            name: 'test3',
                            value: 15
                        }
                    ]
                }
            ],
            exporting: {
                showTable: true
            }
        }),
        csv =
            '"Category","Series 1"\n' +
            '"test",\n' +
            '"test1",5\n' +
            '"test2",10\n' +
            '"test3",15';

    assert.strictEqual(
        chart.getCSV(),
        csv,
        'The table should render category name and value (#13785)'
    );
});

QUnit.test('Sortable table (#16972)', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        xAxis: {
            categories: ['NL', 'ES', 'DE', 'BE', 'NO']
        },
        series: [{
            name: 'Import',
            data: [100, 80, 60, 50, 70]
        },
        {
            name: 'Export',
            data: [20, 10, 30, 40, 50]
        }
        ],
        exporting: {
            showTable: true,
            allowTableSorting: false
        }
    });

    chart.dataTableDiv.children[0].children[1].children[0].children[0].click();

    assert.strictEqual(
        chart.dataTableDiv.children[0].children[2].children[0].children[0]
            .innerText,
        'NL',
        `Data order in table should not change when allowTableSorting equals
        false, #18007.`
    );

    chart.update({
        exporting: {
            allowTableSorting: true
        }
    });

    chart.dataTableDiv.children[0].children[1].children[0].children[0].click();

    assert.strictEqual(
        chart.dataTableDiv.children[0].children[3].children[0].innerText,
        'BE',
        'After clicking on the row header, table content should be sorted.'
    );
    assert.strictEqual(
        chart.dataTableDiv.children[0].children[3].children[1].innerText,
        '50',
        'After sorting, values should correspond to the one on the chart.'
    );
    assert.strictEqual(
        chart.dataTableDiv.children[0].children[4].children[0].innerText,
        'DE',
        'After clicking on the row header, table content should be sorted.'
    );
    assert.strictEqual(
        chart.dataTableDiv.children[0].children[4].children[1].innerText,
        '60',
        'After sorting, values should correspond to the one on the chart.'
    );

    chart.dataTableDiv.children[0].children[1].children[0].children[0].click();
    assert.strictEqual(
        chart.dataTableDiv.children[0].children[3].children[0].innerText,
        'NO',
        'After clicking on the row header, table content should be resorted.'
    );
    assert.strictEqual(
        chart.dataTableDiv.children[0].children[3].children[1].innerText,
        '70',
        'After sorting, values should correspond to the one on the chart.'
    );
    assert.strictEqual(
        chart.dataTableDiv.children[0].children[4].children[0].innerText,
        'NL',
        'After clicking on the row header, table content should be resorted.'
    );
    assert.strictEqual(
        chart.dataTableDiv.children[0].children[4].children[1].innerText,
        '100',
        'After sorting, values should correspond to the one on the chart.'
    );
});

QUnit.test('Exporting duplicated points (#17639)', function (assert) {
    function getSeriesFromDataRows(dataRows, isCategoryType = false) {
        const series = [];
        dataRows.forEach((row, i) => {
            if (i > 0) { // ommit names of series
                row.seriesIndices.forEach(sIdx => {
                    if (!series[sIdx]) {
                        series[sIdx] = {
                            data: []
                        };
                    }
                    if (!isCategoryType) {
                        series[sIdx].data.push([row[0], row[sIdx + 1]]);
                    } else {
                        series[sIdx].data.push(row[sIdx + 1]);
                    }
                });
            }
        });
        return series;
    }

    let series = [{
        data: [[1, 1], [2, 3], [3, 4], [4, 3]]
    }];

    const chart = Highcharts.chart('container', {
        series: series
    });

    assert.deepEqual(
        getSeriesFromDataRows(chart.getDataRows()),
        series,
        'Exported data of one series should be same as actual, #17639.'
    );

    series = [{
        data: [[1, 1], [2, 3], [3, 4], [4, 3]]
    }, {
        data: [[1, 4], [2, 3], [3, 2], [4, 1]]
    }, {
        data: [[1, 5], [2, 8], [3, 2], [4, 13]]
    }];

    while (chart.series.length) {
        chart.series[0].remove(false);
    }
    series.forEach(series => {
        chart.addSeries(series, false);
    });
    chart.redraw();

    assert.deepEqual(
        getSeriesFromDataRows(chart.getDataRows()),
        series,
        'Exported data of multiple series should be same as actual, #17639.'
    );

    series = [{
        data: [[1, 1], [2, 3], [3, 4], [4, 3]]
    }, {
        data: [[5, 4], [8, 3], [13, 2], [20, 1]]
    }];

    while (chart.series.length) {
        chart.series[0].remove(false);
    }
    series.forEach(series => {
        chart.addSeries(series, false);
    });
    chart.redraw();

    assert.deepEqual(
        getSeriesFromDataRows(chart.getDataRows()),
        series,
        `Exported data of multiple series with different x-values should be same
        as actual, #17639.`
    );

    series = [{
        data: [[1, 1], [2, 3], [2, 6], [2, 1], [3, 4], [4, 3]]
    }, {
        data: [[1, 1], [2, 3], [3, 4], [3, 10], [3, -4], [3, 15], [4, 3]]
    }];

    while (chart.series.length) {
        chart.series[0].remove(false);
    }
    series.forEach(series => {
        chart.addSeries(series, false);
    });
    chart.redraw();

    assert.deepEqual(
        getSeriesFromDataRows(chart.getDataRows()),
        series,
        `Exported data of multiple series with some duplicated x-values should
        be same as actual, #17639.`
    );

    series = [{
        data: [[5, 1], [5, 3], [5, 6], [5, 1]]
    }, {
        data: [[5, 1], [5, 3], [5, 4], [5, 10], [5, -4]]
    }];

    while (chart.series.length) {
        chart.series[0].remove(false);
    }
    series.forEach(series => {
        chart.addSeries(series, false);
    });
    chart.redraw();

    assert.deepEqual(
        getSeriesFromDataRows(chart.getDataRows()),
        series,
        `Exported data of multiple series with only duplicated x-values should
        be same as actual, #17639.`
    );

    series = [{
        data: [
            [Date.UTC(2022, 0, 1), 1], [Date.UTC(2022, 0, 1), 2],
            [Date.UTC(2022, 0, 1), 3], [Date.UTC(2022, 0, 1), 4]
        ]
    }, {
        data: [
            [Date.UTC(2022, 0, 2), 1], [Date.UTC(2022, 0, 2), 2],
            [Date.UTC(2022, 0, 2), 3], [Date.UTC(2022, 0, 2), 4]
        ]
    }];

    while (chart.series.length) {
        chart.series[0].remove(false);
    }
    series.forEach(series => {
        chart.addSeries(series, false);
    });
    chart.xAxis[0].update({
        type: 'datetime'
    });

    const time = chart.time,
        csvOptions = (
            (chart.options.exporting && chart.options.exporting.csv) || {}
        );

    assert.deepEqual(
        getSeriesFromDataRows(chart.getDataRows()),
        series.map(series => // set the same date format as in exported data
            ({
                data: series.data.map(el =>
                    [time.dateFormat(csvOptions.dateFormat, el[0]), el[1]]
                )
            })
        ),
        `Exported data of multiple datetime series with duplicated x-values
        should be same as actual, #17639.`
    );

    series = [{
        data: [7, 13, -28, 4, 11]
    }, {
        data: [5, 1, -8, 12, -3]
    }];

    while (chart.series.length) {
        chart.series[0].remove(false);
    }
    series.forEach(series => {
        chart.addSeries(series, false);
    });
    chart.xAxis[0].update({
        type: 'category',
        categories: ['A', 'B', 'C', 'D', 'E']
    });

    assert.deepEqual(
        getSeriesFromDataRows(chart.getDataRows(), true),
        series,
        `Exported data of multiple series with xAxis type set to category
        should be same as actual, #17639.`
    );
});
