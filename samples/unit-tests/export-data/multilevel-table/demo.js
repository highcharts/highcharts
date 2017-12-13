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
            categories: [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
            title: {
                text: 'Year'
            }
        },
        series: [{
            name: 'Bullet Series 1',
            data: [{
                x: 7,
                y: 28,
                target: 33.6
            }, {
                x: 8,
                y: 27,
                target: 32.8
            }]
        }, {
            name: 'Bullet Series 2',
            data: [{
                x: 7,
                y: 50.9,
                target: 60.5
            }, {
                x: 8,
                y: 49.3,
                target: 56.3
            }]
        }, {
            name: 'Line series',
            data: [
                [6, 62],
                [7, 62],
                [8, 62]
            ],
            type: 'line'
        }, {
            name: 'Bullet Series 3',
            data: [{
                x: 8,
                y: 6.5,
                target: 8
            }]
        }, {
            name: 'Bullet Series 4',
            data: [{
                x: 7,
                y: 2.4,
                target: 1.4
            }, {
                x: 8,
                y: 3.7,
                target: 1.3
            }, {
                x: 9,
                y: 1.9,
                target: 1.3
            }]
        }]
    });
    chart.viewData();

    assert.equal(
        chart.getTable()
            // Remove the extra attributes from accessibility module, needed if
            // running as "gulp test".
            .replace(/<table[^>]+>/g, '<table>'),
        '<table><caption class="highcharts-table-caption">Chart title</caption><thead><tr><th scope="col" valign="top" rowspan="2" class="text highcharts-table-topheading">Year</th><th scope="col" colspan="2" class="text highcharts-table-topheading">Bullet Series 1</th><th scope="col" colspan="2" class="text highcharts-table-topheading">Bullet Series 2</th><th scope="col" valign="top" rowspan="2" class="text highcharts-table-topheading">Line series</th>' +
        '<th scope="col" colspan="2" class="text highcharts-table-topheading">Bullet Series 3</th><th scope="col" colspan="2" class="text highcharts-table-topheading">Bullet Series 4</th></tr><tr><th scope="col" class="text">y</th><th scope="col" class="text">target</th><th scope="col" class="text">y</th><th scope="col" class="text">target</th><th scope="col" class="text">y</th><th scope="col" class="text">target</th><th scope="col" class="text">y</th>' +
        '<th scope="col" class="text">target</th></tr></thead><tbody><tr><th scope="row" class="number">2011</th><td class="empty"></td><td class="empty"></td><td class="empty"></td><td class="empty"></td><td class="number">62</td><td class="empty"></td><td class="empty"></td><td class="empty"></td><td class="empty"></td></tr><tr><th scope="row" class="number">2012</th><td class="number">28</td><td class="number">33.6</td><td class="number">50.9</td>' +
        '<td class="number">60.5</td><td class="number">62</td><td class="empty"></td><td class="empty"></td><td class="number">2.4</td><td class="number">1.4</td></tr><tr><th scope="row" class="number">2013</th><td class="number">27</td><td class="number">32.8</td><td class="number">49.3</td><td class="number">56.3</td><td class="number">62</td><td class="number">6.5</td><td class="number">8</td><td class="number">3.7</td><td class="number">1.3</td></tr>' +
        '<tr><th scope="row" class="number">2014</th><td class="empty"></td><td class="empty"></td><td class="empty"></td><td class="empty"></td><td class="empty"></td><td class="empty"></td><td class="empty"></td><td class="number">1.9</td><td class="number">1.3</td></tr></tbody></table>',
        'Table should look like this with multilevel headers'
    );

    chart.update({
        exporting: {
            useMultiLevelHeaders: false
        }
    });
    chart.viewData();

    assert.equal(
        chart.getTable()
            // Remove the extra attributes from accessibility module, needed if
            // running as "gulp test".
            .replace(/<table[^>]+>/g, '<table>'),
        '<table><caption class="highcharts-table-caption">Chart title</caption><thead><tr><th scope="col" class="text">Year</th><th scope="col" class="text">Bullet Series 1 (y)</th><th scope="col" class="text">Bullet Series 1 (target)</th><th scope="col" class="text">Bullet Series 2 (y)</th><th scope="col" class="text">Bullet Series 2 (target)</th><th scope="col" class="text">Line series</th><th scope="col" class="text">Bullet Series 3 (y)</th>' +
        '<th scope="col" class="text">Bullet Series 3 (target)</th><th scope="col" class="text">Bullet Series 4 (y)</th><th scope="col" class="text">Bullet Series 4 (target)</th></tr></thead><tbody><tr><th scope="row" class="number">2011</th><td class="empty"></td><td class="empty"></td><td class="empty"></td><td class="empty"></td><td class="number">62</td><td class="empty"></td><td class="empty"></td><td class="empty"></td><td class="empty"></td></tr>' +
        '<tr><th scope="row" class="number">2012</th><td class="number">28</td><td class="number">33.6</td><td class="number">50.9</td><td class="number">60.5</td><td class="number">62</td><td class="empty"></td><td class="empty"></td><td class="number">2.4</td><td class="number">1.4</td></tr><tr><th scope="row" class="number">2013</th><td class="number">27</td><td class="number">32.8</td><td class="number">49.3</td><td class="number">56.3</td>' +
        '<td class="number">62</td><td class="number">6.5</td><td class="number">8</td><td class="number">3.7</td><td class="number">1.3</td></tr><tr><th scope="row" class="number">2014</th><td class="empty"></td><td class="empty"></td><td class="empty"></td><td class="empty"></td><td class="empty"></td><td class="empty"></td><td class="empty"></td><td class="number">1.9</td><td class="number">1.3</td></tr></tbody></table>',
        'Table should look like this without multilevel headers'
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
        series: [{
            name: 'Percentage usage',
            data: [{
                name: 'Full time employment',
                y: 40.7
            }, {
                name: 'Part time employment',
                y: 13.9
            }, {
                name: 'Unemployed',
                y: 45.4
            }]
        }]
    });
    chart.viewData();

    assert.equal(
        chart.getTable()
            // Remove the extra attributes from accessibility module, needed if
            // running as "gulp test".
            .replace(/<table[^>]+>/g, '<table>'),
        '<table><caption class="highcharts-table-caption">WEBAIM survey</caption><thead><tr><th scope="col" class="text">Category</th><th scope="col" class="text">Percentage usage</th></tr></thead><tbody><tr><th scope="row" class="text">Full time employment</th><td class="number">40.7</td></tr><tr><th scope="row" class="text">Part time employment</th><td class="number">13.9</td></tr><tr><th scope="row" class="text">Unemployed</th><td class="number">45.4</td></tr></tbody></table>',
        'Pie chart table should look like this'
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
            series: [{
                name: 'Temperature',
                data: averages
            }, {
                name: 'Range',
                data: ranges,
                type: 'arearange',
                linkedTo: ':previous',
                fillOpacity: 0.3
            }]
        });
    chart.viewData();

    assert.equal(
        chart.getTable()
            // Remove the extra attributes from accessibility module, needed if
            // running as "gulp test".
            .replace(/<table[^>]+>/g, '<table>'),
        '<table><caption class="highcharts-table-caption">Chart title</caption><thead><tr><th scope="col" class="text highcharts-table-topheading">Day</th><th scope="col" colspan="3" class="text highcharts-table-topheading">Temperature</th></tr><tr><th scope="col" class="empty"></th><th scope="col" class="text">avg</th><th scope="col" class="text">low</th><th scope="col" class="text">high</th></tr></thead><tbody><tr><th scope="row" class="text">2009-07-01</th>' +
        '<td class="number">21.5</td><td class="number">14.3</td><td class="number">27.7</td></tr><tr><th scope="row" class="text">2009-07-02</th><td class="number">22.1</td><td class="number">14.5</td><td class="number">27.8</td></tr><tr><th scope="row" class="text">2009-07-03</th><td class="number">23</td><td class="number">15.5</td><td class="number">29.6</td></tr><tr><th scope="row" class="text">2009-07-04</th><td class="number">23.8</td>' +
        '<td class="number">16.7</td><td class="number">30.7</td></tr><tr><th scope="row" class="text">2009-07-05</th><td class="number">21.4</td><td class="number">16.5</td><td class="number">25</td></tr><tr><th scope="row" class="text">2009-07-06</th><td class="number">21.3</td><td class="number">17.8</td><td class="number">25.7</td></tr></tbody></table>',
        'Table should look like this with custom columnHeaderFormatter'
    );
});
