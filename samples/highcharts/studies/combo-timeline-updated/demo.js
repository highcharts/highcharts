/**
 * This is an advanced demo of setting up Highcharts with the flags feature borrowed from Highcharts Stock.
 * It also shows custom graphics drawn in the chart area on chart load.
 */


/**
 * Fires on chart load, called from the chart.events.load option.
 */
function onChartLoad() {

    var centerX = Math.max(this.chartWidth * 0.2, 140),
        centerY = Math.max(this.chartHeight * 0.3, 110),
        path = [],
        angle,
        radius,
        badgeColor = Highcharts.color(Highcharts.getOptions().colors[0])
            .brighten(-0.2)
            .get(),
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
    big5 = this.renderer.text('10')
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

    // 2009-2019
    years = this.renderer.text('2009-2019')
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
        this.get('employees').points.forEach(point => {
            let pattern;

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
                        .animate({
                            opacity: 1
                        }, {
                            duration: 500
                        });
                });
                Highcharts.addEvent(point, 'mouseOut', function () {
                    empImage.animate({
                        opacity: 0
                    }, {
                        duration: 500
                    });
                });
            }
        });
    }
}

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
                    image: tr.children[3].textContent || null
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

const options = {
    chart: {
        events: {
            load: onChartLoad
        },
        height: '56%'
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
                text: '<em>Offices:</em><br> Torstein\'s<br>basement',
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
            to: Date.UTC(2016, 2, 10),
            color: '#FFEFFF',
            label: {
                text: '<em>Offices:</em><br> VikØrsta',
                style: {
                    color: '#999999'
                },
                y: 30
            }
        }, {
            from: Date.UTC(2016, 2, 10),
            to: Date.now(),
            color: '#EFFFEF',
            label: {
                text: '<em>Offices:</em><br> Blix Hotel',
                style: {
                    color: '#999999'
                },
                align: 'left',
                y: 20,
                x: 20
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
        title: {
            text: 'Employees'
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
            clip: false,
            tooltip: {
                xDateFormat: '%B %e, %Y'
            },
            allowOverlapX: true
        }
    },
    series: [{
        name: 'Revenue',
        id: 'revenue',
        type: 'area',
        data: [
            [1259622000000, 2],
            [1262300400000, 2],
            [1264978800000, 2],
            [1267398000000, 2],
            [1270072800000, 2],
            [1272664800000, 3],
            [1275343200000, 3],
            [1277935200000, 3],
            [1280613600000, 5],
            [1283292000000, 4],
            [1285884000000, 6],
            [1288566000000, 7],
            [1291158000000, 5],
            [1293836400000, 7],
            [1296514800000, 8],
            [1298934000000, 10],
            [1301608800000, 9],
            [1304200800000, 10],
            [1306879200000, 11],
            [1309471200000, 14],
            [1312149600000, 13],
            [1314828000000, 13],
            [1317420000000, 21],
            [1320102000000, 23],
            [1322694000000, 24],
            [1325372400000, 22],
            [1328050800000, 26],
            [1330556400000, 24],
            [1333231200000, 23],
            [1335823200000, 26],
            [1338501600000, 24],
            [1341093600000, 26],
            [1343772000000, 28],
            [1346450400000, 32],
            [1349042400000, 28],
            [1351724400000, 35],
            [1354316400000, 27],
            [1356994800000, 28],
            [1359673200000, 28],
            [1362092400000, 34],
            [1364767200000, 34],
            [1367359200000, 37],
            [1370037600000, 40],
            [1372629600000, 44],
            [1375308000000, 41],
            [1377986400000, 42],
            [1380578400000, 40],
            [1383260400000, 40],
            [1385852400000, 38],
            [1388530800000, 42],
            [1391209200000, 34],
            [1393628400000, 47],
            [1396303200000, 37],
            [1398895200000, 46],
            [1401573600000, 41],
            [1404165600000, 42],
            [1406844000000, 42],
            [1409522400000, 58],
            [1412114400000, 66],
            [1414796400000, 57],
            [1417388400000, 79],
            [1420066800000, 58],
            [1422745200000, 55],
            [1425164400000, 86],
            [1427839200000, 64],
            [1430431200000, 53],
            [1433109600000, 73],
            [1435701600000, 68],
            [1438380000000, 69],
            [1441058400000, 83],
            [1443650400000, 97],
            [1446332400000, 78],
            [1448924400000, 81],
            [1451602800000, 68],
            [1454281200000, 68],
            [1456786800000, 84],
            [1459461600000, 73],
            [1462053600000, 73],
            [1464732000000, 72],
            [1467324000000, 72],
            [1470002400000, 86],
            [1472680800000, 76],
            [1475272800000, 83],
            [1477954800000, 84],
            [1480546800000, 83],
            [1483225200000, 53],
            [1485903600000, 60],
            [1488322800000, 80],
            [1490997600000, 71],
            [1493589600000, 63],
            [1496268000000, 77],
            [1498860000000, 57],
            [1501538400000, 98],
            [1504216800000, 55],
            [1506808800000, 84],
            [1509490800000, 74],
            [1512082800000, 79],
            [1514761200000, 71],
            [1517439600000, 50],
            [1519858800000, 95],
            [1522533600000, 69],
            [1525125600000, 93],
            [1527804000000, 80],
            [1530396000000, 56],
            [1533074400000, 63],
            [1535752800000, 72],
            [1538344800000, 85],
            [1541026800000, 90],
            [1543618800000, 78],
            [1546297200000, 86],
            [1548975600000, 76],
            [1551394800000, 92],
            [1554069600000, 76],
            [1556661600000, 100],
            [1559340000000, 73],
            [1561932000000, 95],
            [1564610400000, 80],
            [1567288800000, 71],
            [1569880800000, 96],
            [1572562800000, null]
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
        data: getTurnover()

    }]
};

// Add flags for important milestones. This requires Highcharts Stock.
if (Highcharts.Series.types.flags) {
    options.series.push({
        type: 'flags',
        name: 'Highmaps',
        color: '#333333',
        shape: 'squarepin',
        y: -80,
        data: [{
            x: Date.UTC(2014, 5, 13),
            text: 'Highmaps version 1.0 released',
            title: 'Maps'
        }],
        showInLegend: false
    }, {
        type: 'flags',
        name: 'Cloud',
        color: '#333333',
        shape: 'squarepin',
        y: -55,
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
    }, {
        type: 'flags',
        name: 'Highcharts',
        color: '#333333',
        shape: 'circlepin',
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
            shape: 'squarepin'
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
    }, {
        type: 'flags',
        name: 'logo',
        shape: 'url(https://www.highcharts.com/favicon.ico)',
        data: [{
            x: Date.UTC(2014, 4, 21),
            text: 'New logo',
            title: ' '
        }],
        y: -200,
        showInLegend: false

    }, {
        type: 'flags',
        name: 'Events',
        color: '#333333',
        fillColor: 'rgba(255,255,255,0.8)',
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
        onSeries: 'revenue',
        allowOverlapX: true,
        showInLegend: false
    });
}

Highcharts.chart('container', options);
