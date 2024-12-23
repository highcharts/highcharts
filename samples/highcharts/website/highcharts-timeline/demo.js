// Create a custom symbol for the event labels
Highcharts.SVGRenderer.prototype.symbols.eventLabel = (
    x,
    y,
    width,
    height,
    options
) => {
    const r = 3,
        d = Highcharts.SVGRenderer.prototype.symbols
            .callout(x, y, width, height, options),
        { anchorX, anchorY } = options;

    // Border radius
    options.r = r;

    // Replace the chevron with a riser and a circle at the anchor point
    if (
        typeof anchorY === 'number' &&
        anchorY - height > 8 &&
        d.length === 13
    ) {
        d[5][1] = anchorX + 1;
        d[6] = ['L', anchorX + 1, anchorY - r + 1];
        d.splice(7, 0, ['A', 3, 3, 1, 1, 1, anchorX - 1, anchorY - r + 1]);
        d[8][1] = anchorX - 1;
    }

    return d;
};

const employees = [
    { x: '2009-11-01', y: 1 },
    { x: '2010-11-20', y: 2 },
    { x: '2011-04-01', y: 3 },
    { x: '2011-08-01', y: 4 },
    { x: '2011-08-05', y: 5 },
    { x: '2012-06-01', y: 6 },
    { x: '2012-09-10', y: 5 },
    { x: '2012-09-15', y: 6 },
    { x: '2013-08-01', y: 7 },
    { x: '2013-08-20', y: 8 },
    { x: '2013-10-01', y: 9 },
    { x: '2014-08-08', y: 10 },
    { x: '2014-11-01', y: 11 },
    { x: '2015-02-01', y: 12 },
    { x: '2015-05-01', y: 13 },
    { x: '2015-08-01', y: 15 },
    { x: '2016-01-01', y: 16 },
    { x: '2016-02-01', y: 18 },
    { x: '2016-05-01', y: 17 },
    { x: '2016-07-01', y: 16 },
    { x: '2016-08-01', y: 19 },
    { x: '2016-09-01', y: 20 },
    { x: '2017-01-01', y: 21 },
    { x: '2017-03-01', y: 20 },
    { x: '2017-08-01', y: 19 },
    { x: '2017-09-01', y: 21 },
    { x: '2017-11-01', y: 20 },
    { x: '2018-01-01', y: 23 },
    { x: '2018-08-01', y: 26 },
    { x: '2019-02-01', y: 27 },
    { x: '2019-03-01', y: 28 },
    { x: '2019-06-01', y: 29 },
    { x: '2019-08-01', y: 31 },
    { x: '2020-01-01', y: 29 },
    { x: '2020-02-01', y: 28 },
    { x: '2020-06-01', y: 27 },
    { x: '2020-07-01', y: 26 },
    { x: '2020-09-01', y: 28 },
    { x: '2020-10-01', y: 29 },
    { x: '2020-11-01', y: 30 },
    { x: '2021-01-01', y: 31 },
    { x: '2021-02-01', y: 32 },
    { x: '2021-03-01', y: 33 },
    { x: '2021-04-01', y: 34 },
    { x: '2021-06-01', y: 33 },
    { x: '2021-07-01', y: 34 },
    { x: '2021-09-01', y: 33 },
    { x: '2021-10-01', y: 32 },
    { x: '2021-11-01', y: 33 },
    { x: '2021-12-01', y: 34 },
    { x: '2022-02-01', y: 35 },
    { x: '2022-03-01', y: 34 },
    { x: '2022-05-01', y: 36 },
    { x: '2022-06-01', y: 37 },
    { x: '2022-07-01', y: 36 },
    { x: '2022-08-01', y: 39 },
    { x: '2022-09-01', y: 38 },
    { x: '2022-11-01', y: 39 },
    { x: '2022-12-01', y: 39 },
    { x: '2023-01-01', y: 39 },
    { x: '2023-02-01', y: 39 },
    { x: '2023-03-01', y: 40 },
    { x: '2023-04-01', y: 41 },
    { x: '2023-05-01', y: 41 },
    { x: '2023-06-01', y: 40 },
    { x: '2023-07-01', y: 38 }
];
const revData = [
    [1259622000000, 16],
    [1262300400000, 15],
    [1264978800000, 12],
    [1267398000000, 15],
    [1270072800000, 13],
    [1272664800000, 13],
    [1275343200000, 14],
    [1277935200000, 13],
    [1280613600000, 14],
    [1283292000000, 16],
    [1285884000000, 19],
    [1288566000000, 16],
    [1291158000000, 18],
    [1293836400000, 16],
    [1296514800000, 14],
    [1298934000000, 17],
    [1301608800000, 14],
    [1304200800000, 14],
    [1306879200000, 16],
    [1309471200000, 14],
    [1312149600000, 15],
    [1314828000000, 18],
    [1317420000000, 21],
    [1320102000000, 17],
    [1322694000000, 20],
    [1325372400000, 18],
    [1328050800000, 15],
    [1330556400000, 23],
    [1333231200000, 19],
    [1335823200000, 19],
    [1338501600000, 22],
    [1341093600000, 19],
    [1343772000000, 21],
    [1346450400000, 24],
    [1349042400000, 29],
    [1351724400000, 24],
    [1354316400000, 27],
    [1356994800000, 25],
    [1359673200000, 19],
    [1362092400000, 22],
    [1364767200000, 28],
    [1367359200000, 29],
    [1370037600000, 30],
    [1372629600000, 33],
    [1375308000000, 36],
    [1377986400000, 34],
    [1380578400000, 37],
    [1383260400000, 36],
    [1385852400000, 33],
    [1388530800000, 31],
    [1391209200000, 28],
    [1393628400000, 29],
    [1396303200000, 38],
    [1398895200000, 31],
    [1401573600000, 38],
    [1404165600000, 33],
    [1406844000000, 35],
    [1409522400000, 35],
    [1412114400000, 48],
    [1414796400000, 54],
    [1417388400000, 46],
    [1420066800000, 65],
    [1422745200000, 39],
    [1425164400000, 47],
    [1427839200000, 70],
    [1430431200000, 53],
    [1433109600000, 43],
    [1435701600000, 60],
    [1438380000000, 58],
    [1441058400000, 53],
    [1443650400000, 67],
    [1446332400000, 81],
    [1448924400000, 63],
    [1451602800000, 65],
    [1454281200000, 45],
    [1456786800000, 58],
    [1459461600000, 71],
    [1462053600000, 57],
    [1464732000000, 59],
    [1467324000000, 59],
    [1470002400000, 60],
    [1472680800000, 72],
    [1475272800000, 63],
    [1477954800000, 69],
    [1480546800000, 70],
    [1483225200000, 68],
    [1485903600000, 35],
    [1488322800000, 51],
    [1490997600000, 70],
    [1493589600000, 56],
    [1496268000000, 53],
    [1498860000000, 65],
    [1501538400000, 48],
    [1504216800000, 80],
    [1506808800000, 44],
    [1509490800000, 70],
    [1512082800000, 62],
    [1514761200000, 72],
    [1517439600000, 46],
    [1519858800000, 46],
    [1522533600000, 77],
    [1525125600000, 61],
    [1527804000000, 72],
    [1530396000000, 65],
    [1533074400000, 48],
    [1535752800000, 51],
    [1538344800000, 59],
    [1541026800000, 71],
    [1543618800000, 77],
    [1546297200000, 64],
    [1548975600000, 55],
    [1551394800000, 50],
    [1554069600000, 63],
    [1556661600000, 51],
    [1559340000000, 67],
    [1561932000000, 50],
    [1564610400000, 63],
    [1567288800000, 54],
    [1569880800000, 45],
    [1572480000000, 63],
    [1575072000000, 59],
    [1577750400000, 68],
    [1580428800000, 56],
    [1582848000000, 53],
    [1585612800000, 48],
    [1588204800000, 69],
    [1590883200000, 55],
    [1593475200000, 47],
    [1596153600000, 59],
    [1598832000000, 45],
    [1601424000000, 58],
    [1604102400000, 62],
    [1606694400000, 45],
    [1609372800000, 49],
    [1612051200000, 52],
    [1614470400000, 45],
    [1617148800000, 62],
    [1619740800000, 43],
    [1622419200000, 58],
    [1625011200000, 50],
    [1627689600000, 59],
    [1630368000000, 46],
    [1632960000000, 53],
    [1635638400000, 59],
    [1638230400000, 50],
    [1640908800000, 49],
    [1643587200000, 81],
    [1646006400000, 52],
    [1648684800000, 74],
    [1651276800000, 38],
    [1653955200000, 53],
    [1656547200000, 65],
    [1659225600000, 57],
    [1661904000000, 49],
    [1664496000000, 45],
    [1667174400000, 60],
    [1669766400000, 60],
    [1672444800000, 50],
    [1675141200000, 73],
    [1677560400000, 100],
    [1680235200000, 94],
    [1682827200000, 68],
    [1685505600000, 66],
    [1688097600000, 61],
    [1690776000000, 60],
    [1693454400000, null]
];

