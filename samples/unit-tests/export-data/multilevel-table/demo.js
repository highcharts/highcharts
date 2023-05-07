/* eslint-disable max-len */
QUnit.test('Bullet chart', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'bullet'
        },
        yAxis: {
            title: {
                text: 'Parts per billion'
            }
        },
        xAxis: {
            categories: [
                2005,
                2006,
                2007,
                2008,
                2009,
                2010,
                2011,
                2012,
                2013,
                2014,
                2015,
                2016
            ],
            title: {
                text: 'Year'
            }
        },
        series: [
            {
                name: 'Bullet Series 1',
                data: [
                    {
                        x: 7,
                        y: 28,
                        target: 33.6
                    },
                    {
                        x: 8,
                        y: 27,
                        target: 32.8
                    }
                ]
            },
            {
                name: 'Bullet Series 2',
                data: [
                    {
                        x: 7,
                        y: 50.9,
                        target: 60.5
                    },
                    {
                        x: 8,
                        y: 49.3,
                        target: 56.3
                    }
                ]
            },
            {
                name: 'Line series',
                data: [
                    [6, 62],
                    [7, 62],
                    [8, 62]
                ],
                type: 'line'
            },
            {
                name: 'Bullet Series 3',
                data: [
                    {
                        x: 8,
                        y: 6.5,
                        target: 8
                    }
                ]
            },
            {
                name: 'Bullet Series 4',
                data: [
                    {
                        x: 7,
                        y: 2.4,
                        target: 1.4
                    },
                    {
                        x: 8,
                        y: 3.7,
                        target: 1.3
                    },
                    {
                        x: 9,
                        y: 1.9,
                        target: 1.3
                    }
                ]
            }
        ]
    });
    chart.viewData();

    assert.equal(
        chart
            .getTable()
            // Remove the extra attributes from accessibility module, needed if
            // running as "gulp test".
            .replace(/<table[^>]+>/g, '<table>')
            .replace(/>/g, '>\n'),
        `<table>
<caption class=\"highcharts-table-caption\">
Chart title</caption>
<thead>
<tr>
<th class=\"highcharts-text highcharts-table-topheading\" scope=\"col\" valign=\"top\" rowspan=\"2\">
Year</th>
<th class=\"highcharts-text highcharts-table-topheading\" scope=\"col\" colspan=\"2\">
Bullet Series 1</th>
<th class=\"highcharts-text highcharts-table-topheading\" scope=\"col\" colspan=\"2\">
Bullet Series 2</th>
<th class=\"highcharts-text highcharts-table-topheading\" scope=\"col\" valign=\"top\" rowspan=\"2\">
Line series</th>
<th class=\"highcharts-text highcharts-table-topheading\" scope=\"col\" colspan=\"2\">
Bullet Series 3</th>
<th class=\"highcharts-text highcharts-table-topheading\" scope=\"col\" colspan=\"2\">
Bullet Series 4</th>
</tr>
<tr>
<th class=\"highcharts-text\" scope=\"col\">
y</th>
<th class=\"highcharts-text\" scope=\"col\">
target</th>
<th class=\"highcharts-text\" scope=\"col\">
y</th>
<th class=\"highcharts-text\" scope=\"col\">
target</th>
<th class=\"highcharts-text\" scope=\"col\">
y</th>
<th class=\"highcharts-text\" scope=\"col\">
target</th>
<th class=\"highcharts-text\" scope=\"col\">
y</th>
<th class=\"highcharts-text\" scope=\"col\">
target</th>
</tr>
</thead>
<tbody>
<tr>
<th class=\"highcharts-number\" scope=\"row\">
2011</th>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-number\">
62</td>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-empty\">
</td>
</tr>
<tr>
<th class=\"highcharts-number\" scope=\"row\">
2012</th>
<td class=\"highcharts-number\">
28</td>
<td class=\"highcharts-number\">
33.6</td>
<td class=\"highcharts-number\">
50.9</td>
<td class=\"highcharts-number\">
60.5</td>
<td class=\"highcharts-number\">
62</td>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-number\">
2.4</td>
<td class=\"highcharts-number\">
1.4</td>
</tr>
<tr>
<th class=\"highcharts-number\" scope=\"row\">
2013</th>
<td class=\"highcharts-number\">
27</td>
<td class=\"highcharts-number\">
32.8</td>
<td class=\"highcharts-number\">
49.3</td>
<td class=\"highcharts-number\">
56.3</td>
<td class=\"highcharts-number\">
62</td>
<td class=\"highcharts-number\">
6.5</td>
<td class=\"highcharts-number\">
8</td>
<td class=\"highcharts-number\">
3.7</td>
<td class=\"highcharts-number\">
1.3</td>
</tr>
<tr>
<th class=\"highcharts-number\" scope=\"row\">
2014</th>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-number\">
1.9</td>
<td class=\"highcharts-number\">
1.3</td>
</tr>
</tbody>
</table>
`
    );

    chart.update({
        exporting: {
            useMultiLevelHeaders: false
        }
    });
    chart.viewData();

    assert.equal(
        chart
            .getTable()
            // Remove the extra attributes from accessibility module, needed if
            // running as "gulp test".
            .replace(/<table[^>]+>/g, '<table>')
            .replace(/>/g, '>\n'),
        `<table>
<caption class=\"highcharts-table-caption\">
Chart title</caption>
<thead>
<tr>
<th class=\"highcharts-text\" scope=\"col\">
Year</th>
<th class=\"highcharts-text\" scope=\"col\">
Bullet Series 1 (y)</th>
<th class=\"highcharts-text\" scope=\"col\">
Bullet Series 1 (target)</th>
<th class=\"highcharts-text\" scope=\"col\">
Bullet Series 2 (y)</th>
<th class=\"highcharts-text\" scope=\"col\">
Bullet Series 2 (target)</th>
<th class=\"highcharts-text\" scope=\"col\">
Line series</th>
<th class=\"highcharts-text\" scope=\"col\">
Bullet Series 3 (y)</th>
<th class=\"highcharts-text\" scope=\"col\">
Bullet Series 3 (target)</th>
<th class=\"highcharts-text\" scope=\"col\">
Bullet Series 4 (y)</th>
<th class=\"highcharts-text\" scope=\"col\">
Bullet Series 4 (target)</th>
</tr>
</thead>
<tbody>
<tr>
<th class=\"highcharts-number\" scope=\"row\">
2011</th>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-number\">
62</td>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-empty\">
</td>
</tr>
<tr>
<th class=\"highcharts-number\" scope=\"row\">
2012</th>
<td class=\"highcharts-number\">
28</td>
<td class=\"highcharts-number\">
33.6</td>
<td class=\"highcharts-number\">
50.9</td>
<td class=\"highcharts-number\">
60.5</td>
<td class=\"highcharts-number\">
62</td>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-number\">
2.4</td>
<td class=\"highcharts-number\">
1.4</td>
</tr>
<tr>
<th class=\"highcharts-number\" scope=\"row\">
2013</th>
<td class=\"highcharts-number\">
27</td>
<td class=\"highcharts-number\">
32.8</td>
<td class=\"highcharts-number\">
49.3</td>
<td class=\"highcharts-number\">
56.3</td>
<td class=\"highcharts-number\">
62</td>
<td class=\"highcharts-number\">
6.5</td>
<td class=\"highcharts-number\">
8</td>
<td class=\"highcharts-number\">
3.7</td>
<td class=\"highcharts-number\">
1.3</td>
</tr>
<tr>
<th class=\"highcharts-number\" scope=\"row\">
2014</th>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-empty\">
</td>
<td class=\"highcharts-number\">
1.9</td>
<td class=\"highcharts-number\">
1.3</td>
</tr>
</tbody>
</table>
`
    );
});

