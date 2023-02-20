// Get the turnover. Read the table from the HTML, sort by the joined/left
// events and keep track of the number of employees.
// function getTurnover() {
//     let employees = 0;
//     return [].reduce.call(
//         document.getElementById('turnover').querySelectorAll('tr'),
//         (turnover, tr) => {
//             const dateJoined = Date.parse(tr.children[1].textContent);
//             if (!isNaN(dateJoined)) {
//                 turnover.push({
//                     x: dateJoined,
//                     name: `${tr.children[0].textContent} joined`,
//                     accumulate: 1,
//                     image: tr.children[3].textContent || null
//                 });
//             } else {
//                 turnover.push({
//                     x: Date.UTC(2023, 1, 28),
//                     name: null,
//                     accumulate: null,
//                     image: null
//                 });
//             }
//             const dateLeft = Date.parse(tr.children[2].textContent);
//             if (!isNaN(dateLeft)) {
//                 turnover.push({
//                     x: dateLeft,
//                     name: `${tr.children[0].textContent} left`,
//                     accumulate: -1,
//                     image: null
//                 });
//             }

//             return turnover;
//         },
//         [])
//         .sort((a, b) => a.x - b.x)
//         .map(event => Object.assign(
//             event, {
//                 y: (employees += event.accumulate)
//             }
//         ));
// }

