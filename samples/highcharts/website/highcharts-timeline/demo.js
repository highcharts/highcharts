// Get the turnover. Read the table from the HTML, sort by the joined/left
// events and keep track of the number of employees.
function getTurnover() {
    let employees = 0;
    return [].reduce.call(
        document.getElementById('turnover').querySelectorAll('tr'),
        (turnover, tr) => {
            const dateJoined = Date.parse(tr.children[1].textContent);
            if (!isNaN(dateJoined)) {
                turnover.push({
                    x: dateJoined,
                    name: `${tr.children[0].textContent} joined`,
                    accumulate: 1,
                    image: tr.children[3].textContent || null
                });
            }

            const dateLeft = Date.parse(tr.children[2].textContent);
            if (!isNaN(dateLeft)) {
                turnover.push({
                    x: dateLeft,
                    name: `${tr.children[0].textContent} left`,
                    accumulate: -1,
                    image: null
                });
            }

            return turnover;
        },
        [])
        .sort((a, b) => a.x - b.x)
        .map(event => Object.assign(
            event, {
                y: (employees += event.accumulate)
            }
        ));
}


const imgPath = 'https://cdn.rawgit.com/highcharts/highcharts/0b81a74ecd2fbd2e9b24489bf476f8baecc218e1/samples/graphics/homepage/';
const options = {
    chart: {
        height: 600,
        styledMode: (true),
        scrollablePlotArea: {
            minWidth: 700,
            scrollPositionX: 1
        }
    },
    credits: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    xAxis: {
        type: 'datetime',
        minTickInterval: 365 * 24 * 36e5,
        max: Date.UTC(2020, 11, 31),
        labels: {
            align: 'left',
            style: {
                fontSize: '16px'
            }
        },
        plotBands: [{
            from: Date.UTC(2009, 10, 27),
            to: Date.UTC(2010, 11, 1),
            className: 'time-1',
            label: {
                text: 'Torstein\'s<br>basement',
                useHTML: true,
                style: {
                    color: '#000'
                },
                y: 20
            }
        }, {
            from: Date.UTC(2010, 11, 1),
            to: Date.UTC(2013, 9, 1),
            className: 'time-2',
            label: {
                text: 'Tomtebu<br>Norway',
                style: {
                    color: '#000'
                },
                y: 20
            }
        }, {
            from: Date.UTC(2013, 9, 1),
            to: Date.UTC(2016, 2, 10),
            className: 'time-3',
            label: {
                text: 'VikØrsta<br>Norway',
                style: {
                    color: '#000'
                },
                y: 20
            }
        }, {
            from: Date.UTC(2016, 2, 10),
            to: Date.now(),
            className: 'time-4',
            label: {
                text: 'Blix Hotel<br>Norway',
                style: {
                    color: '#000'
                },
                y: 20
            }
        }]
    },
    title: {
        text: ''
    },
    tooltip: {
        style: {
            width: '250px'
        }
    },
    yAxis: [{
        max: 100,
        labels: {
            enabled: false
        },
        visible: false,
        title: {
            text: ''
        },
        gridLineColor: 'rgba(0, 0, 0, 0.07)'
    }, {
        allowDecimals: false,
        min: 0,
        max: 50,
        tickInterval: 5,
        startOnTick: false,
        title: {
            text: 'Employees',
            style: {
                fontWeight: 'bold'
            },
            rotation: 0,
            y: -250,
            x: -35
        },
        opposite: true,
        gridLineWidth: 0
    }],
    plotOptions: {
        series: {
            marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2
            },
            fillOpacity: 0.5,
            events: {
                legendItemClick: function () {
                    return false;
                }
            }
        },
        flags: {
            clip: false,
            tooltip: {
                xDateFormat: '%B %e, %Y'
            },
            allowOverlapX: false
        }
    },
    series: [{
        name: 'Revenue',
        type: 'areaspline',
        className: 'revenue',
        id: 'revenue',
        data: [
            [1259622000000, 16],
            [1262300400000, 20],
            [1264978800000, 16],
            [1267398000000, 16],
            [1270072800000, 18],
            [1272664800000, 16],
            [1275343200000, 18],
            [1277935200000, 20],
            [1280613600000, 25],
            [1283292000000, 20],
            [1285884000000, 23],
            [1288566000000, 21],
            [1291158000000, 18],
            [1293836400000, 22],
            [1296514800000, 18],
            [1298934000000, 18],
            [1301608800000, 21],
            [1304200800000, 18],
            [1306879200000, 20],
            [1309471200000, 23],
            [1312149600000, 28],
            [1314828000000, 22],
            [1317420000000, 25],
            [1320102000000, 24],
            [1322694000000, 20],
            [1325372400000, 24],
            [1328050800000, 20],
            [1330556400000, 20],
            [1333231200000, 23],
            [1335823200000, 20],
            [1338501600000, 22],
            [1341093600000, 25],
            [1343772000000, 31],
            [1346450400000, 25],
            [1349042400000, 28],
            [1351724400000, 26],
            [1354316400000, 22],
            [1356994800000, 27],
            [1359673200000, 22],
            [1362092400000, 22],
            [1364767200000, 25],
            [1367359200000, 23],
            [1370037600000, 24],
            [1372629600000, 28],
            [1375308000000, 34],
            [1377986400000, 28],
            [1380578400000, 32],
            [1383260400000, 29],
            [1385852400000, 27],
            [1388530800000, 26],
            [1391209200000, 33],
            [1393628400000, 34],
            [1396303200000, 36],
            [1398895200000, 39],
            [1401573600000, 42],
            [1404165600000, 40],
            [1406844000000, 43],
            [1409522400000, 42],
            [1412114400000, 39],
            [1414796400000, 37],
            [1417388400000, 41],
            [1420066800000, 34],
            [1422745200000, 45],
            [1425164400000, 36],
            [1427839200000, 44],
            [1430431200000, 39],
            [1433109600000, 41],
            [1435701600000, 41],
            [1438380000000, 56],
            [1441058400000, 63],
            [1443650400000, 53],
            [1446332400000, 77],
            [1448924400000, 56],
            [1451602800000, 55],
            [1454281200000, 83],
            [1456786800000, 62],
            [1459461600000, 50],
            [1462053600000, 71],
            [1464732000000, 68],
            [1467324000000, 63],
            [1470002400000, 79],
            [1472680800000, 95],
            [1475272800000, 74],
            [1477954800000, 77],
            [1480546800000, 65],
            [1483225200000, 68],
            [1485903600000, 83],
            [1488322800000, 67],
            [1490997600000, 70],
            [1493589600000, 70],
            [1496268000000, 70],
            [1498860000000, 84],
            [1501538400000, 74],
            [1504216800000, 81],
            [1506808800000, 82],
            [1509490800000, 80],
            [1512082800000, 51],
            [1514761200000, 60],
            [1517439600000, 83],
            [1519858800000, 66],
            [1522533600000, 62],
            [1525125600000, 76],
            [1527804000000, 56],
            [1530396000000, 95],
            [1533074400000, 52],
            [1535752800000, 82],
            [1538344800000, 73],
            [1541026800000, 84],
            [1543618800000, 66],
            [1546297200000, 53],
            [1548975600000, 91],
            [1551394800000, 72],
            [1554069600000, 85],
            [1556661600000, 77],
            [1559340000000, 56],
            [1561932000000, 60],
            [1564610400000, 69],
            [1567288800000, 83],
            [1569880800000, 91], ///september 2019
            [1572480000000, 79],
            [1575072000000, 65],
            [1577750400000, 92],
            [1580428800000, 85],
            [1582848000000, 80],
            [1585612800000, 82],
            [1588204800000, 76],
            [1590883200000, 70],
            [1593475200000, 100],
            [1596153600000, 80],
            [1598832000000, 68],
            [1601424000000, 85],
            [1604102400000, 65],
            [1606694400000, 84],
            [1609372800000, 90]
        ],
        tooltip: {
            xDateFormat: '%B %Y',
            valueSuffix: ' % of best month'
        }
    }, {
        yAxis: 1,
        name: 'Highsoft employees',
        id: 'employees',
        className: 'employees',
        type: 'area',
        step: 'left',
        tooltip: {
            headerFormat: '<span style="font-size: 11px;color:#666">{point.x:%B %e, %Y}</span><br>',
            pointFormat: '{point.name}<br><b>{point.y}</b>',
            valueSuffix: ' employees'
        },
        data: getTurnover()

    }
    ],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 499
            },
            chartOptions: {
                chart: {
                    margin: [0, 0, 30, 0]
                },
                legend: {
                    enabled: true
                }
            }
        },
        {
            condition: {
                minWidth: 500
            },
            chartOptions: {
                chart: {
                    margin: [50, 50, 80, 0]
                },
                legend: {
                    enabled: true
                }
            }
        }]
    }
};