QUnit.test('Pie chart', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'pie'
        },
        title: {
            text: 'WEBAIM survey'
        },
        series: [
            {
                name: 'Percentage usage',
                data: [
                    {
                        name: 'Full time employment',
                        y: 40.7
                    },
                    {
                        name: 'Part time employment',
                        y: 13.9
                    },
                    {
                        name: 'Unemployed',
                        y: 45.4
                    }
                ]
            }
        ]
    });
    chart.viewData();

    assert.equal(
        chart
            .getTable()
            // Remove the extra attributes from accessibility module, needed if
            // running as "gulp test".
            .replace(/<table[^>]+>/g, '<table>')
            .replace(/>/g, '>\n'),
        `<table>
<caption class=\"highcharts-table-caption\">
WEBAIM survey</caption>
<thead>
<tr>
<th class=\"highcharts-text\" scope=\"col\">
Category</th>
<th class=\"highcharts-text\" scope=\"col\">
Percentage usage</th>
</tr>
</thead>
<tbody>
<tr>
<th class=\"highcharts-text\" scope=\"row\">
Full time employment</th>
<td class=\"highcharts-number\">
40.7</td>
</tr>
<tr>
<th class=\"highcharts-text\" scope=\"row\">
Part time employment</th>
<td class=\"highcharts-number\">
13.9</td>
</tr>
<tr>
<th class=\"highcharts-text\" scope=\"row\">
Unemployed</th>
<td class=\"highcharts-number\">
45.4</td>
</tr>
</tbody>
</table>
`
    );
});

