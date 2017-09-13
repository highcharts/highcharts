QUnit.test("Categorized", function (assert) {
    $('#container').highcharts({
        title: {
            text: 'Categorized chart'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]

    });
    assert.equal(
        $('#container').highcharts().getCSV(),
        document.getElementById('test1').innerHTML,
        "Basic categorized content"
    );

    $('#container').highcharts().addSeries({
        data: [1, 2, 3, 4, 5, 6, 7, 7],
        visible: false
    });

    assert.equal(
        $('#container').highcharts().getCSV(),
        document.getElementById('test1').innerHTML,
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
    assert.equal(
        $('#container').highcharts().getCSV(),
        document.getElementById('pie').innerHTML,
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
    assert.equal(
        $('#container').highcharts().getCSV(),
        document.getElementById('test2').innerHTML,
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
    assert.equal(
        $('#container').highcharts().getCSV(),
        document.getElementById('datetime-multi').innerHTML,
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
    assert.equal(
        $('#container').highcharts().getCSV(),
        document.getElementById('test3').innerHTML,
        "Basic numeric content"
    );
    $('#container').highcharts().destroy();
});


QUnit.test("Pie chart", function (assert) {
    $('#container').highcharts({
        series: [{
            data: [
                ['Apples', 1],
                ['Pears', 2],
                ['Oranges', 3]
            ],
            type: 'pie'
        }]
    });
    assert.equal(
        $('#container').highcharts().getCSV(),
        document.getElementById('pie').innerHTML,
        "Pie chart"
    );
    $('#container').highcharts().destroy();
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
        }]
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
        chart.getTable(),
        "<table><thead><tr><th class=\"text\">Category</th><th class=\"text\">Drop 2</th><th class=\"text\">Full</th></tr></thead><tbody><tr><td class=\"number\">0</td><td class=\"number\">1</td><td class=\"number\">1</td></tr><tr><td class=\"number\">1</td><td class=\"number\">1</td><td class=\"number\">1</td></tr><tr><td class=\"number\">2</td><td class=\"text\"></td><td class=\"number\">2</td></tr><tr><td class=\"number\">3</td><td class=\"number\">3</td><td class=\"number\">3</td></tr><tr><td class=\"number\">4</td><td class=\"number\">4</td><td class=\"number\">4</td></tr></tbody></table>",
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
