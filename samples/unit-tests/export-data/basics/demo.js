QUnit.test("Categorized", function (assert) {
    $('#container').highcharts({
        title: {
            text: 'Categorized chart'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 0, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]

    });

    var csv = '"Category","Series 1"\n' +
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
        "Basic categorized content"
    );

    $('#container').highcharts().addSeries({
        data: [1, 2, 3, 4, 5, 6, 7, 7],
        visible: false
    });

    assert.equal(
        $('#container').highcharts().getCSV(),
        csv,
        "Added invisible series"
    );
    $('#container').highcharts().destroy();
});


QUnit.test("Named points", function (assert) {
    $('#container').highcharts({
        title: {
            text: 'Named points'
        },

        xAxis: {
            type: 'category'
        },

        series: [{
            data: [
                ['Apples', 1],
                ['Pears', 2],
                ['Oranges', 3]
            ]
        }]
    });

    var csv = '"Category","Series 1"\n' +
        '"Apples",1\n' +
        '"Pears",2\n' +
        '"Oranges",3';

    assert.equal(
        $('#container').highcharts().getCSV(),
        csv,
        "Named points"
    );

    $('#container').highcharts().destroy();
});


QUnit.test("Datetime", function (assert) {
    $('#container').highcharts({
        title: {
            text: 'Datetime chart'
        },

        xAxis: {
            type: 'datetime'
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            pointStart: Date.UTC(2014, 0, 1),
            pointInterval: 24 * 36e5
        }]
    });

    var csv = '"DateTime","Series 1"\n' +
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
        "Basic datetime content"
    );
    $('#container').highcharts().destroy();
});


QUnit.test("Datetime multiseries", function (assert) {
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

        series: [{
            data: [1, 2, 3, 4]
        }, {
            data: [2, 3, 4, 5]
        }, {
            data: [3, 4, 5, 6]
        }, {
            data: [4, 5, 6, 7]
        }]
    });

    var csv = '"DateTime","Series 1","Series 2","Series 3","Series 4"\n' +
        '"2014-01-01 00:00:00",1,2,3,4\n' +
        '"2014-01-02 00:00:00",2,3,4,5\n' +
        '"2014-01-03 00:00:00",3,4,5,6\n' +
        '"2014-01-04 00:00:00",4,5,6,7';
    assert.equal(
        $('#container').highcharts().getCSV(),
        csv,
        "Datetime with two series"
    );
    $('#container').highcharts().destroy();
});


QUnit.test("Numeric", function (assert) {
    $('#container').highcharts({
        title: {
            text: 'Numerix X axis chart'
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });

    var csv = '"Category","Series 1"\n' +
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
        "Basic numeric content"
    );
    $('#container').highcharts().destroy();
});


QUnit.test("Pie chart", function (assert) {
    $('#container').highcharts({
        series: [{
            data: [
                ['', 1], // #7404, missing name
                ['Pears', 2],
                ['Oranges', 3]
            ],
            type: 'pie'
        }]
    });

    var csv = '"Category","Series 1"\n' +
        '"",1\n' +
        '"Pears",2\n' +
        '"Oranges",3';

    assert.equal(
        $('#container').highcharts().getCSV(),
        csv,
        "Pie chart"
    );
    $('#container').highcharts().destroy();
});


QUnit.test("Pie chart, multiple", function (assert) {
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
        series: [{
            name: 'Categories',
            data: [
                ['Animals', 2],
                ['Plants', 2]
            ],
            dataLabels: {
                distance: -50
            },
            size: '60%'
        }, {
            name: 'Subcategories',
            data: [
                ['Cats', 1],
                ['Dogs', 1],
                ['Potatoes', 1],
                ['Trees', 1]
            ],
            size: '80%',
            innerSize: '60%'
        }],
        exporting: {
            showTable: true
        }
    });

    var csv = [
        '"Category","Categories","Subcategories"',
        '"Animals",2',
        '"Cats",,1',
        '"Plants",2',
        '"Dogs",,1',
        '"Potatoes",,1',
        '"Trees",,1'
    ].join("\n");

    assert.equal(
        chart.getCSV(),
        csv,
        "Pie chart, multiple"
    );
    chart.destroy();
});


