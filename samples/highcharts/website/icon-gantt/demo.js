Math.easeInSine = function (pos) {
    return -Math.cos(pos * (Math.PI / 2)) + 1;
};

Math.easeOutQuint = function (pos) {
    return (Math.pow((pos - 1), 5) + 1);
};
// Math.easeInQuint = function (pos) {
//     return Math.pow(pos, 5);
// },

Math.easeOutBounce = pos => {
    if ((pos) < (1 / 2.75)) {
        return (7.5625 * pos * pos);
    }
    if (pos < (2 / 2.75)) {
        return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
    }
    if (pos < (2.5 / 2.75)) {
        return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
    }
    return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
};

const big = window.matchMedia("(min-width: 500px)").matches;
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let chart;

const ganttChart = function () {
    /*
    Simple demo showing some interactivity options of Highcharts Gantt. More
    custom behavior can be added using event handlers and API calls. See
    http://api.highcharts.com/gantt.
*/

    var today = new Date(),
        day = 1000 * 60 * 60 * 24,
        each = Highcharts.each,
        reduce = Highcharts.reduce,
        btnShowDialog = document.getElementById('btnShowDialog'),
        btnRemoveTask = document.getElementById('btnRemoveSelected'),
        btnAddTask = document.getElementById('btnAddTask'),
        btnCancelAddTask = document.getElementById('btnCancelAddTask'),
        addTaskDialog = document.getElementById('addTaskDialog'),
        inputName = document.getElementById('inputName'),
        selectDepartment = document.getElementById('selectDepartment'),
        selectDependency = document.getElementById('selectDependency'),
        chkMilestone = document.getElementById('chkMilestone'),
        isAddingTask = false;

    // Set to 00:00:00:000 today
    today.setUTCHours(0);
    today.setUTCMinutes(0);
    today.setUTCSeconds(0);
    today.setUTCMilliseconds(0);
    today = today.getTime();

    // Update disabled status of the remove button, depending on whether or not we
    // have any selected points.
    function updateRemoveButtonStatus() {
        var chart = this.series.chart;
        // Run in a timeout to allow the select to update
        setTimeout(function () {
            btnRemoveTask.disabled = !chart.getSelectedPoints().length ||
    isAddingTask;
        }, 10);
    }

    // Create the chart
    chart = Highcharts.ganttChart('gantt', {
        chart: {
            height: 500,
            margin: [120, 10, 20, 10],
            spacing: [30, 0, 0, 10],
            events: {
                load: function () {
                    const chart = this;
                    $('#button-group').addClass('on');
                    $('.highcharts-background').addClass('on');
                    $('.highcharts-scrollable-mask').attr('fill', '#2F2B38');

                    if (!big) {
                        chart.update({
                            chart: {
                                margin: [80, 10, 20, 10],
                                scrollablePlotArea: {
                                    minHeight: 250,
                                    minWidth: 250
                                }
                            }
                        });
                    }

                },
                redraw: function () {

                    $('.highcharts-background').addClass('on');
                    $('.highcharts-scrollable-mask').attr('fill', '#2F2B38');

                }
            },
            styledMode: (true)
        },
        title: {
            text: 'Interactive Gantt Chart',
            floating: true
        },
        subtitle: {
            text: 'Drag and drop points to edit'
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            series: {
                animation: false, // Do not animate dependency connectors
                dragDrop: {
                    draggableX: true,
                    draggableY: true,
                    dragMinY: 0,
                    dragMaxY: 2,
                    dragPrecisionX: day / 3 // Snap to eight hours
                },
                borderRadius: 3,
                dataLabels: {
                    enabled: true,
                    allowOverlap: true,
                    format: '{point.name}',
                    style: {
                        cursor: 'default',
                        pointerEvents: 'none'
                    },
                    y: 15
                },
                connectors: {
                    endMarker: {
                        color: '#fff',
                        lineColor: '#fff'
                    }
                },
                pointPadding: 0.42,
                groupPadding: 0,
                allowPointSelect: true,
                point: {
                    events: {
                        select: updateRemoveButtonStatus,
                        unselect: updateRemoveButtonStatus,
                        remove: updateRemoveButtonStatus
                    }
                }
            }
        },

        yAxis: {
            type: 'category',
            title: {
                text: ''
            },
            categories: ['Tech', 'Marketing', 'Sales'],
            min: 0,
            max: 2,
            plotLines: [

                {
                    value: 0.5
                },
                {
                    value: 1.5
                },
                {
                    value: 2.5
                }],
            visible: true,
            grid: {
                enabled: false
            },
            padding: 0,
            labels: {
                useHTML: true,
                indentation: 0,
                formatter: function () {
                    const name = this.value;
                    if (this.value.length > 1) {
                        const htmlString = `<div class="gantt-label">
                            ${name}</div>`;
                        return htmlString;
                    }
                }
            }
        },
        xAxis: [
            {
                className: 'xAxis',
                minorTicks: true,
                gridLineDashStyle: 'dot',
                currentDateIndicator: true,
                dateTimeLabelFormats: {
                    day: {
                        list: ['%A, %e. %B', '%a, %e. %b', '%E']
                    }
                },
                grid: {
                    cellHeight: 15
                },
                labels: {
                    useHTML: true,
                    padding: 0,
                    formatter: function () {
                        const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
                        const dayDate = new Date(this.value).getDay();
                        const day = days[dayDate];
                        const htmlString = `
                        <div class="day-label">${day}</div>`;
                        return htmlString;
                    }
                }
            },
            {
                grid: {
                    cellHeight: 20
                }
            }
        ],

        tooltip: {
            xDateFormat: '%a %b %d, %H:%M',
            outside: true,
            className: 'tip',
            shadow: false
        },

        series: [{
            name: 'Project 1',
            data: [{
                start: today + 2 * day,
                end: today + day * 5,
                name: 'Prototype',
                id: 'prototype',
                y: 0
            },  {
                start: today + day * 6,
                name: 'Prototype done',
                milestone: true,
                dependency: 'prototype',
                id: 'proto_done',
                y: 0
            }, {
                start: today + day * 7,
                end: today + day * 11,
                name: 'Testing',
                dependency: 'proto_done',
                y: 0
            }, {
                start: today + day * 5,
                end: today + day * 8,
                name: 'Product pages',
                y: 1
            }, {
                start: today + day * 9,
                end: today + day * 10,
                name: 'Newsletter',
                y: 1
            }, {
                start: today + day * 9,
                end: today + day * 11,
                name: 'Licensing',
                id: 'testing',
                y: 2
            }, {
                start: today + day * 11.5,
                end: today + day * 12.5,
                name: 'Publish',
                dependency: 'testing',
                y: 2
            }]
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 250
                },
                chartOptions: {
                    chart: {
                        height: 250,
                        margin: [80, 10, 20, 10]
                    },
                    plotOptions: {
                        series: {
                            dataLabels: {
                                y: 15
                            }
                        }
                    },
                    title: {
                        y: 0
                    },
                    subtitle: {
                        y: 50
                    }
                }
            },
            {
                condition: {
                    minWidth: 499
                },
                chartOptions: {
                    chart: {
                        height: 500,
                        margin: [120, 10, 20, 10]
                    },
                    plotOptions: {
                        series: {
                            dataLabels: {
                                y: 25
                            }
                        }
                    },
                    title: {
                        y: 10
                    },
                    subtitle: {
                        y: 30
                    }
                }
            }]
        }
    });


    /* Add button handlers for add/remove tasks */

    btnRemoveTask.onclick = function () {
        var points = chart.getSelectedPoints();
        each(points, function (point) {
            point.remove();
        });
    };

    btnShowDialog.onclick = function () {
        // Update dependency list
        var depInnerHTML = '<option value=""></option>';
        each(chart.series[0].points, function (point) {
            depInnerHTML += '<option value="' + point.id + '">' + point.name +
        ' </option>';
        });
        selectDependency.innerHTML = depInnerHTML;

        // Show dialog by removing "hidden" class
        //addTaskDialog.className = 'overlay';
        isAddingTask = true;

        // Focus name field
        inputName.value = '';
        inputName.focus();
    };

    btnAddTask.onclick = function () {
        // Get values from dialog
        var series = chart.series[0],
            name = inputName.value,
            undef,
            dependency = chart.get(
                selectDependency.options[selectDependency.selectedIndex].value
            ),
            y = parseInt(
                selectDepartment.options[selectDepartment.selectedIndex].value,
                10
            ),
            maxEnd = reduce(series.points, function (acc, point) {
                return point.y === y && point.end ?
                    Math.max(acc, point.end) : acc;
            }, 0),
            milestone = chkMilestone.checked || undef;

        // Empty category
        if (maxEnd === 0) {
            maxEnd = today;
        }

        // Add the point
        series.addPoint({
            start: maxEnd + (milestone ? day : 0),
            end: milestone ? undef : maxEnd + day,
            y: y,
            name: name,
            dependency: dependency ? dependency.id : undef,
            milestone: milestone
        });
        window.addModal.hide();
        // Hide dialog
        //addTaskDialog.className += ' hidden';
        isAddingTask = false;
    };

    btnCancelAddTask.onclick = function () {
        // Hide dialog
        addTaskDialog.className += ' hidden';
        isAddingTask = false;
    };

};