const employees = [{ x: 1257033600000, y: 1 },
    { x: 1290211200000, y: 2 },
    { x: 1301616000000, y: 3 },
    { x: 1312156800000, y: 4 },
    { x: 1313366400000, y: 5 },
    { x: 1338508800000, y: 6 },
    { x: 1346457600000, y: 5 },
    { x: 1347667200000, y: 6 },
    { x: 1375315200000, y: 7 },
    { x: 1376956800000, y: 8 },
    { x: 1380585600000, y: 9 },
    { x: 1407456000000, y: 10 },
    { x: 1412121600000, y: 11 },
    { x: 1420070400000, y: 12 },
    { x: 1420070400000, y: 13 },
    { x: 1431216000000, y: 14 },
    { x: 1433030400000, y: 13 },
    { x: 1433116800000, y: 12 },
    { x: 1439856000000, y: 13 },
    { x: 1439856000000, y: 14 },
    { x: 1448928000000, y: 15 },
    { x: 1451606400000, y: 16 },
    { x: 1454284800000, y: 17 },
    { x: 1454284800000, y: 18 },
    { x: 1461974400000, y: 17 },
    { x: 1465776000000, y: 18 },
    { x: 1469750400000, y: 17 },
    { x: 1470009600000, y: 18 },
    { x: 1471219200000, y: 19 },
    { x: 1471824000000, y: 20 },
    { x: 1487462400000, y: 19 },
    { x: 1498780800000, y: 18 },
    { x: 1498867200000, y: 19 },
    { x: 1501545600000, y: 20 },
    { x: 1506297600000, y: 21 },
    { x: 1506297600000, y: 22 },
    { x: 1512000000000, y: 21 },
    { x: 1514764800000, y: 22 },
    { x: 1517443200000, y: 23 },
    { x: 1533081600000, y: 24 },
    { x: 1534723200000, y: 25 },
    { x: 1534723200000, y: 26 },
    { x: 1552521600000, y: 27 },
    { x: 1552521600000, y: 28 },
    { x: 1554076800000, y: 29 },
    { x: 1557100800000, y: 30 },
    { x: 1559520000000, y: 31 }, //june 02 2019
    { x: 1560816000000, y: 30 }, //06-17-2019
    { x: 1565568000000, y: 31 }, //08-11-2019
    { x: 1565654400000, y: 32 }, //08-12-2019
    { x: 1566172800000, y: 33 }, //08-18-2019
    { x: Date.UTC(2019, 8, 30), y: 31 },
    { x: Date.UTC(2020, 0, 11), y: 29 },
    { x: Date.UTC(2020, 1, 21), y: 28 },
    { x: Date.UTC(2020, 5, 11), y: 27 },
    { x: Date.UTC(2020, 6, 31), y: 26 },
    { x: Date.UTC(2020, 8, 21), y: 28 },
    { x: Date.UTC(2020, 9, 31), y: 29 },
    { x: Date.UTC(2020, 10, 11), y: 30 },
    { x: Date.UTC(2021, 0, 1), y: 34 },
    { x: Date.UTC(2021, 1, 11), y: 35 },
    { x: Date.UTC(2021, 2, 30), y: 34 },
    { x: Date.UTC(2021, 4, 30), y: 35 },
    { x: Date.UTC(2021, 5, 3), y: 37 },
    { x: Date.UTC(2021, 6, 30), y: 36 },
    { x: Date.UTC(2021, 7, 10), y: 39 },
    { x: Date.UTC(2021, 8, 30), y: 38 },
    { x: Date.UTC(2021, 9, 13), y: 39 },
    { x: Date.UTC(2022, 0, 30), y: 31 },
    { x: Date.UTC(2022, 1, 10), y: 32 },
    { x: Date.UTC(2022, 2, 30), y: 33 },
    { x: Date.UTC(2022, 3, 3), y: 34 },
    { x: Date.UTC(2022, 5, 30), y: 35 },
    { x: Date.UTC(2022, 6, 10), y: 34 },
    { x: Date.UTC(2022, 8, 30), y: 33 },
    { x: Date.UTC(2022, 9, 3), y: 32 },
    { x: Date.UTC(2022, 10, 30), y: 33 },
    { x: Date.UTC(2022, 11, 10), y: 34 }
];
const revData = [
    [1259622000000, 20],
    [1262300400000, 18],
    [1264978800000, 15],
    [1267398000000, 19],
    [1270072800000, 16],
    [1272664800000, 16],
    [1275343200000, 18],
    [1277935200000, 16],
    [1280613600000, 17],
    [1283292000000, 20],
    [1285884000000, 24],
    [1288566000000, 19],
    [1291158000000, 22],
    [1293836400000, 20],
    [1296514800000, 17],
    [1298934000000, 21],
    [1301608800000, 17],
    [1304200800000, 17],
    [1306879200000, 20],
    [1309471200000, 18],
    [1312149600000, 19],
    [1314828000000, 22],
    [1317420000000, 26],
    [1320102000000, 21],
    [1322694000000, 24],
    [1325372400000, 23],
    [1328050800000, 19],
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
    [1359673200000, 23],
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
    [1391209200000, 35],
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
    [1422745200000, 48],
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
    [1454281200000, 56],
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
    [1485903600000, 43],
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
    [1517439600000, 56],
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
    [1548975600000, 67],
    [1551394800000, 62],
    [1554069600000, 78],
    [1556661600000, 63],
    [1559340000000, 82],
    [1561932000000, 62],
    [1564610400000, 77],
    [1567288800000, 67],
    [1569880800000, 56],
    [1572480000000, 78],
    [1575072000000, 72],
    [1577750400000, 68],
    [1580428800000, 69],
    [1582848000000, 65],
    [1585612800000, 59],
    [1588204800000, 84],
    [1590883200000, 68],
    [1593475200000, 58],
    [1596153600000, 72],
    [1598832000000, 55],
    [1601424000000, 72],
    [1604102400000, 77],
    [1606694400000, 55],
    [1609372800000, 60],
    [1612051200000, 63],
    [1614470400000, 55],
    [1617148800000, 76],
    [1619740800000, 53],
    [1622419200000, 71],
    [1625011200000, 62],
    [1627689600000, 72],
    [1630368000000, 56],
    [1632960000000, 66],
    [1635638400000, 72],
    [1638230400000, 61],
    [1640908800000, 60],
    [1643587200000, 100],
    [1646006400000, 64],
    [1648684800000, 91],
    [1651276800000, 47],
    [1653955200000, 66],
    [1656547200000, 79],
    [1659225600000, 70],
    [1661904000000, 61],
    [1664496000000, 55],
    [1667174400000, 73],
    [1669766400000, 74],
    [1672444800000, 0]
];