QUnit.test("Bubble chart", function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'bubble'
        },
        series: [{
            lineWidth: 2,
            data: [
                [1, 1, 1],
                [1.5, 2, 2],
                [2, 1, 3],
                [2.5, 2, 4]
            ]
        }],
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
        "All rows"
    );
});


QUnit.test("Scatter chart, multiple points on same X (#49)", function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'scatter'
        },
        series: [{
            lineWidth: 2,
            data: [
                [1, 1],
                [1, 2],
                [2, 2],
                [2, 1]
            ]
        }]
    });
    var rows = chart.getDataRows();
    assert.equal(
        rows.length,
        5,
        "All points are added"
    );
});


QUnit.test("Scatter chart, multiple series (#6761)", function (assert) {
    var chart = new Highcharts.Chart({

        chart: {
            renderTo: 'container',
            type: 'scatter'
        },

        series: [{
            name: 'New York',
            data: [{
                x: -8,
                y: 445.42
            }, {
                x: -7,
                y: 450.83
            }]
        }, {
            name: 'Tokyo',
            data: [{
                x: -12,
                y: 594.25
            }, {
                x: -11,
                y: 710.83
            }, {
                x: -6,
                y: 549.58
            }]
        }]

    });
    var rows = chart.getDataRows();
    assert.equal(
        rows.length,
        6,
        "All points are added"
    );
});


QUnit.test("Heatmap, all points added", function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'heatmap'
        },
        series: [{
            data: [
                [1, 1, 1],
                [1, 2, 1],
                [2, 2, 1],
                [2, 1, 1]
            ]
        }]
    });
    var rows = chart.getDataRows();
    assert.equal(
        rows.length,
        5,
        "All points are added"
    );
    assert.equal(
        rows[0].length,
        3,
        "Three columns in headers"
    );

    assert.equal(
        rows[1].length,
        3,
        "Three columns in data"
    );
});


QUnit.test("Categories on Y axis", function (assert) {
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
        series: [{
            data: [
                [0, 0, 1],
                [0, 1, 1],
                [1, 1, 1],
                [1, 0, 1]
            ]
        }]
    });
    var rows = chart.getDataRows();
    assert.equal(
        rows.length,
        5,
        "All points are added"
    );
    assert.equal(
        rows[1].join(','),
        'xEin,yEin,1',
        "First row"
    );
    assert.equal(
        rows[2].join(','),
        'xEin,yTo,1',
        "Second row"
    );
});

QUnit.test('Datetime Y axis', function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container'
        },
        yAxis: {
            type: 'datetime'
        },
        series: [{
            data: [
                Date.UTC(2017, 0, 1),
                Date.UTC(2018, 0, 1)
            ]
        }]
    });
    var rows = chart.getDataRows();
    assert.equal(
        rows.length,
        3,
        "All points are added"
    );
    assert.equal(
        rows[1].join(','),
        '0,2017-01-01 00:00:00',
        "First row"
    );
    assert.equal(
        rows[2].join(','),
        '1,2018-01-01 00:00:00',
        "Second row"
    );
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
        series: [{
            data: [
                [Date.UTC(2017, 0, 1), Date.UTC(2017, 1, 1)],
                [Date.UTC(2018, 0, 1), Date.UTC(2018, 1, 1)]
            ]
        }]
    });
    var rows = chart.getDataRows();
    assert.equal(
        rows.length,
        3,
        "All points are added"
    );
    assert.equal(
        rows[1].join(','),
        '0,2017-01-01 00:00:00,2017-02-01 00:00:00',
        "First row"
    );
    assert.equal(
        rows[2].join(','),
        '1,2018-01-01 00:00:00,2018-02-01 00:00:00',
        "Second row"
    );
});


QUnit.test("X axis title as column header", function (assert) {
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
        series: [{
            data: [1, 2],
            name: 'Observation'
        }]
    });
    var rows = chart.getDataRows();
    assert.equal(
        rows[0].join(','),
        'Month,Observation',
        'Axis title'
    );
});