const imgPath = 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@feb8baf043cffb5e141ab065f95b8ca397569297/samples/graphics/homepage/';


const gantt = {
    chart: {
        // width: 500,
        animation: {
            enabled: true,
            duration: 1000,
            easing: 'easeOutQuint'
        },
        styledMode: (true),
        margin: 0,
        spacing: 0,
        plotBackgroundImage: 'gantt.png',
        events: {
            load: function () {
                const chart = this;
                const pole = chart.series[13];
                const startSeries = 9;
                const endSeries = 12;
                let count = startSeries;
                const rcount = startSeries;

                if (reduced) {
                    for (let ii = rcount; ii <= endSeries; ++ii) {
                        const series = chart.series[ii];
                        const low = series.data[0].low;
                        const x = series.data[0].x;
                        const high = series.data[0].high + 1;
                        series.update({
                            data: [{
                                x: x,
                                low: low,
                                high: high
                            },
                            {
                                x: x + 4,
                                low: low,
                                high: high
                            }
                            ]
                        });
                    }
                    pole.update({
                        data: [
                            { x: 10, low: 6, high: 14 },
                            { x: 11, low: 6, high: 14 }
                        ]
                    });
                    setTimeout(function () {
                        chart.xAxis[1].setExtremes(0, 20);
                    }, 500);
                    setTimeout(function () {
                        $('#gantt .flag').addClass('show');
                    }, 1000);
                    setTimeout(function () {
                        $('#gantt .particle-2').addClass('grow');
                        $('#gantt .particle-3').addClass('grow');
                        $('#gantt .particle-5').addClass('grow');
                        $('#gantt .particle-6').addClass('grow');
                    }, 2000);

                    setTimeout(function () {
                        ganttChart();
                    }, 4000);
                }

                if (!reduced) {
                    const stairs = setInterval(function () {
                        if (count <= endSeries) {
                            const series = chart.series[count];
                            const low = series.data[0].low;
                            const x = series.data[0].x;
                            const high = series.data[0].high + 1;
                            series.update({
                                data: [{
                                    x: x,
                                    low: low,
                                    high: high
                                },
                                {
                                    x: x + 4,
                                    low: low,
                                    high: high
                                }
                                ]
                            });
                            count = count + 1;
                        } else {
                            clearInterval(stairs);
                        }
                    }, 500);
                    setTimeout(function () {
                        chart.update({
                            animation: {
                                duration: 500,
                                easing: 'easeInSine'
                            }
                        });
                        pole.update({
                            data: [
                                { x: 10, low: 6, high: 14 },
                                { x: 11, low: 6, high: 14 }
                            ]
                        });
                    }, 2500);
                    setTimeout(function () {
                        chart.xAxis[1].setExtremes(0, 20);
                    }, 3000);
                    setTimeout(function () {
                        $('#gantt .flag').addClass('show');

                    }, 3300);
                    setTimeout(function () {
                        $('#gantt .particle-2').addClass('grow');
                        $('#gantt .particle-3').addClass('grow');
                        $('#gantt .particle-5').addClass('grow');
                        $('#gantt .particle-6').addClass('grow');
                    }, 3500);

                    setTimeout(function () {
                        $('.green').hide();
                        $('.step-p').hide();
                        $('.step-w').hide();
                        $('.pole').hide();
                        $('.flag').hide();
                        $('.cover').hide();

                        chart.series[8].update({
                            data: [
                                { x: 0, low: 12, high: 18 },
                                { x: 20, low: 12, high: 18 }
                            ]
                        });

                    }, 5000);

                    setTimeout(function () {
                        ganttChart();
                    }, 6500);
                }


            }
        }
    },

    title: {
        text: ''
    },
    credits: {
        enabled: false
    },
    xAxis: [
    //0 -
        {
            min: 0,
            max: 20,
            gridLineColor: 'transparent',
            tickInterval: 1,
            visible: false
        },
        //1 - for flag cover
        {
            min: -280,
            max: 250,
            gridLineColor: 'transparent',
            tickInterval: 1
            // reversed: true
        }],
    yAxis: [{
        min: -2,
        max: 18,
        gridZIndex: 20,
        gridLineColor: 'transparent',
        tickInterval: 1,
        startOnTick: false,
        endOnTick: false
    },
    {
        min: 10,
        max: 16,
        gridZIndex: 20,
        gridLineColor: 'transparent',
        tickInterval: 1,
        startOnTick: false,
        endOnTick: false
    }],
    legend: {
        enabled: false
    },
    tooltip: {
        enabled: false,
        outside: true,
        distance: 100
    },
    plotOptions: {
        series: {
            borderWidth: 0,

            opacity: 1,
            dataLabels: {
                enabled: false
            },
            marker: {
                enabled: false
            },
            states: {
                hover: {
                    enabled: false
                },
                inactive: {
                    enabled: false
                }
            },
            lineColor: 'transparent',
            dragDrop: {
                draggableX: true,
                draggableY: true,
                dragMaxX: 20,
                dragMinX: 0,
                dragMaxY: 18,
                dragMinY: 0
            }
        },
        pie: {
            animation: false
        },
        line: {
            animation: false
        }

    },
    series: [
        //0 - bottom line
        {
            type: 'line',
            className: 'transparent',
            data: [
                { x: 0, y: -1 },
                { x: 20, y: -1 }
            ],
            zIndex: 10

        },
        //1 - line
        {
            type: 'line',
            lineWidth: 1,
            className: 'transparent',
            data: [
                { x: 0, y: 0 },
                { x: 20, y: 0 }
            ],
            zIndex: 10
        },
        //2 - line
        {
            type: 'line',
            lineWidth: 1,
            className: 'transparent',
            data: [
                { x: 0, y: 1 },
                { x: 20, y: 1 }
            ],
            zIndex: 10
        },
        //3 - line
        {
            type: 'line',
            className: 'green',
            lineWidth: 1,
            data: [
                { x: 0, y: 2 },
                { x: 20, y: 2 }
            ],
            zIndex: 10

        },
        //4 - line
        {
            type: 'line',
            className: 'green',
            lineWidth: 1,
            data: [
                { x: 0, y: 3 },
                { x: 20, y: 3 }
            ],
            zIndex: 10

        },
        //5 - line
        {
            type: 'line',
            className: 'green',
            lineWidth: 1,
            data: [
                { x: 0, y: 4 },
                { x: 20, y: 4 }
            ],
            zIndex: 10
        },
        //6 - line
        {
            type: 'line',
            className: 'green',
            lineWidth: 1,
            data: [
                { x: 0, y: 5 },
                { x: 20, y: 5 }
            ],
            zIndex: 10

        },
        //7 - line
        {
            type: 'line',
            className: 'green',
            lineWidth: 1,
            data: [
                { x: 0, y: 6 },
                { x: 20, y: 6 }
            ],
            zIndex: 10
        },
        // 8 area - foreground-water
        {
            type: 'arearange',
            name: 'foreground',
            className: 'foreground',
            animation: false,
            data: [{ x: 0, low: -2, high: 6 }, { x: 20, low: -2, high: 6 }],
            zIndex: 4,
            visible: true
        },
        // 9 - step1
        {
            type: 'arearange',
            name: 'step1',
            animation: false,
            className: 'step-w',
            data: [
                { x: 4, low: 2, high: 2 },
                { x: 8, low: 2, high: 2 }

            ],
            zIndex: 15,
            visible: true
        },
        //10 - step 2
        {
            type: 'arearange',
            name: 'step2',
            animation: false,
            className: 'step-p',
            data: [
                { x: 5, low: 3, high: 3 },
                { x: 9, low: 3, high: 3 }

            ],
            zIndex: 15,
            visible: true
        },
        //11 - step 3
        {
            type: 'arearange',
            name: 'step3',
            animation: false,
            className: 'step-w',
            data: [
                { x: 6, low: 4, high: 4 },
                { x: 10, low: 4, high: 4 }

            ],
            zIndex: 15,
            visible: true
        },
        //12 - step 4
        {
            type: 'arearange',
            name: 'step4',
            animation: false,
            className: 'step-p',
            data: [
                { x: 7, low: 5, high: 5 },
                { x: 11, low: 5, high: 5 }

            ],
            zIndex: 15,
            visible: true
        },
        //13 - pole
        {
            type: 'arearange',
            name: 'pole',
            animation: false,
            className: 'pole',
            data: [
                { x: 10, low: 6, high: 6 },
                { x: 11, low: 6, high: 6 }

            ],
            zIndex: 5,
            visible: true
        },
        //14 - flag
        {
            type: 'arearange',
            name: 'flag',
            animation: false,
            className: 'flag',
            data: [
                { x: 11, low: 10, high: 14 },
                { x: 16, low: 10, high: 14 }

            ],
            zIndex: 5,
            visible: true,
            xAxis: 1
        },
        //15 - flag cover
        {
            type: 'arearange',
            name: 'flag-cover',
            animation: false,
            className: 'cover',
            data: [
                { x: 15, low: 12, high: 12 },
                { x: 16, low: 12, high: 12 },
                { x: 16, low: 10, high: 14 }
            ],
            // marker:{
            //   enabled:true
            // },
            zIndex: 5,
            visible: true,
            xAxis: 1
        },
        //16 - particle 2
        {
            type: 'scatter',
            name: 'particle-2',
            animation: false,
            className: 'particle-2',
            data: [
                {
                    x: 8.88,
                    y: 10.44,
                    marker: {
                        enabled: true,
                        symbol: 'url(' + imgPath + 'p2.svg)',
                        width: 22,
                        height: 41

                    }
                }
            ],
            zIndex: 30,
            visible: true
        },
        // 11 - particle 3
        {
            type: 'scatter',
            name: 'particle-3',
            animation: false,
            className: 'particle-3',
            data: [
                {
                    x: 10.48,
                    y: 15.35,
                    marker: {
                        enabled: true,
                        symbol: 'url(' + imgPath + 'p3.svg)',
                        width: 23,
                        height: 34

                    }
                }
            ],
            zIndex: 30,
            visible: true
        },

        // 13 - particle 5

        {
            type: 'scatter',
            name: 'particle-5',
            animation: false,
            className: 'particle-5',
            data: [
                {
                    x: 8.42,
                    y: 15.05,
                    marker: {
                        enabled: true,
                        symbol: 'url(' + imgPath + 'p5.svg)',
                        width: 35,
                        height: 50

                    }
                }
            ],
            zIndex: 30,
            visible: true
        },
        // 14 - particle 6
        {
            type: 'scatter',
            name: 'particle-6',
            animation: false,
            className: 'particle-6',
            data: [
                {
                    x: 8,
                    y: 12.4,
                    marker: {
                        enabled: true,
                        symbol: 'url(' + imgPath + 'p6.svg)',
                        width: 45,
                        height: 45

                    }
                }
            ],
            zIndex: 30,
            visible: true
        }
    ]
};


Highcharts.chart('gantt', gantt);
//ganttChart();
