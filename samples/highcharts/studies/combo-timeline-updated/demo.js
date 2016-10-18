/**
 * This is an advanced demo of setting up Highcharts with the flags feature borrowed from Highstock.
 * It also shows custom graphics drawn in the chart area on chart load.
 */


/**
 * Fires on chart load, called from the chart.events.load option.
 */
function onChartLoad() {

    var centerX = 140,
        centerY = 110,
        path = [],
        angle,
        radius,
        badgeColor = Highcharts.Color(Highcharts.getOptions().colors[0]).brighten(-0.2).get(),
        spike,
        empImage,
        big5,
        label,
        left,
        right,
        years,
        renderer;

    if (this.chartWidth < 530) {
        return;
    }

    // Draw the spiked disc
    for (angle = 0; angle < 2 * Math.PI; angle += Math.PI / 24) {
        radius = spike ? 80 : 70;
        path.push(
            'L',
            centerX + radius * Math.cos(angle),
            centerY + radius * Math.sin(angle)
        );
        spike = !spike;
    }
    path[0] = 'M';
    path.push('z');
    this.renderer.path(path)
        .attr({
            fill: badgeColor,
            zIndex: 6
        })
        .add();

    // Employee image overlay
    empImage = this.renderer.path(path)
        .attr({
            zIndex: 7,
            opacity: 0,
            stroke: badgeColor,
            'stroke-width': 1
        })
        .add();

    // Big 5
    big5 = this.renderer.text('5')
        .attr({
            zIndex: 6
        })
        .css({
            color: 'white',
            fontSize: '100px',
            fontStyle: 'italic',
            fontFamily: '\'Brush Script MT\', sans-serif'
        })
        .add();
    big5.attr({
        x: centerX - big5.getBBox().width / 2,
        y: centerY + 14
    });

    // Draw the label
    label = this.renderer.text('Highcharts Anniversary')
        .attr({
            zIndex: 6
        })
        .css({
            color: '#FFFFFF'
        })
        .add();

    left = centerX - label.getBBox().width / 2;
    right = centerX + label.getBBox().width / 2;

    label.attr({
        x: left,
        y: centerY + 44
    });

    // The band
    left = centerX - 90;
    right = centerX + 90;
    this.renderer
        .path([
            'M', left, centerY + 30,
            'L', right, centerY + 30,
            right, centerY + 50,
            left, centerY + 50,
            'z',
            'M', left, centerY + 40,
            'L', left - 20, centerY + 40,
            left - 10, centerY + 50,
            left - 20, centerY + 60,
            left + 10, centerY + 60,
            left, centerY + 50,
            left + 10, centerY + 60,
            left + 10, centerY + 50,
            left, centerY + 50,
            'z',
            'M', right, centerY + 40,
            'L', right + 20, centerY + 40,
            right + 10, centerY + 50,
            right + 20, centerY + 60,
            right - 10, centerY + 60,
            right, centerY + 50,
            right - 10, centerY + 60,
            right - 10, centerY + 50,
            right, centerY + 50,
            'z'
        ])
        .attr({
            fill: badgeColor,
            stroke: '#FFFFFF',
            'stroke-width': 1,
            zIndex: 5
        })
        .add();

    // 2009-2014
    years = this.renderer.text('2009-2014')
        .attr({
            zIndex: 6
        })
        .css({
            color: '#FFFFFF',
            fontStyle: 'italic',
            fontSize: '10px'
        })
        .add();
    years.attr({
        x: centerX - years.getBBox().width / 2,
        y: centerY + 62
    });


    // Prepare mouseover
    renderer = this.renderer;
    if (renderer.defs) { // is SVG
        $.each(this.get('employees').points, function () {
            var point = this,
                pattern;
            if (point.image) {
                pattern = renderer.createElement('pattern').attr({
                    id: 'pattern-' + point.image,
                    patternUnits: 'userSpaceOnUse',
                    width: 400,
                    height: 400
                }).add(renderer.defs);
                renderer.image(
                    'https://www.highcharts.com/images/employees2014/' + point.image + '.jpg',
                    centerX - 80,
                    centerY - 80,
                    160,
                    213
                ).add(pattern);

                Highcharts.addEvent(point, 'mouseOver', function () {
                    empImage
                        .attr({
                            fill: 'url(#pattern-' + point.image + ')'
                        })
                        .animate({ opacity: 1 }, { duration: 500 });
                });
                Highcharts.addEvent(point, 'mouseOut', function () {
                    empImage.animate({ opacity: 0 }, { duration: 500 });
                });
            }
        });
    }
}