QUnit.test('Custom columnHeaderFormatter', function (assert) {
    var ranges = [
            [1246406400000, 14.3, 27.7],
            [1246492800000, 14.5, 27.8],
            [1246579200000, 15.5, 29.6],
            [1246665600000, 16.7, 30.7],
            [1246752000000, 16.5, 25.0],
            [1246838400000, 17.8, 25.7]
        ],
        averages = [
            [1246406400000, 21.5],
            [1246492800000, 22.1],
            [1246579200000, 23],
            [1246665600000, 23.8],
            [1246752000000, 21.4],
            [1246838400000, 21.3]
        ],
        chart = Highcharts.chart('container', {
            exporting: {
                useRowspanHeaders: false,
                csv: {
                    dateFormat: '%Y-%m-%d',
                    columnHeaderFormatter: function (item, key) {
                        if (!item || item instanceof Highcharts.Axis) {
                            return 'Day';
                        }
                        return {
                            topLevelColumnTitle: 'Temperature',
                            columnTitle: key === 'y' ? 'avg' : key
                        };
                    }
                }
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: null
                }
            },
            series: [
                {
                    name: 'Temperature',
                    data: averages
                },
                {
                    name: 'Range',
                    data: ranges,
                    type: 'arearange',
                    linkedTo: ':previous',
                    fillOpacity: 0.3
                }
            ]
        });
    chart.viewData();

    assert.equal(
        chart
            .getTable()
            // Remove the extra attributes from accessibility module, needed if
            // running as "gulp test".
            .replace(/<table[^>]+>/g, '<table>')
            .replace(/>/g, '>\n'),
        `<table>
<caption class=\"highcharts-table-caption\">
Chart title</caption>
<thead>
<tr>
<th class=\"highcharts-text highcharts-table-topheading\" scope=\"col\">
Day</th>
<th class=\"highcharts-text highcharts-table-topheading\" scope=\"col\" colspan=\"3\">
Temperature</th>
</tr>
<tr>
<th class=\"highcharts-empty\" scope=\"col\">
</th>
<th class=\"highcharts-text\" scope=\"col\">
avg</th>
<th class=\"highcharts-text\" scope=\"col\">
low</th>
<th class=\"highcharts-text\" scope=\"col\">
high</th>
</tr>
</thead>
<tbody>
<tr>
<th class=\"highcharts-text\" scope=\"row\">
2009-07-01</th>
<td class=\"highcharts-number\">
21.5</td>
<td class=\"highcharts-number\">
14.3</td>
<td class=\"highcharts-number\">
27.7</td>
</tr>
<tr>
<th class=\"highcharts-text\" scope=\"row\">
2009-07-02</th>
<td class=\"highcharts-number\">
22.1</td>
<td class=\"highcharts-number\">
14.5</td>
<td class=\"highcharts-number\">
27.8</td>
</tr>
<tr>
<th class=\"highcharts-text\" scope=\"row\">
2009-07-03</th>
<td class=\"highcharts-number\">
23</td>
<td class=\"highcharts-number\">
15.5</td>
<td class=\"highcharts-number\">
29.6</td>
</tr>
<tr>
<th class=\"highcharts-text\" scope=\"row\">
2009-07-04</th>
<td class=\"highcharts-number\">
23.8</td>
<td class=\"highcharts-number\">
16.7</td>
<td class=\"highcharts-number\">
30.7</td>
</tr>
<tr>
<th class=\"highcharts-text\" scope=\"row\">
2009-07-05</th>
<td class=\"highcharts-number\">
21.4</td>
<td class=\"highcharts-number\">
16.5</td>
<td class=\"highcharts-number\">
25</td>
</tr>
<tr>
<th class=\"highcharts-text\" scope=\"row\">
2009-07-06</th>
<td class=\"highcharts-number\">
21.3</td>
<td class=\"highcharts-number\">
17.8</td>
<td class=\"highcharts-number\">
25.7</td>
</tr>
</tbody>
</table>
`
    );
});