QUnit.test('Missing data in first series (#78)', function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container'
        },
        series: [{
            data: [[0, 1], [1, 1], [3, 3], [4, 4]],
            name: 'Drop 2'
        }, {
            data: [[0, 1], [1, 1], [2, 2], [3, 3], [4, 4]],
            name: 'Full'
        }]
    });

    assert.equal(
        chart.getTable()
            // Remove the extra attributes and caption tag that the
            // accessibility module added.
            .replace(/<table[^>]+>/g, '<table>')
            .replace('<caption>Chart title</caption>', ''),
        '<table><caption class="highcharts-table-caption">Chart title</caption><thead><tr><th scope="col" class="text">Category</th><th scope="col" class="text">Drop 2</th><th scope="col" class="text">Full</th></tr></thead><tbody><tr><th scope="row" class="number">0</th><td class="number">1</td><td class="number">1</td></tr><tr><th scope="row" class="number">1</th><td class="number">1</td><td class="number">1</td></tr><tr><th scope="row" class="number">2</th>' +
        '<td class="empty"></td><td class="number">2</td></tr><tr><th scope="row" class="number">3</th><td class="number">3</td><td class="number">3</td></tr><tr><th scope="row" class="number">4</th><td class="number">4</td><td class="number">4</td></tr></tbody></table>',
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

        xAxis: [{
            categories: ['Jan', 'Feb', 'Mar']
        }, {
            categories: ['Apples', 'Bananas', 'Oranges'],
            opposite: true
        }],

        series: [{
            data: [3, 5, 6]
        }, {
            data: [8, 9, 6],
            xAxis: 1
        }, {
            data: [3, 6, 2],
            xAxis: 1
        }]
    });

    assert.equal(
        chart.getCSV(),
        '\"Category\",\"Series 1\",\"Category\",\"Series 2\",\"Series 3\"\n\"Jan\",3,\"Apples\",8,3\n\"Feb\",5,\"Bananas\",9,6\n\"Mar\",6,\"Oranges\",6,2',
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
                includeInCSVExport: false
            }
        },
        series: [{
            data: [1, 3, 2, 4],
            pointStart: Date.UTC(2013, 0, 1),
            pointInterval: 24 * 36e5
        }],

        exporting: {
            csv: {
                dateFormat: '%Y-%m-%d'
            }
        }
    });

    assert.equal(
        chart.getCSV(),
        '\"DateTime\",\"Series 1\"\n\"2013-01-01\",1\n\"2013-01-02\",3\n\"2013-01-03\",2\n\"2013-01-04\",4',
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

        series: [{
            data: [1, 2, 3, 4],
            type: 'column'
        }, {
            data: [2, 4, 6, 8],
            name: 'Total',
            type: 'scatter'
        }]

    });

    assert.equal(
        chart.getCSV(),
        '"Category","Series 1","Total"\n0,1,2\n10,2,4\n20,3,6\n30,4,8',
        'Combination chart'
    );
});

QUnit.test('Item delimiter and decimal point', function (assert) {
    var chart = new Highcharts.Chart({

        chart: {
            renderTo: 'container'
        },

        xAxis: {
            categories: ['Apples', 'Pears']
        },

        series: [{
            data: [1.3, 2.1]
        }]

    });


    assert.equal(
        chart.getCSV(),
        '"Category","Series 1"\n"Apples",1.3\n"Pears",2.1',
        'Default values without useLocalDecimalPoint'
    );

    // Automatic detection
    var toLocaleString = Number.prototype.toLocaleString;

    Number.prototype.toLocaleString = function () { // eslint-disable-line no-extend-native
        return String(this).replace('.', ',');
    };
    assert.equal(
        chart.getCSV(true),
        '"Category";"Series 1"\n"Apples";1,3\n"Pears";2,1',
        'Auto-detect European locale'
    );

    Number.prototype.toLocaleString = function () { // eslint-disable-line no-extend-native
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
        series: [{
            data: data,
            marker: {
                enabled: false
            }
        }]
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

        series: [{
            data: [1, 2, 3, 4],
            boostThreshold: 1
        }]

    });

    assert.deepEqual(
        chart.getDataRows(),
        [
            ["Category", "Series 1"],
            [0, 1],
            [10, 2],
            [20, 3],
            [30, 4]
        ],
        'Boosted chart'
    );
});