const imgPath = 'https://cdn.rawgit.com/highcharts/highcharts/0b81a74ecd2fbd2e9b24489bf476f8baecc218e1/samples/graphics/homepage/';
const options = {
    chart: {
        height: 600,
        styledMode: true,
        scrollablePlotArea: {
            minWidth: 700,
            scrollPositionX: 0
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
            max: Date.UTC(2022, 10, 30),
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
        {
            type: 'datetime',
            minTickInterval: 365 * 24 * 36e5,
            max: Date.UTC(2019, 11, 31),
            labels: {
                align: 'left',
                style: {
                    fontSize: '16px'
                }
            }
        }
    ],
    title: {
        text: ''
    },
    tooltip: {
        outside: true,
        className: 'tip'
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
            },
            allowOverlapX: false
        }
    },
    series: [{
        name: 'Revenue',
        type: 'areaspline',
        className: 'revenue',
        id: 'revenue',
        data: revData,
        // xAxis: 1,
        tooltip: {
            xDateFormat: '%B %Y',
            valueSuffix: ' % of best month'
        }
    }, {
        yAxis: 1,
        // xAxis: 1,
        name: 'Highsoft employees',
        id: 'employees',
        className: 'employees',
        type: 'area',
        step: 'left',
        tooltip: {
            headerFormat: '<span style="font-size: 11px;color:#f0f0f0">{point.x:%B %e, %Y}</span>',
            pointFormat: '{point.name}<br><b>{point.y}</b>',
            valueSuffix: ' employees'
        },
        data: employees//getTurnover()

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
        //0
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
        //1
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
            },
            {
                x: Date.UTC(2019, 11, 10),
                text: 'Accessibility, data sorting, marker clusters',
                title: '8.0'
            },
            {
                x: Date.UTC(2021, 1, 2),
                text: 'Improved security, accessibility options, zoom by single touch',
                title: '9.0'
            },
            {
                x: Date.UTC(2022, 2, 7),
                text: 'Bread crumbs, improved Boost pixel ratio, threshold alignment in charts with multiple axes',
                title: '10.0'
            }
            ],
            showInLegend: false
        },
        //2
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
        //3
        {
            type: 'flags',
            useHTML: true,
            name: 'Events',
            className: 'award',
            shape: 'url(' + imgPath + 'award.png)',
            data: [{
                x: Date.UTC(2012, 10, 1),
                text: 'Highsoft won "Entrepeneur of the Year" in Sogn og Fjordane, Norway',
                title: '<p>Award</p>'
            },
            {
                x: Date.UTC(2012, 11, 25),
                text:
                `<p style="margin-top:20px">Packt Publishing published
                <em>Learning Highcharts by Example</em>.<br>Since
                then, many other books have
                been written about Highcharts.</p>`,
                title: '<p class="wide">First Book</p>',
                className: 'book'
            },
            {
                x: Date.UTC(2013, 4, 25),
                text: 'Highsoft nominated Norway\'s Startup of the Year',
                title: '<p>Award</p>'
            },
            {
                x: Date.UTC(2014, 4, 25),
                text: 'Highsoft nominated Best Startup in Nordic Startup Awards',
                title: '<p>Award</p>'
            },
            {
                x: Date.UTC(2017, 9, 20),
                text: 'Torstein awarded EY Entrepeneur of the Year, Vestlandet',
                title: '<p>Award</p>'
            },
            {
                x: Date.UTC(2018, 11, 13),
                text: 'Grethe awarded NCE Ambassador',
                title: '<p>Award</p>'
            }
            ],
            style: {
                color: '#fff'
            },
            textAlign: 'center',
            onSeries: 'revenue',
            allowOverlapX: false,
            showInLegend: false
        },
        //4
        {
            type: 'flags',
            name: 'Gantt',
            className: 'product',
            color: '#333333',
            shape: 'url(' + imgPath + 'product.png)',
            tooltip: {
                distance: 60
            },
            data: [{
                x: Date.UTC(2018, 9, 17),
                text: 'Gantt version 1.0 released',
                title: 'Gantt'
            }],
            showInLegend: false
        }

    );
}
Highcharts.chart('timeline', options);