QUnit.test('Internationalize export-data table words.', function (assert) {
    var chart = Highcharts.chart('container', {
        xAxis: [
            {
                categories: ['First', 'Second', 'Third'],
                width: '45%'
            },
            {
                type: 'datetime',
                width: '45%',
                left: '50%',
                offset: 0
            }
        ],
        series: [
            {
                data: [4, 3, 5]
            },
            {
                name: 'Test series',
                data: [5, 10, 8],
                xAxis: 1
            }
        ]
    });
    chart.viewData();

    assert.equal(
        chart
            .getTable()
            // Remove the extra attributes from accessibility module, needed if
            // running as "gulp test".
            .replace(/<table[^>]+>/g, '<table>')
            .replace(/>/g, '>\n'),
        `<table>
<caption class=\"highcharts-table-caption\">
Chart title</caption>
<thead>
<tr>
<th class=\"highcharts-text\" scope=\"col\">
Category</th>
<th class=\"highcharts-text\" scope=\"col\">
Series 1</th>
<th class=\"highcharts-text\" scope=\"col\">
DateTime</th>
<th class=\"highcharts-text\" scope=\"col\">
Test series</th>
</tr>
</thead>
<tbody>
<tr>
<th class=\"highcharts-text\" scope=\"row\">
First</th>
<td class=\"highcharts-number\">
4</td>
<td class=\"highcharts-text\">
1970-01-01 00:00:00</td>
<td class=\"highcharts-number\">
5</td>
</tr>
<tr>
<th class=\"highcharts-text\" scope=\"row\">
Second</th>
<td class=\"highcharts-number\">
3</td>
<td class=\"highcharts-text\">
1970-01-01 00:00:00</td>
<td class=\"highcharts-number\">
10</td>
</tr>
<tr>
<th class=\"highcharts-text\" scope=\"row\">
Third</th>
<td class=\"highcharts-number\">
5</td>
<td class=\"highcharts-text\">
1970-01-01 00:00:00</td>
<td class=\"highcharts-number\">
8</td>
</tr>
</tbody>
</table>
`
    );
});

