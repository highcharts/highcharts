const params = (new URL(document.location)).search;

const pArray = params.split('&');

let chartStr = '';
let chartToShow = 'inverted';


pArray.forEach(function (element) {
    if (element.indexOf('charts=') !== -1) {
        chartStr = element;
    }
});

const chartArray = chartStr.split('=');

if (chartArray.length > 1) {
    chartToShow = chartArray[1];
}

function inverted() {
    Highcharts.ganttChart('container', {

        chart: {
            inverted: true,
            spacing: [0, 0, 0, 10],
            margin: 10
        },
        title: {
            text: ''
        },
        scrollbar: {
            enabled: false
        },
        credits: {
            enabled: 0
        },
        accessibility: {
            keyboardNavigation: {
                seriesNavigation: {
                    mode: 'serialize'
                }
            }
        },
        lang: {
            accessibility: {
                axis: {
                    xAxisDescriptionPlural: 'The chart has a two-part X axis showing time in both week numbers and days.'
                }
            }
        },
        plotOptions: {
            series: {
                opacity: 1,
                pointPadding: 0,
                groupPadding: 0.1
            }
        },
        xAxis: [{
            opposite: false,
            visible: true,
            min: Date.UTC(2018, 10, 25),
            max: Date.UTC(2018, 11, 24),
            labels: {
                allowOverlap: true,
                enabled: false
            },
            dateTimeLabelFormats: {
                week: {
                    list: ['🗓 W%W', '🗓 W%W']
                }
            },
            grid: {
                borderColor: '#707073',
                borderWidth: 0,
                cellHeight: 10
            },
            gridLineColor: '#2f2b38',
            gridLineWidth: 0,
            gridLineDashStyle: 'dot',
            maxPadding: 0,
            minPadding: 0
        }],
        yAxis: {
            offset: -40,
            uniqueNames: true,
            opposite: true,
            title: {
                text: ''
            },
            labels: {
                rotation: 0,
                align: 'center',
                x: -22,
                style: {
                    fontSize: '14px',
                    color: '#000'
                },
                padding: 0
            },
            gridLineColor: 'transparent',
            tickColor: 'transparent',
            gridLineWidth: 0,
            grid: {
                enabled: false,
                cellHeight: 30,
                borderWidth: 0
            },
            plotBands: [{
                from: 1.5,
                to: 3,
                color: 'rgba(217, 219, 248, 0.4)'
            },
            {
                from: 0.5,
                to: 1.5,
                color: 'rgba(217, 219, 248, 0.6)'
            },
            {
                from: -1,
                to: 0.5,
                color: 'rgba(217, 219, 248, 0.8)'
            }]
        },
        series: [{
            name: 'Project 1',
            data: [{
                start: Date.UTC(2018, 11, 1),
                end: Date.UTC(2018, 11, 8),
                // completed: 0.65,
                name: 'Done',
                id: 'Prep'
            },
            {
                start: Date.UTC(2018, 11, 9),
                end: Date.UTC(2018, 11, 16),
                name: 'Done',
                id: 'Design'
            },
            {
                start: Date.UTC(2018, 11, 1),
                end: Date.UTC(2018, 11, 8),
                // completed: 0.5,
                name: 'Doing',
                id: 'Dev'
            }, {
                start: Date.UTC(2018, 11, 9),
                end: Date.UTC(2018, 11, 16),
                // completed: 0.5,
                name: 'Doing',
                id: 'Content'
            }, {
                start: Date.UTC(2018, 11, 1),
                end: Date.UTC(2018, 11, 8),
                // completed: 0.15,
                name: 'Do',
                id: 'QA'
            }, {
                start: Date.UTC(2018, 11, 9),
                end: Date.UTC(2018, 11, 16),
                // completed: 0.3,
                name: 'Do',
                id: 'Launch'
            },
            {
                start: Date.UTC(2018, 11, 17),
                end: Date.UTC(2018, 11, 23),
                // completed: 0.3,
                name: 'Do',
                id: 'Promo'
            }]
        }],
        responsive: {
            rules: [
                // up to 203
                {
                    condition: {
                        // up tp this
                        maxWidth: 203
                    },
                    chartOptions: {
                        chart: {
                            height: 140,
                            margin: [0, 0, 0, 0]
                        },
                        plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.index}',
                                    style: {
                                        textOutline: 'none'
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    condition: {
                        minWidth: 204
                    },
                    chartOptions: {
                        chart: {
                            height: 255,
                            margin: [10, 10, 10, 10]
                        },
                        plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.id}',
                                    style: {
                                        textOutline: 'none'
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        }
    });
}


function subtasks() {
    const today = new Date(),
        day = 1000 * 60 * 60 * 24;

    // Set to 00:00:00:000 today
    today.setUTCHours(0);
    today.setUTCMinutes(0);
    today.setUTCSeconds(0);
    today.setUTCMilliseconds(0);


    // THE CHART
    Highcharts.ganttChart('container', {
        chart: {
            scrollablePlotArea: {
                minHeight: 800
            },
            backgroundColor: '#2F2B38'
        },
        credits: {
            enabled: false
        },
        title: {
            text: ''
        },
        xAxis: {
            visible: true,
            min: today.getTime() - (1 * day),
            max: today.getTime() + (14 * day),
            plotBands: [{
                from: today.getTime() + (0 * day),
                to: today.getTime() + (14 * day),
                color: '#46465C'
            }],
            dateTimeLabelFormats: {
                day: {
                    list: ['%E']
                },
                week: {
                    list: ['Week %W', 'W%W']
                }
            },
            gridLineColor: '#2F2B38',
            gridLineWidth: 1,
            grid: {
                borderWidth: 0
            },
            labels: {
                allowOverlap: true,
                style: {
                    color: '#fff'
                }
            }
        },
        accessibility: {
            keyboardNavigation: {
                seriesNavigation: {
                    mode: 'serialize'
                }
            },
            point: {
                descriptionFormatter: function (point) {
                    const dependency = point.dependency &&
                        point.series.chart.get(point.dependency).name,
                        dependsOn = dependency ? ' Depends on ' + dependency + '.' : '';

                    return Highcharts.format(
                        '{point.yCategory}. Start {point.x:%Y-%m-%d}, end {point.x2:%Y-%m-%d}.{dependsOn}',
                        { point, dependsOn }
                    );
                }
            }
        },
        yAxis: {
            shadow: true,
            offset: -10,
            grid: {
                cellHeight: 1,
                borderWidth: 1,
                borderColor: 'transparent'
            },
            maxPadding: 0,
            minPadding: 0,
            labels: {
                indentation: 5,
                allowOverlap: true,
                padding: 0,
                formatter: function () {
                    return this.value;
                },
                symbol: {
                    // y: 0,
                    fillColor: '#fff',
                    padding: 5
                },
                style: {
                    color: '#fff',
                    fontSize: '12px',
                    padding: 0
                }
            }

        },
        lang: {
            accessibility: {
                axis: {
                    xAxisDescriptionPlural: 'The chart has a two-part X axis showing time in both week numbers and days.'
                }
            }
        },
        plotOptions: {
            series: {
                groupPadding: 0.1,
                borderWidth: 0,
                connectors: {
                    lineWidth: 2
                }
            }
        },
        series: [{
            name: 'Project',
            data: [{
                name: 'Task 1',
                collapsed: true,
                id: '1',
                start: today.getTime(),
                end: today.getTime() + (3 * day),
                color: Highcharts.getOptions().colors[0]
            }, {
                name: '1a ',
                id: '1a',
                parent: '1',
                start: today.getTime(),
                end: today.getTime() + (2 * day),
                color: 'transparent',
                borderColor: Highcharts.getOptions().colors[0],
                borderWidth: 1,
                connectors: {
                    dashStyle: 'dot',
                    lineWidth: 1,
                    lineColor: Highcharts.getOptions().colors[0]
                }
            },
            {
                name: '1b',
                id: '1b',
                parent: '1',
                dependency: '1a',
                start: today.getTime() + (2 * day),
                end: today.getTime() + (3 * day),
                color: 'transparent',
                borderColor: Highcharts.getOptions().colors[0],
                borderWidth: 1,
                connectors: {
                    dashStyle: 'dot',
                    lineWidth: 1,
                    lineColor: Highcharts.getOptions().colors[0]
                }
            },
            {
                name: 'Task 2',
                collapsed: true,
                id: '2',
                dependency: '1',
                start: today.getTime() + (3.5 * day),
                end: today.getTime() + (7 * day),
                color: Highcharts.getOptions().colors[1]
            }, {
                name: '2a',
                id: '2a',
                parent: '2',
                start: today.getTime() + (3.5 * day),
                end: today.getTime() + (5 * day),
                color: Highcharts.getOptions().colors[1]
            },
            {
                name: '2a-1',
                id: '2a-1',
                parent: '2a',
                start: today.getTime() + (3.5 * day),
                end: today.getTime() + (4 * day),
                color: 'transparent',
                borderColor: Highcharts.getOptions().colors[1],
                borderWidth: 1,
                connectors: {
                    dashStyle: 'dot',
                    lineWidth: 1,
                    lineColor: Highcharts.getOptions().colors[1]
                }
            },
            {
                name: '2a-2',
                id: '2a-2',
                dependency: '2a-1',
                parent: '2a',
                start: today.getTime() + (4 * day),
                end: today.getTime() + (4.5 * day),
                color: 'transparent',
                borderColor: Highcharts.getOptions().colors[1],
                borderWidth: 1,
                connectors: {
                    dashStyle: 'dot',
                    lineWidth: 1,
                    lineColor: Highcharts.getOptions().colors[1]
                }
            },
            {
                name: '2a-3',
                id: '2a-3',
                dependency: '2a-2',
                parent: '2a',
                start: today.getTime() + (4.5 * day),
                end: today.getTime() + (5 * day),
                color: 'transparent',
                borderColor: Highcharts.getOptions().colors[1],
                borderWidth: 1,
                connectors: {
                    dashStyle: 'dot',
                    lineWidth: 1,
                    lineColor: Highcharts.getOptions().colors[1]

                }
            },
            {
                name: '2b',
                id: '2b',
                dependency: '2a',
                parent: '2',
                start: today.getTime() + (5 * day),
                end: today.getTime() + (7 * day),
                color: Highcharts.getOptions().colors[1]
            }, {
                name: '2c',
                id: '2c',
                parent: '2',
                start: today.getTime() + (5 * day),
                end: today.getTime() + (7 * day),
                color: Highcharts.getOptions().colors[1]
            },
            {
                name: 'Task 3',
                id: '3',
                dependency: '2',
                collapsed: false,
                start: today.getTime() + (7.5 * day),
                end: today.getTime() + (12 * day),
                color: Highcharts.getOptions().colors[2]
            }, {
                name: '3a',
                id: '3a',
                parent: '3',
                start: today.getTime() + (7.5 * day),
                end: today.getTime() + (10 * day),
                color: 'transparent',
                borderColor: Highcharts.getOptions().colors[2],
                borderWidth: 1,
                connectors: {
                    dashStyle: 'dot',
                    lineWidth: 1,
                    lineColor: Highcharts.getOptions().colors[2]
                }
            }, {
                name: '3b',
                id: '3b',
                dependency: '3a',
                parent: '3',
                start: today.getTime() + (10 * day),
                end: today.getTime() + (12 * day),
                color: 'transparent',
                borderColor: Highcharts.getOptions().colors[2],
                borderWidth: 1,
                connectors: {
                    dashStyle: 'dot',
                    lineWidth: 1,
                    lineColor: Highcharts.getOptions().colors[2]
                }
            }
            ]
        }],
        responsive: {
            rules: [
                // up to 203
                {
                    condition: {
                        // up tp this
                        maxWidth: 203
                    },
                    chartOptions: {
                        chart: {
                            margin: [10, 10, 0, 70],
                            scrollablePlotArea: {
                                minHeight: 500
                            }
                        }
                    }
                },
                {
                    condition: {
                        minWidth: 204
                    },
                    chartOptions: {
                        chart: {
                            margin: [45, 20, 0, 70],
                            height: 260,
                            scrollablePlotArea: {
                                minHeight: 450
                            }
                        }
                    }
                }
            ]
        }
    });

}

function nav() {
    Highcharts.ganttChart('container', {
        chart: {
            height: '100%'
        },
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        yAxis: {
            uniqueNames: true,
            visible: false,
            grid: {
                enabled: true,
                cellHeight: 30,
                borderWidth: 2
            }
        },
        xAxis: {
            visible: true,
            zIndex: 10,
            min: Date.UTC(2017, 11, 1),
            max: Date.UTC(2018, 2, 4),
            grid: {
                enabled: true,
                cellHeight: 20,
                borderWidth: 0
            },
            gridLineColor: 'rgba(255, 255, 255, 0.5)',
            gridLineWidth: 1,
            gridLineDashStyle: 'longDashDot',
            labels: {
                padding: 0,
                style: {
                    fontWeight: 'normal'
                }
            }
        },
        navigator: {
            enabled: true,
            liveRedraw: true,
            margin: 0,
            maskFill: 'rgba(180, 198, 220, 0.5)',
            series: {
                type: 'gantt',
                color: 'white',
                borderColor: 'white',
                pointWidth: 10,
                accessibility: {
                    enabled: false
                }
            },
            xAxis: {
                visible: false
            },
            yAxis: {
                visible: false,
                min: 0,
                max: 3,
                reversed: true,
                categories: []
            }
        },
        rangeSelector: {
            enabled: false,
            selected: 2,
            floating: true,
            inputSpacing: 2,
            y: 0,
            x: 3,
            inputDateFormat: '%b %e, %Y'
        },
        accessibility: {
            point: {
                descriptionFormatter: function (point) {
                    const completedValue = point.completed ?
                            point.completed.amount || point.completed : null,
                        completed = completedValue ?
                            ' Task ' + Math.round(completedValue * 1000) / 10 + '% completed.' :
                            '';
                    return Highcharts.format(
                        '{point.yCategory}.{completed} Start {point.x:%Y-%m-%d}, end {point.x2:%Y-%m-%d}.',
                        { point, completed }
                    );
                }
            },
            series: {
                descriptionFormatter: function (series) {
                    return series.name;
                }
            }
        },
        lang: {
            accessibility: {
                axis: {
                    xAxisDescriptionPlural: 'The chart has a two-part X axis showing time in both week numbers and days.',
                    yAxisDescriptionPlural: 'The chart has one Y axis showing task categories.'
                }
            }
        },
        plotOptions: {
            series: {
                groupPadding: 0.3,
                pointPadding: 0.3,
                pointWidth: 25,
                borderWidth: 0,
                dataLabels: {
                    enabled: false,
                    color: 'white',
                    style: {
                        fontSize: '20px',
                        textOutline: 'none'
                    }
                }
            }
        },
        series: [{
            name: 'Project 1',
            data: [{
                start: Date.UTC(2017, 11, 1),
                end: Date.UTC(2018, 1, 2),
                completed: 0.85,
                name: 'Prototyping',
                borderColor: Highcharts.getOptions().colors[3]
            }, {
                start: Date.UTC(2018, 1, 2),
                end: Date.UTC(2018, 11, 5),
                completed: 0.5,
                name: 'Development'
            }, {
                start: Date.UTC(2018, 11, 8),
                end: Date.UTC(2018, 11, 9),
                completed: 0.15,
                name: 'Testing'
            }, {
                start: Date.UTC(2018, 11, 9),
                end: Date.UTC(2018, 11, 19),
                completed: {
                    amount: 0.3,
                    fill: '#fa0'
                },
                name: 'Development'
            }, {
                start: Date.UTC(2018, 11, 10),
                end: Date.UTC(2018, 11, 23),
                name: 'Testing'
            }, {
                start: Date.UTC(2018, 11, 25, 8),
                end: Date.UTC(2018, 11, 25, 16),
                name: 'Release'
            }]
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 203
                },
                chartOptions: {
                    chart: {
                        margin: [20, 10, 0, 10]
                    },
                    navigator: {
                        height: 30
                    }
                }
            },
            {
                condition: {
                    minWidth: 204
                },
                chartOptions: {
                    chart: {
                        margin: [90, 20, 0, 10],
                        height: 260
                    },
                    navigator: {
                        height: 60
                    }
                }
            }
            ]
        }
    });

}

function drag() {
    /*
    Simple demo showing some interactivity options of Highcharts Gantt. More
    custom behavior can be added using event handlers and API calls. See
    http://api.highcharts.com/gantt.
*/

    let today = new Date();
    const day = 1000 * 60 * 60 * 24;

    // Set to 00:00:00:000 today
    today.setUTCHours(0);
    today.setUTCMinutes(0);
    today.setUTCSeconds(0);
    today.setUTCMilliseconds(0);
    today = today.getTime();


    // Create the chart
    Highcharts.ganttChart('container', {
        chart: {
            borderWidth: 0,
            height: '100%',
            events: {
                load: function () {
                    const chart = this;
                    chart.series[0].points[5].onMouseOver();
                    chart.series[0].points[4].onMouseOver();
                }
            }
        },
        title: {
            floating: false
        },
        credits: {
            enabled: false
        },
        lang: {
            accessibility: {
                axis: {
                    xAxisDescriptionPlural: 'The chart has a two-part X axis showing time in both week numbers and days.'
                }
            }
        },
        accessibility: {
            point: {
                descriptionFormatter: function (point) {
                    return Highcharts.format(
                        point.milestone ?
                            '{point.name}, milestone for {point.yCategory} at {point.x:%Y-%m-%d}.' :
                            '{point.name}, assigned to {point.yCategory} from {point.x:%Y-%m-%d} to {point.x2:%Y-%m-%d}.',
                        { point }
                    );
                }
            }
        },
        plotOptions: {
            series: {
                animation: true, // Do not animate dependency connectors
                dragDrop: {
                    dragHandle: {
                        cursor: 'move'
                    },
                    draggableX: true,
                    draggableY: true,
                    dragMinY: 0,
                    dragMaxY: 2,
                    dragPrecisionX: day, // 3 // Snap to eight hours
                    dragMinX: today - (1.75 * day),
                    dragMaxX: today + day * 12
                },
                connectors: {
                    lineWidth: 2,
                    algorithmMargin: 5
                },
                states: {
                    select:
                    {
                        borderColor: Highcharts.getOptions().colors[6],
                        color: Highcharts.getOptions().colors[6],
                        enabled: true
                    },
                    hover:
                    {
                        borderColor: Highcharts.getOptions().colors[6],
                        color: Highcharts.getOptions().colors[6],
                        enabled: true
                    }
                },
                borderColor: 'transparent',
                pointPadding: 0.2,
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        // nothing
                    },
                    style: {
                        cursor: 'default',
                        pointerEvents: 'none',
                        color: '#fff',
                        textOutline: 'none',
                        fontSize: '18px',
                        padding: 0
                    },
                    y: -5
                },
                allowPointSelect: true
            }
        },
        yAxis: {
            visible: false,
            type: 'category',
            categories: ['Build', 'Content', 'Test'],
            accessibility: {
                description: 'Organization departments'
            },
            tickInterval: 1,
            title: {
                text: ''
            },
            tickLength: 40,
            labels: {
                useHTML: true,
                allowOverlap: true,
                rotation: 270,
                indentation: 0,
                padding: 0,
                format: '<p style="background-color:transparent;border: 0px solid #e6e6e6;padding:10px 8px 8px;">{text}</p>'
            },
            grid: {
                enabled: false
            }
        },
        xAxis: {
            offset: -20,
            currentDateIndicator: {
                enabled: true,
                label: {
                    style: {
                        color: '#FEEAC3',
                        fontSize: '10px',
                        fontWeight: 'bold'
                    }
                },
                color: '#FEEAC3'

            },
            dateTimeLabelFormats: {
                day: {
                    list: ['%e']
                }
            },
            grid: {
                backgroundColor: 'transparent',
                borderColor: 'transparent'
                // cellHeight: 35
            },
            // maxPadding: 0,
            // minPadding: 0,
            // margin: 0,
            // padding: 0,
            gridLineColor: '#BBBAC5',
            gridLineWidth: 1,
            gridLineDashStyle: 'dot',
            labels: {
                useHTML: true,
                allowOverlap: true,
                padding: 0,
                format: '<p style="font-size:10px;background-color:transparent;color:transparent;padding:20px 8px 8px;">{value: %E}</p>'
            }
        },
        tooltip: {
            xDateFormat: '%a %b %d, %H:%M',
            enabled: false
        },
        series: [{
            name: 'Project 1',
            data: [{
                start: today + 2 * day,
                end: today + day * 4.5,
                name: '1',
                id: 'prototype',
                borderColor: '#E1D369',
                borderWidth: 2,
                y: 0,
                zIndex: 1
            },  {
                start: today + day * 4,
                name: '★',
                milestone: true,
                dependency: 'prototype',
                id: 'proto_done',
                zIndex: 100,
                y: 0,
                borderColor: Highcharts.getOptions().colors[4],
                borderWidth: 2,
                color: 'black',
                connectors: {
                    lineColor: '#E1D369',
                    marker: {
                        color: Highcharts.getOptions().colors[0]
                    }
                }
            }, {
                start: today + day * 5.5,
                end: today + day * 6,
                borderColor: '#E1D369',
                borderWidth: 2,
                name: '2',
                dependency: 'proto_done',
                zIndex: 1,
                y: 0,
                connectors: {
                    lineColor: '#E1D369',
                    marker: {
                        color: Highcharts.getOptions().colors[0]
                    }
                }
            },
            {
                start: today + 2 * day,
                end: today + day * 4.5,
                name: '3',
                id: 'prototype2',
                borderColor: Highcharts.getOptions().colors[2],
                borderWidth: 2,
                y: 1
            },  {
                start: today + day * 3,
                name: '★',
                milestone: true,
                dependency: 'prototype2',
                id: 'proto_done2',
                y: 1,
                borderColor: Highcharts.getOptions().colors[2],
                borderWidth: 2,
                color: 'black',
                connectors: {
                    lineColor: Highcharts.getOptions().colors[2],
                    marker: {
                        color: Highcharts.getOptions().colors[2]
                    }
                }
            }, {
                start: today + day * 5.5,
                end: today + day * 6,
                name: '4',
                borderColor: Highcharts.getOptions().colors[2],
                borderWidth: 2,
                dependency: 'proto_done2',
                y: 1,
                connectors: {
                    lineColor: Highcharts.getOptions().colors[2],
                    marker: {
                        color: Highcharts.getOptions().colors[2]
                    }
                }

            }

            ]
        }],
        responsive: {
            rules: [
                // up to 203
                {
                    condition: {
                        // up tp this
                        maxWidth: 203
                    },
                    chartOptions: {
                        chart: {
                            margin: [15, 5, 5, 5]
                        },
                        title: {
                            text: 'Drag to edit',
                            style: {
                                fontSize: '12px'
                            }
                        },
                        plotOptions: {
                            series: {
                                pointPadding: 0.1
                            }
                        }
                    }
                },
                {
                    condition: {
                        minWidth: 204
                        //
                    },
                    chartOptions: {
                        chart: {
                            margin: [50, 10, 10, 20],
                            height: 260
                        },
                        title: {
                            text: 'Drag bars to edit',
                            style: {
                                fontSize: '14px'
                            },
                            y: 20
                        },
                        plotOptions: {
                            series: {
                                pointPadding: 0.1
                            }
                        }
                    }
                }
            ]
        }
    });

}

const charts = {
    inverted: inverted,
    subtasks: subtasks,
    nav: nav,
    drag: drag
};

charts[chartToShow]();