$(function () {
    var options = {

        chart: {
            events: {
                load: onChartLoad
            }
        },

        xAxis: {
            type: 'datetime',
            minTickInterval: 365 * 24 * 36e5,
            labels: {
                align: 'left'
            },
            plotBands: [{
                from: Date.UTC(2009, 10, 27),
                to: Date.UTC(2010, 11, 1),
                color: '#EFFFFF',
                label: {
                    text: '<em>Offices:</em><br> Torstein\'s basement',
                    style: {
                        color: '#999999'
                    },
                    y: 180
                }
            }, {
                from: Date.UTC(2010, 11, 1),
                to: Date.UTC(2013, 9, 1),
                color: '#FFFFEF',
                label: {
                    text: '<em>Offices:</em><br> Tomtebu',
                    style: {
                        color: '#999999'
                    },
                    y: 30
                }
            }, {
                from: Date.UTC(2013, 9, 1),
                to: Date.UTC(2015, 10, 27),
                color: '#FFEFFF',
                label: {
                    text: '<em>Offices:</em><br> VikØrsta',
                    style: {
                        color: '#999999'
                    },
                    y: 30
                }
            }]

        },

        title: {
            text: 'Highcharts and Highsoft timeline'
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
            title: {
                text: ''
            },
            gridLineColor: 'rgba(0, 0, 0, 0.07)'
        }, {
            allowDecimals: false,
            max: 15,
            labels: {
                style: {
                    color: Highcharts.getOptions().colors[2]
                }
            },
            title: {
                text: 'Employees',
                style: {
                    color: Highcharts.getOptions().colors[2]
                }
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
                fillOpacity: 0.5
            },
            flags: {
                tooltip: {
                    xDateFormat: '%B %e, %Y'
                }
            }
        },

        series: [{
            type: 'spline',
            id: 'google-trends',
            dashStyle: 'dash',
            name: 'Google search for <em>highcharts</em>',
            data: [{ x: 1258322400000, /* November 2009 */ y: 0 }, { x: 1260961200000, y: 5 }, { x: 1263639600000, y: 7 }, { x: 1266188400000, y: 5 }, { x: 1268740800000, y: 6 }, { x: 1271368800000, y: 8 }, { x: 1274004000000, y: 11 }, { x: 1276639200000, y: 9 }, { x: 1279274400000, y: 12 }, { x: 1281952800000, y: 13 }, { x: 1284588000000, y: 17 }, { x: 1287223200000, y: 17 }, { x: 1289858400000, y: 18 }, { x: 1292497200000, y: 20 }, { x: 1295175600000, y: 20 }, { x: 1297724400000, y: 27 }, { x: 1300276800000, y: 32 }, { x: 1302904800000, y: 29 }, { x: 1305540000000, y: 34 }, { x: 1308175200000, y: 34 }, { x: 1310810400000, y: 36 }, { x: 1313488800000, y: 43 }, { x: 1316124000000, y: 44 }, { x: 1318759200000, y: 42 }, { x: 1321394400000, y: 47 }, { x: 1324033200000, y: 46 }, { x: 1326711600000, y: 50 }, { x: 1329303600000, y: 57 }, { x: 1331899200000, y: 54 }, { x: 1334527200000, y: 59 }, { x: 1337162400000, y: 62 }, { x: 1339797600000, y: 66 }, { x: 1342432800000, y: 61 }, { x: 1345111200000, y: 68 }, { x: 1347746400000, y: 67 }, { x: 1350381600000, y: 73 }, { x: 1353016800000, y: 63 }, { x: 1355655600000, y: 54 }, { x: 1358334000000, y: 67 }, { x: 1360882800000, y: 74 }, { x: 1363435200000, y: 81 }, { x: 1366063200000, y: 89 }, { x: 1368698400000, y: 83 }, { x: 1371333600000, y: 88 }, { x: 1373968800000, y: 86 }, { x: 1376647200000, y: 81 }, { x: 1379282400000, y: 83 }, { x: 1381917600000, y: 95 }, { x: 1384552800000, y: 86 }, { x: 1387191600000, y: 83 }, { x: 1389870000000, y: 89 }, { x: 1392418800000, y: 90 }, { x: 1394971200000, y: 94 }, { x: 1397599200000, y: 100 }, { x: 1400234400000, y: 100 }, { x: 1402869600000, y: 99 }, { x: 1405504800000, y: 99 }, { x: 1408183200000, y: 93 }, { x: 1410818400000, y: 97 }, { x: 1413453600000, y: 98 }],
            tooltip: {
                xDateFormat: '%B %Y',
                valueSuffix: ' % of best month'
            }
        }, {
            name: 'Revenue',
            id: 'revenue',
            type: 'area',
            data: [
                [
                    1259622000000,
                    2
                ],
                [
                    1262300400000,
                    2
                ],
                [
                    1264978800000,
                    2
                ],
                [
                    1267398000000,
                    2
                ],
                [
                    1270072800000,
                    2
                ],
                [
                    1272664800000,
                    3
                ],
                [
                    1275343200000,
                    3
                ],
                [
                    1277935200000,
                    3
                ],
                [
                    1280613600000,
                    5
                ],
                [
                    1283292000000,
                    4
                ],
                [
                    1285884000000,
                    6
                ],
                [
                    1288566000000,
                    7
                ],
                [
                    1291158000000,
                    5
                ],
                [
                    1293836400000,
                    7
                ],
                [
                    1296514800000,
                    9
                ],
                [
                    1298934000000,
                    10
                ],
                [
                    1301608800000,
                    10
                ],
                [
                    1304200800000,
                    10
                ],
                [
                    1306879200000,
                    11
                ],
                [
                    1309471200000,
                    15
                ],
                [
                    1312149600000,
                    13
                ],
                [
                    1314828000000,
                    14
                ],
                [
                    1317420000000,
                    22
                ],
                [
                    1320102000000,
                    23
                ],
                [
                    1322694000000,
                    25
                ],
                [
                    1325372400000,
                    23
                ],
                [
                    1328050800000,
                    27
                ],
                [
                    1330556400000,
                    25
                ],
                [
                    1333231200000,
                    24
                ],
                [
                    1335823200000,
                    27
                ],
                [
                    1338501600000,
                    24
                ],
                [
                    1341093600000,
                    27
                ],
                [
                    1343772000000,
                    29
                ],
                [
                    1346450400000,
                    33
                ],
                [
                    1349042400000,
                    29
                ],
                [
                    1351724400000,
                    36
                ],
                [
                    1354316400000,
                    28
                ],
                [
                    1356994800000,
                    29
                ],
                [
                    1359673200000,
                    29
                ],
                [
                    1362092400000,
                    35
                ],
                [
                    1364767200000,
                    35
                ],
                [
                    1367359200000,
                    38
                ],
                [
                    1370037600000,
                    41
                ],
                [
                    1372629600000,
                    45
                ],
                [
                    1375308000000,
                    42
                ],
                [
                    1377986400000,
                    43
                ],
                [
                    1380578400000,
                    41
                ],
                [
                    1383260400000,
                    41
                ],
                [
                    1385852400000,
                    40
                ],
                [
                    1388530800000,
                    44
                ],
                [
                    1391209200000,
                    36
                ],
                [
                    1393628400000,
                    49
                ],
                [
                    1396303200000,
                    38
                ],
                [
                    1398895200000,
                    47
                ],
                [
                    1401573600000,
                    43
                ],
                [
                    1404165600000,
                    44
                ],
                [
                    1406844000000,
                    44
                ],
                [
                    1409522400000,
                    60
                ],
                [
                    1412114400000,
                    69
                ],
                [
                    1414796400000,
                    59
                ],
                [
                    1417388400000,
                    82
                ],
                [
                    1420066800000,
                    60
                ],
                [
                    1422745200000,
                    57
                ],
                [
                    1425164400000,
                    89
                ],
                [
                    1427839200000,
                    66
                ],
                [
                    1430431200000,
                    54
                ],
                [
                    1433109600000,
                    75
                ],
                [
                    1435701600000,
                    70
                ],
                [
                    1438380000000,
                    71
                ],
                [
                    1441058400000,
                    85
                ],
                [
                    1443650400000,
                    100
                ]
            ],
            tooltip: {
                xDateFormat: '%B %Y',
                valueSuffix: ' % of best month'
            }

        }, {
            yAxis: 1,
            name: 'Highsoft employees',
            id: 'employees',
            type: 'area',
            step: 'left',
            tooltip: {
                headerFormat: '<span style="font-size: 11px;color:#666">{point.x:%B %e, %Y}</span><br>',
                pointFormat: '{point.name}<br><b>{point.y}</b>',
                valueSuffix: ' employees'
            },
            data: [
                { x: Date.UTC(2009, 10, 1), y: 1, name: 'Torstein worked alone', image: 'Torstein' },
                { x: Date.UTC(2010, 10, 20), y: 2, name: 'Grethe joined', image: 'Grethe' },
                { x: Date.UTC(2011, 3, 1), y: 3, name: 'Erik joined', image: null },
                { x: Date.UTC(2011, 7, 1), y: 4, name: 'Gert joined', image: 'Gert' },
                { x: Date.UTC(2011, 7, 15), y: 5, name: 'Hilde joined', image: 'Hilde' },
                { x: Date.UTC(2012, 5, 1), y: 6, name: 'Guro joined', image: 'Guro' },
                { x: Date.UTC(2012, 8, 1), y: 5, name: 'Erik left', image: null },
                { x: Date.UTC(2012, 8, 15), y: 6, name: 'Anne Jorunn joined', image: 'AnneJorunn' },
                { x: Date.UTC(2013, 0, 1), y: 7, name: 'Hilde T. joined', image: null },
                { x: Date.UTC(2013, 7, 1), y: 8, name: 'Jon Arild joined', image: 'JonArild' },
                { x: Date.UTC(2013, 7, 20), y: 9, name: 'Øystein joined', image: 'Oystein' },
                { x: Date.UTC(2013, 9, 1), y: 10, name: 'Stephane joined', image: null },
                { x: Date.UTC(2014, 9, 1), y: 11, name: 'Anita joined', image: 'Anita' },
                { x: Date.UTC(2015, 0, 1), y: 12, name: 'Gjertrud joined', image: 'Gjertrud' },
                { x: Date.UTC(2015, 1, 1), y: 13, name: 'Mustapha joined', image: 'Mustapha' },
                { x: Date.UTC(2015, 4, 10), y: 14, name: 'Katharina joined', image: 'Katharina' },
                { x: Date.UTC(2015, 5, 1), y: 13, name: 'Stephane left', image: null },
                { x: Date.UTC(2015, 7, 18), y: 14, name: 'Linda joined', image: 'Linda' },
                { x: Date.UTC(2015, 7, 18, 1), y: 15, name: 'Sigrid joined', image: 'Sigrid' },
                { x: Date.UTC(2015, 10, 27), y: 15, name: ' ', image: null }
            ]

        }]
    };

    // Add flags for important milestones. This requires Highstock.
    if (Highcharts.seriesTypes.flags) {
        options.series.push({
            type: 'flags',
            name: 'Cloud',
            color: '#333333',
            shape: 'squarepin',
            y: -80,
            data: [
                { x: Date.UTC(2014, 4, 1), text: 'Highcharts Cloud Beta', title: 'Cloud', shape: 'squarepin' }
            ],
            showInLegend: false
        }, {
            type: 'flags',
            name: 'Highmaps',
            color: '#333333',
            shape: 'squarepin',
            y: -55,
            data: [
                { x: Date.UTC(2014, 5, 13), text: 'Highmaps version 1.0 released', title: 'Maps' }
            ],
            showInLegend: false
        }, {
            type: 'flags',
            name: 'Highcharts',
            color: '#333333',
            shape: 'circlepin',
            data: [
                { x: Date.UTC(2009, 10, 27), text: 'Highcharts version 1.0 released', title: '1.0' },
                { x: Date.UTC(2010, 6, 13), text: 'Ported from canvas to SVG rendering', title: '2.0' },
                { x: Date.UTC(2010, 10, 23), text: 'Dynamically resize and scale to text labels', title: '2.1' },
                { x: Date.UTC(2011, 9, 18), text: 'Highstock version 1.0 released', title: 'Stock', shape: 'squarepin' },
                { x: Date.UTC(2012, 7, 24), text: 'Gauges, polar charts and range series', title: '2.3' },
                { x: Date.UTC(2013, 2, 22), text: 'Multitouch support, more series types', title: '3.0' },
                { x: Date.UTC(2014, 3, 22), text: '3D charts, heatmaps', title: '4.0' }
            ],
            showInLegend: false
        }, {
            type: 'flags',
            name: 'Events',
            color: '#333333',
            fillColor: 'rgba(255,255,255,0.8)',
            data: [
                { x: Date.UTC(2012, 10, 1), text: 'Highsoft won "Entrepeneur of the Year" in Sogn og Fjordane, Norway', title: 'Award' },
                { x: Date.UTC(2012, 11, 25), text: 'Packt Publishing published <em>Learning Highcharts by Example</em>. Since then, many other books are written about Highcharts.', title: 'First book' },
                { x: Date.UTC(2013, 4, 25), text: 'Highsoft nominated Norway\'s Startup of the Year', title: 'Award' },
                { x: Date.UTC(2014, 4, 25), text: 'Highsoft nominated Best Startup in Nordic Startup Awards', title: 'Award' }
            ],
            onSeries: 'revenue',
            showInLegend: false
        });
    }

    $('#container').highcharts(options);
});