QUnit.test('Annotation labels in export-data table.', function (assert) {
    var chart = Highcharts.chart('container', {
        title: {
            text: 'Annotation labels in export-data table.'
        },

        series: [
            {
                data: [
                    29,
                    {
                        y: 71,
                        id: 'pointI'
                    },
                    106,
                    129,
                    144
                ]
            },
            {
                data: [
                    2,
                    11,
                    60,
                    {
                        y: 44,
                        id: 'pointII'
                    },
                    44
                ]
            }
        ],

        annotations: [
            {
                labels: [
                    {
                        point: 'pointI',
                        text: 'Annotation I for pointI'
                    },
                    {
                        point: 'pointII',
                        text: 'Annotation II for pointII'
                    },
                    {
                        point: {
                            xAxis: 0,
                            x: 1.5,
                            yAxis: 0,
                            y: 50
                        },
                        text: 'Annotation I connected with axis'
                    },
                    {
                        point: {
                            xAxis: 0,
                            x: 1,
                            yAxis: 0,
                            y: 50
                        },
                        text: 'Annotation II connected with axis'
                    },
                    {
                        point: {
                            x: 1,
                            y: 50
                        },
                        text: 'Freestanding annotation'
                    },
                    {
                        point: {
                            xAxis: 0,
                            x: 2.5,
                            yAxis: 0,
                            y: 50
                        },
                        text:
                            'Annotation I connected with axis, and having the same point as other annotation.'
                    }
                ]
            }
        ]
    });

    // Enhancement #12789
    assert.equal(
        chart
            .getTable()
            // Remove the extra attributes from accessibility module, needed if
            // running as "gulp test".
            .replace(/<table[^>]+>/g, '<table>'),
        '<table><caption class=\"highcharts-table-caption\">Annotation labels in export-data table.</caption><thead><tr><th class=\"highcharts-text\" scope=\"col\">Category</th><th class=\"highcharts-text\" scope=\"col\">Series 1</th><th class=\"highcharts-text\" scope=\"col\">Series 2</th><th class=\"highcharts-text\" scope=\"col\">Annotations 1</th><th class=\"highcharts-text\" scope=\"col\">Annotations 2</th></tr></thead><tbody><tr><th class=\"highcharts-number\" scope=\"row\">0</th><td class=\"highcharts-number\">29</td><td class=\"highcharts-number\">2</td><td class=\"highcharts-empty\"></td><td class=\"highcharts-empty\"></td></tr><tr><th class=\"highcharts-number\" scope=\"row\">1</th><td class=\"highcharts-number\">71</td><td class=\"highcharts-number\">11</td><td class=\"highcharts-text\">Annotation I for pointI</td><td class=\"highcharts-text\">Annotation II connected with axis</td></tr><tr><th class=\"highcharts-number\" scope=\"row\">2</th><td class=\"highcharts-number\">106</td><td class=\"highcharts-number\">60</td><td class=\"highcharts-empty\"></td><td class=\"highcharts-empty\"></td></tr><tr><th class=\"highcharts-number\" scope=\"row\">3</th><td class=\"highcharts-number\">129</td><td class=\"highcharts-number\">44</td><td class=\"highcharts-text\">Annotation II for pointII</td><td class=\"highcharts-empty\"></td></tr><tr><th class=\"highcharts-number\" scope=\"row\">4</th><td class=\"highcharts-number\">144</td><td class=\"highcharts-number\">44</td><td class=\"highcharts-empty\"></td><td class=\"highcharts-empty\"></td></tr><tr><th class=\"highcharts-number\" scope=\"row\">1.5</th><td class=\"highcharts-empty\"></td><td class=\"highcharts-empty\"></td><td class=\"highcharts-text\">Annotation I connected with axis</td><td class=\"highcharts-empty\"></td></tr><tr><th class=\"highcharts-empty\" scope=\"row\"></th><td class=\"highcharts-empty\"></td><td class=\"highcharts-empty\"></td><td class=\"highcharts-text\">Freestanding annotation</td><td class=\"highcharts-empty\"></td></tr><tr><th class=\"highcharts-number\" scope=\"row\">2.5</th><td class=\"highcharts-empty\"></td><td class=\"highcharts-empty\"></td><td class=\"highcharts-text\">Annotation I connected with axis, and having the same point as other annotation.</td><td class=\"highcharts-empty\"></td></tr></tbody></table>',
        'Table should look like this with annotations (12789).'
    );

    chart.update({
        annotations: [
            {
                labelOptions: {
                    includeInDataExport: true
                },
                labels: [
                    {
                        point: 'pointI',
                        text: 'This is my annotation I'
                    }
                ]
            },
            {
                labelOptions: {
                    includeInDataExport: false
                },
                labels: [
                    {
                        point: 'pointII',
                        text: 'This is my annotation II'
                    }
                ]
            }
        ]
    });

    // Enhancement #12789
    assert.equal(
        chart
            .getTable()
            // Remove the extra attributes from accessibility module, needed if
            // running as "gulp test".
            .replace(/<table[^>]+>/g, '<table>'),
        '<table><caption class=\"highcharts-table-caption\">Annotation labels in export-data table.</caption><thead><tr><th class=\"highcharts-text\" scope=\"col\">Category</th><th class=\"highcharts-text\" scope=\"col\">Series 1</th><th class=\"highcharts-text\" scope=\"col\">Series 2</th><th class=\"highcharts-text\" scope=\"col\">Annotations 1</th></tr></thead><tbody><tr><th class=\"highcharts-number\" scope=\"row\">0</th><td class=\"highcharts-number\">29</td><td class=\"highcharts-number\">2</td><td class=\"highcharts-empty\"></td></tr><tr><th class=\"highcharts-number\" scope=\"row\">1</th><td class=\"highcharts-number\">71</td><td class=\"highcharts-number\">11</td><td class=\"highcharts-text\">This is my annotation I</td></tr><tr><th class=\"highcharts-number\" scope=\"row\">2</th><td class=\"highcharts-number\">106</td><td class=\"highcharts-number\">60</td><td class=\"highcharts-empty\"></td></tr><tr><th class=\"highcharts-number\" scope=\"row\">3</th><td class=\"highcharts-number\">129</td><td class=\"highcharts-number\">44</td><td class=\"highcharts-empty\"></td></tr><tr><th class=\"highcharts-number\" scope=\"row\">4</th><td class=\"highcharts-number\">144</td><td class=\"highcharts-number\">44</td><td class=\"highcharts-empty\"></td></tr></tbody></table>',
        'Table should look like this with includeInDataExport set (12789).'
    );

    chart.update({
        annotations: [
            {
                labels: [
                    {
                        point: 'pointI',
                        text: 'This is my annotation I for point I',
                        y: -50
                    },
                    {
                        point: 'pointI',
                        text: 'This is my annotation II for point I'
                    },
                    {
                        point: 'pointII',
                        text: 'This is my annotation I for point II'
                    }
                ]
            }
        ],

        exporting: {
            csv: {
                annotations: {
                    join: true,
                    itemDelimiter: ' / '
                }
            }
        }
    });

    // Enhancement #12789
    assert.equal(
        chart
            .getTable()
            // Remove the extra attributes from accessibility module, needed if
            // running as "gulp test".
            .replace(/<table[^>]+>/g, '<table>'),
        '<table><caption class=\"highcharts-table-caption\">Annotation labels in export-data table.</caption><thead><tr><th class=\"highcharts-text\" scope=\"col\">Category</th><th class=\"highcharts-text\" scope=\"col\">Series 1</th><th class=\"highcharts-text\" scope=\"col\">Series 2</th><th class=\"highcharts-text\" scope=\"col\">Annotations 1</th></tr></thead><tbody><tr><th class=\"highcharts-number\" scope=\"row\">0</th><td class=\"highcharts-number\">29</td><td class=\"highcharts-number\">2</td><td class=\"highcharts-empty\"></td></tr><tr><th class=\"highcharts-number\" scope=\"row\">1</th><td class=\"highcharts-number\">71</td><td class=\"highcharts-number\">11</td><td class=\"highcharts-text\">This is my annotation I for point I / This is my annotation II for point I</td></tr><tr><th class=\"highcharts-number\" scope=\"row\">2</th><td class=\"highcharts-number\">106</td><td class=\"highcharts-number\">60</td><td class=\"highcharts-empty\"></td></tr><tr><th class=\"highcharts-number\" scope=\"row\">3</th><td class=\"highcharts-number\">129</td><td class=\"highcharts-number\">44</td><td class=\"highcharts-text\">This is my annotation I for point II</td></tr><tr><th class=\"highcharts-number\" scope=\"row\">4</th><td class=\"highcharts-number\">144</td><td class=\"highcharts-number\">44</td><td class=\"highcharts-empty\"></td></tr></tbody></table>',
        'Table should look like this with set join and itemDelimiter (12789).'
    );
});