const options = {
    chart: {
        height: 600,
        styledMode: true,
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
    xAxis: [
        {
            type: 'datetime',
            minTickInterval: 365 * 24 * 36e5,
            labels: {
                align: 'left',
                style: {
                    fontSize: '16px'
                }
            },
            plotBands: [{
                from: '2009-11-27',
                to: '2010-12-01',
                className: 'time-1',
                label: {
                    text: 'Torstein\'s<br>basement',
                    style: {
                        color: '#000'
                    },
                    y: 20
                }
            }, {
                from: '2010-12-01',
                to: '2013-10-01',
                className: 'time-2',
                label: {
                    text: 'Tomtebu<br>Norway',
                    style: {
                        color: '#000'
                    },
                    y: 20
                }
            }, {
                from: '2013-10-01',
                to: '2016-03-10',
                className: 'time-3',
                label: {
                    text: 'VikØrsta<br>Norway',
                    style: {
                        color: '#000'
                    },
                    y: 20
                }
            }, {
                from: '2016-03-10',
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
        }
    ],
    title: {
        text: ''
    },
    tooltip: {
        outside: true,
        useHTML: true,
        className: 'tip',
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
            fillOpacity: 0.1,
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
            }
        }
    },
    series: [{
        name: 'Revenue',
        type: 'areaspline',
        className: 'revenue',
        id: 'revenue',
        data: revData,
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
            valueSuffix: ' employees',
            useHTML: true,
            pointFormat: '<p class="tip"><b>{point.y}</b></p>',
            headerFormat: '<p class="tipheader">{point.x:%B %Y}</p>'
        },
        data: employees

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
                    enabled: false
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

if (Highcharts.Series.types.flags) {
    options.series.push(
        // 0
        {
            type: 'flags',
            name: 'Products',
            className: 'product',
            color: '#333333',
            shape: 'eventLabel',
            data: [{
                x: '2011-10-18',
                text: 'Highcharts Stock version 1.0 released',
                title: 'Stock'
            },
            {
                x: '2014-06-13',
                text: 'Highmaps version 1.0 released',
                title: 'Maps'
            }, {
                x: '2018-10-17',
                text: 'Gantt version 1.0 released',
                title: 'Gantt'
            },
            {
                x: '2023-05-05',
                text: 'Highcharts GPT<br>(powered by ChatGPT)<br>released',
                title: 'Highcharts GPT'
            }],
            y: -70,
            showInLegend: false
        },
        // 1
        {
            type: 'flags',
            name: 'Releases',
            color: '#333333',
            shape: 'eventLabel',
            className: 'release',
            // useHTML: true,
            data: [{
                x: '2009-11-27',
                text: 'Highcharts version 1.0 released',
                title: '1.0'
            },
            {
                x: '2010-07-13',
                text: 'Ported from canvas to SVG rendering',
                title: '2.0'
            },
            {
                x: '2010-11-23',
                text: 'Dynamically resize and scale to text labels',
                title: '2.1'
            },
            {
                x: '2012-08-24',
                text: 'Gauges, polar charts and range series',
                title: '2.3'
            },
            {
                x: '2013-03-22',
                text: 'Multitouch support, more series types',
                title: '3.0'
            },
            {
                x: '2014-04-22',
                text: '3D charts, heatmaps',
                title: '4.0'
            },
            {
                x: '2016-09-29',
                text: 'Styled mode, responsive options, accessibility, ' +
                    'chart.update',
                title: '5.0'
            },
            {
                x: '2017-10-04',
                text: 'Annotations, Boost, Series labels, new series types',
                title: '6.0'
            },
            {
                x: '2018-12-11',
                text: 'Sonification, TypeScript (beta), new series types',
                title: '7.0'
            },
            {
                x: '2019-12-10',
                text: 'Accessibility, data sorting, marker clusters',
                title: '8.0'
            },
            {
                x: '2021-02-02',
                text: 'Improved security, accessibility options, zoom by ' +
                    'single touch',
                title: '9.0'
            },
            {
                x: '2022-03-07',
                text: 'Bread crumbs, improved Boost pixel ratio,<br>' +
                    'threshold alignment in charts<br>with multiple axes',
                title: '10.0'
            },
            {
                x: '2023-04-27',
                text: 'Design upgrade, Faster codebase,<br>Flow maps, ' +
                    'Pictorial charts,<br>Treegraphs, Geographical<br>' +
                    'heatmaps, Audio charts',
                title: '11.0'
            }
            ],
            y: -32,
            showInLegend: false
        },
        // 2
        {
            type: 'flags',
            name: 'logo',
            shape: 'url(https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2021/05/19085042/favicon-1.ico)',
            data: [{
                x: '2014-05-21',
                text: 'New logo',
                title: ' '
            }],
            y: -250,
            showInLegend: false

        },
        // 3
        {
            type: 'flags',
            name: 'Events',
            className: 'award',
            shape: 'eventLabel',
            data: [{
                x: '2012-11-01',
                text: 'Highsoft won "Entrepeneur of the Year" in Sogn og ' +
                    'Fjordane, Norway',
                title: '<p>Award</p>'
            },
            {
                x: '2012-12-25',
                text:
                `<p style="margin-top:20px">Packt Publishing published
                <em>Learning Highcharts by Example</em>.<br>Since
                then, many other books have
                been written about Highcharts.</p>`,
                title: '<p class="wide">First Book</p>',
                className: 'book'
            },
            {
                x: '2013-05-25',
                text: 'Highsoft nominated Norway\'s Startup of the Year',
                title: '<p>Award</p>'
            },
            {
                x: '2014-05-25',
                text: 'Highsoft nominated Best Startup in Nordic Startup ' +
                    'Awards',
                title: '<p>Award</p>'
            },
            {
                x: '2017-10-20',
                text: 'Torstein awarded EY Entrepeneur of the Year, Vestlandet',
                title: '<p>Award</p>'
            },
            {
                x: '2018-12-13',
                text: 'Grethe awarded NCE Ambassador',
                title: '<p>Award</p>'
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
Highcharts.chart('container', options);