if (Highcharts.seriesTypes.flags) {
    options.series.push(
        {
            type: 'flags',
            name: 'Highmaps',
            className: 'product',
            color: '#333333',
            shape: 'url(' + imgPath + 'product.png)',
            tooltip: {
                distance: 60
            },
            data: [{
                x: Date.UTC(2014, 5, 13),
                text: 'Highmaps version 1.0 released',
                title: 'Maps'
            }],
            showInLegend: false
        },
        {
            type: 'flags',
            name: 'Cloud',
            className: 'cloud',
            color: '#333333',
            tooltip: {
                distance: 40
            },
            shape: 'url(' + imgPath + 'cloud.png)',
            data: [{
                x: Date.UTC(2014, 4, 1),
                text: 'Highcharts Cloud Beta',
                title: 'Cloud'
            },
            {
                x: Date.UTC(2017, 10, 24),
                text: 'Highcharts Cloud v2',
                title: 'Cloud v2'
            },
            {
                x: Date.UTC(2018, 11, 6),
                text: 'Highcharts Cloud v2',
                title: 'Cloud v3'
            }
            ],
            showInLegend: false
        },
        {
            type: 'flags',
            name: 'Highcharts',
            color: '#333333',
            shape: 'url(' + imgPath + 'version.png)',
            className: 'product',
            point: {
                events: {
                    mouseOver: function () {
                        const chart = this.series.chart;
                        if (this.title === 'Stock') {
                            chart.update({
                                tooltip: {
                                    distance: 60
                                }
                            });
                        } else {
                            chart.update({
                                tooltip: {
                                    distance: 16
                                }
                            });
                        }
                    }
                }
            },
            data: [{
                x: Date.UTC(2009, 10, 27),
                text: 'Highcharts version 1.0 released',
                title: '1.0'
            },
            {
                x: Date.UTC(2010, 6, 13),
                text: 'Ported from canvas to SVG rendering',
                title: '2.0'
            },
            {
                x: Date.UTC(2010, 10, 23),
                text: 'Dynamically resize and scale to text labels',
                title: '2.1'
            },
            {
                x: Date.UTC(2011, 9, 18),
                text: 'Highcharts Stock version 1.0 released',
                title: 'Stock',
                shape: 'url(' + imgPath + 'product.png)'
            },
            {
                x: Date.UTC(2012, 7, 24),
                text: 'Gauges, polar charts and range series',
                title: '2.3'
            },
            {
                x: Date.UTC(2013, 2, 22),
                text: 'Multitouch support, more series types',
                title: '3.0'
            },
            {
                x: Date.UTC(2014, 3, 22),
                text: '3D charts, heatmaps',
                title: '4.0'
            },
            {
                x: Date.UTC(2016, 8, 29),
                text: 'Styled mode, responsive options, accessibility, chart.update',
                title: '5.0'
            },
            {
                x: Date.UTC(2017, 9, 4),
                text: 'Annotations, Boost, Series labels, new series types',
                title: '6.0'
            },
            {
                x: Date.UTC(2018, 11, 11),
                text: 'Sonification, TypeScript (beta), new series types',
                title: '7.0'
            }
            ],
            showInLegend: false
        },
        {
            type: 'flags',
            name: 'logo',
            shape: 'url(https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2021/05/19085042/favicon-1.ico)',
            data: [{
                x: Date.UTC(2014, 4, 21),
                text: 'New logo',
                title: ' '
            }],
            y: -250,
            showInLegend: false

        },
        {
            type: 'flags',
            useHTML: true,
            name: 'Events',
            className: 'award',
            shape: 'url(' + imgPath + 'award.png)',
            data: [{
                x: Date.UTC(2012, 10, 1),
                text: 'Highsoft won "Entrepeneur of the Year" in Sogn og Fjordane, Norway',
                title: 'Award'
            },
            {
                x: Date.UTC(2012, 11, 25),
                text: 'Packt Publishing published <em>Learning Highcharts by Example</em>. Since then, many other books are written about Highcharts.',
                title: 'First book'
            },
            {
                x: Date.UTC(2013, 4, 25),
                text: 'Highsoft nominated Norway\'s Startup of the Year',
                title: 'Award'
            },
            {
                x: Date.UTC(2014, 4, 25),
                text: 'Highsoft nominated Best Startup in Nordic Startup Awards',
                title: 'Award'
            },
            {
                x: Date.UTC(2017, 9, 20),
                text: 'Torstein awarded EY Entrepeneur of the Year, Vestlandet',
                title: 'Award'
            },
            {
                x: Date.UTC(2018, 11, 13),
                text: 'Grethe awarded NCE Ambassador',
                title: 'Award'
            }
            ],
            style: {
                color: '#fff'
            },
            textAlign: 'center',
            onSeries: 'revenue',
            allowOverlapX: true,
            showInLegend: false
        }

    );
}
Highcharts.chart('timeline', options);
