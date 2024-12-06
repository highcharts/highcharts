/* global SunCalc */
const skyColor = '#40a0ff';

let date = new Date(),
    horizon,
    lat,
    lng,
    board;

const getCelestialBodyXY = (celestialBody, date, moonIllumination) => {
    const positionFunction = {
            sun: 'getPosition',
            moon: 'getMoonPosition'
        }[celestialBody],
        position = SunCalc[positionFunction](
            date,
            lat,
            lng
        ),
        deg2rad = Math.PI * 2 / 360;

    return {
        x: position.azimuth / deg2rad + 180,
        y: position.altitude / deg2rad,
        custom: moonIllumination && SunCalc.getMoonIllumination(date)
    };
};

const getTrajectory = (
    celestialBody = 'sun',
    horizon = [],
    downsample = false
) => {
    // Sun trajectory
    const tDate = new Date(date.getTime()),
        trajectory = [],
        dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
            timeStyle: 'short',
            timeZone: 'Europe/Oslo'
        });

    tDate.setHours(0);
    tDate.setMinutes(0);
    tDate.setSeconds(0);
    tDate.setMilliseconds(0);

    let x, y;
    for (let minutes = 0; minutes < 24 * 60; minutes++) {
        const hourFormat = dateTimeFormat.format(tDate),
            xy = getCelestialBodyXY(celestialBody, tDate);

        x = xy.x;
        y = xy.y;

        let horizonPoint = { azimuth: 0, angle: 0 };
        for (horizonPoint of horizon) {
            // Find the closest point
            if (horizonPoint.azimuth >= x) {
                break;
            }
        }

        let flag;
        // Sunrise above horizon
        if (
            trajectory.length &&
            horizonPoint.angle <= y &&
            trajectory.at(-1).horizonPoint.angle >= trajectory.at(-1).y
        ) {
            flag = `↑ ${hourFormat}`;

        // Sunset below horizon
        } else if (
            trajectory.length &&
            horizonPoint.angle >= y &&
            trajectory.at(-1).horizonPoint.angle <= trajectory.at(-1).y
        ) {
            flag = `↓ ${hourFormat}`;
        }

        if (
            !downsample ||
            !trajectory.length ||
            x > trajectory.at(-1).x + 5 ||
            x < trajectory.at(-1).x ||
            flag
        ) {
            trajectory.push({
                x,
                y,
                flag,
                horizonPoint,
                custom: {
                    datetime: tDate.getTime()
                }
            });
        }

        tDate.setHours(0);
        tDate.setMinutes(minutes);
    }

    // Push a null point to represent a gap for midnight, especially for the
    // moon
    trajectory.push({ x: x + 0.01, y: null });

    trajectory.sort((a, b) => a.x - b.x);
    return trajectory;
};

// Get the times of sun and moon events
const getTimes = d => {
    const times = Object.entries(SunCalc.getTimes(d, lat, lng))
        .map(entry => [entry[0], entry[1].getTime()]);

    const moonTimes = Object.entries(SunCalc.getMoonTimes(d, lat, lng))
        .map(entry => [`moon ${entry[0]}`, entry[1].getTime()]);

    return [
        ...times,
        ...moonTimes
    ].sort((a, b) => a[1] - b[1]);
};

// Set the chart colors to reflect day, night and twilight
const colorize = (chart, angle) => {
    angle = angle ?? chart.get('sun-point')?.y;

    if (typeof angle === 'number') {
        const relativeBrightness = Math.min(0, angle / 7);

        chart.series[0]?.update({
            color: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [
                        0, Highcharts.color('#89c269')
                            .brighten(relativeBrightness + 0.2).get()
                    ],
                    [
                        1, Highcharts.color('#89c269')
                            .brighten(relativeBrightness - 0.2).get()
                    ]
                ]
            }
        }, false);
        chart.update({
            chart: {
                plotBackgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [
                            0,
                            Highcharts.color(skyColor)
                                .brighten(relativeBrightness).get()
                        ],
                        [
                            1,
                            Highcharts.color(skyColor)
                                .brighten(relativeBrightness + 1).get()
                        ]
                    ]
                }
            }
        }, false);
    }
};

// When the sun is below or above the chart, show a label pointing down or up
const offscreenLabel = (chart, celestialBody) => {
    const point = chart.get(`${celestialBody}-point`),
        yValue = point?.y,
        x = point?.plotX,
        key = `${celestialBody}Label`,
        name = celestialBody.charAt(0).toUpperCase() + celestialBody.slice(1);

    let label = chart[key];

    if (!label) {
        label = chart.renderer.label()
            .attr({
                zIndex: 6,
                padding: 1,
                fill: 'rgba(255, 255, 255, 0.75)',
                r: 3
            })
            .css({
                fontSize: '0.8em'
            })
            .add();
    }
    if (yValue < chart.yAxis[0].min) {
        label
            .attr({
                text: `↓ ${name}, ${Math.abs(yValue).toFixed(1)}° ` +
                    'below horizon',
                x,
                y: chart.yAxis[0].len - 15
            })
            .show();
    } else if (yValue > chart.yAxis[0].max) {
        label
            .attr({
                text: `↑ ${name}, ${Math.abs(yValue).toFixed(1)}° ` +
                    'above horizon',
                x,
                y: 0
            })
            .show();
    } else {
        label.hide();
    }
    chart[key] = label;
};

// Display the moon phase
const moonPhase = chart => {
    const { fraction, phase } = SunCalc.getMoonIllumination(date),
        { parallacticAngle } = SunCalc.getMoonPosition(date, lat, lng),
        renderer = chart.renderer,
        radius = 25,
        deg2rad = Math.PI * 2 / 360,
        rotation = parallacticAngle / deg2rad;

    // The following code is borrowed from
    // https://github.com/tingletech/moon-phase
    // Copyright © 2012, Regents of the University of California All rights
    // reserved.
    let sweep = [],
        mag;
    if (phase <= 0.25) {
        sweep = [1, 0];
        mag = 20 - 20 * phase * 4;
    } else if (phase <= 0.50) {
        sweep = [0, 0];
        mag = 20 * (phase - 0.25) * 4;
    } else if (phase <= 0.75) {
        sweep = [1, 1];
        mag = 20 - 20 * (phase - 0.50) * 4;
    } else if (phase <= 1) {
        sweep = [0, 1];
        mag = 20 * (phase - 0.75) * 4;
    } else {
        return;
    }

    if (!chart.moon) {
        chart.moon = renderer.g().add();
        chart.moon.frame = renderer.rect().attr({
            fill: '#ffffff20',
            r: 3,
            stroke: '#ffffff80',
            'stroke-width': 1
        }).add(chart.moon);
        chart.moon.shadow = renderer.circle()
            .attr({
                fill: '#eeeeee44'
            })
            .translate(10, 25)
            .add(chart.moon);
        chart.moon.light = renderer.path()
            .attr({
                fill: '#eeeeee',
                rotationOriginX: radius,
                rotationOriginY: radius
            })
            .translate(10, 25)
            .add(chart.moon);
        chart.moon.header = renderer.text('Moon phase')
            .css({
                textTransform: 'uppercase',
                fontSize: '8px'
            })
            .attr({
                'text-anchor': 'middle',
                x: radius + 10,
                y: 20
            })
            .add(chart.moon);
        chart.moon.label = renderer.text()
            .attr({
                'alignment-baseline': 'middle',
                'text-anchor': 'middle',
                x: radius + 10,
                y: radius + 25
            })
            .add(chart.moon);
    }

    const box = chart.scrollablePlotArea?.fixedRenderer?.box;
    if (box && chart.moon.element.parentElement !== box) {
        box.appendChild(chart.moon.element);
    }

    chart.moon.attr({
        translateX: chart.plotWidth - 2 * radius -
            (chart.scrollablePixelsX || 0) - 15,
        translateY: -5
    });
    chart.moon.frame.attr({
        width: 2 * radius + 20,
        height: 2 * radius + 35
    });
    chart.moon.shadow.attr({
        cx: radius,
        cy: radius,
        r: radius
    });
    chart.moon.light.attr({
        d: [
            ['m', radius, 0],
            ['a', mag, 20, 0, 1, sweep[0], 0, 2 * radius],
            ['a', 20, 20, 0, 1, sweep[1], 0, -2 * radius]
        ],
        rotation
    });
    chart.moon.label.attr({
        text: Math.round(fraction * 100) + '%'
    });

};


const getSliderValue = (input, date) => {
    if (input.id === 'date-input') {
        const newYear = new Date(date.getTime());
        newYear.setMonth(0);
        newYear.setDate(1);
        newYear.setHours(0);
        newYear.setMinutes(0);
        newYear.setSeconds(0);

        return Math.floor((date - newYear) / (24 * 36e5));
    }
    if (input.id === 'time-input') {
        return date.getHours() * 60 + date.getMinutes();
    }
};

// When the inital date is current, keep the Sun up to date
let ticker,
    nowButton;
const startTicker = () => {
    const tick = () => {
        date = new Date();
        const chart = board.mountedComponents
            .map(c => c.component)
            .find(c => c.id === 'horizon-chart')
            .chart;
        nowButton.classList.add('active');
        chart.get('sun-series').points[0]?.update(
            getCelestialBodyXY('sun', date)
        );

        const dateInput = document.getElementById('date-input');
        if (dateInput) {
            dateInput.value = getSliderValue(dateInput, date);
            dateInput.dispatchEvent(new CustomEvent(
                'input', { detail: { keepGoing: true } }
            ));
        }

        const timeInput = document.getElementById('time-input');
        if (timeInput) {
            timeInput.value = getSliderValue(timeInput, date);
            timeInput.dispatchEvent(new CustomEvent(
                'input', { detail: { keepGoing: true } }
            ));
        }
    };
    tick();
    ticker = setInterval(tick, 60000);
};
const stopTicker = () => {
    clearInterval(ticker);
    nowButton.classList.remove('active');
};

Highcharts.setOptions({
    time: {
        timezone: 'Europe/Oslo'
    }
});

const createBoard = async () => {
    board = await Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: 'horizon',
                type: 'JSON',
                options: {
                    firstRowAsNames: false,
                    data: horizon.elevationProfile
                }
            }, {
                id: 'sun-trajectory-data',
                type: 'JSON',
                options: {
                    firstRowAsNames: false,
                    data: getTrajectory('sun', horizon.elevationProfile)
                }
            }, {
                id: 'moon-trajectory-data',
                type: 'JSON',
                options: {
                    firstRowAsNames: false,
                    data: getTrajectory('moon', horizon.elevationProfile)
                }
            }, {
                id: 'contours-data',
                type: 'JSON',
                options: {
                    firstRowAsNames: false,
                    data: horizon.contours?.reduce((data, contourLine) => {
                        if (data.length) {
                            data.push([null, null]); // Gap
                        }
                        [].push.apply(data, contourLine.map(p => [
                            p.azimuth, p.angle
                        ]));
                        return data;
                    }, [])
                }
            }, {
                id: 'times',
                type: 'JSON',
                options: {
                    firstRowAsNames: false,
                    data: getTimes(date)
                }
            }]
        },
        gui: {
            layouts: [{
                rows: [{
                    cells: [{
                        id: 'horizon-chart'
                    }, {
                        id: 'controls'
                    }, {
                        id: 'times'
                    }, {
                        id: 'horizon-map'
                    }]
                }]
            }]
        },
        components: [{
            connector: {
                id: 'horizon',
                columnAssignment: [{
                    seriesId: 'land',
                    data: ['azimuth', 'angle']
                }]
            },
            cell: 'horizon-chart',
            id: 'horizon-chart',
            type: 'Highcharts',
            events: {
                mount: async function () {

                    // @todo Is it possible to apply multiple connectors to one
                    // chart through config?
                    const dataPool = this.board.dataPool,
                        sunTrajectoryTable = await dataPool.getConnectorTable(
                            'sun-trajectory-data'
                        ),
                        sunData = sunTrajectoryTable.getRowObjects(),
                        sunFlags = sunData.filter(p => p.flag)
                            .map(p => ({
                                x: p.x,
                                title: p.flag
                            })),
                        moonTrajectoryTable = await dataPool.getConnectorTable(
                            'moon-trajectory-data'
                        ),
                        moonData = moonTrajectoryTable.getRowObjects(),
                        moonFlags = moonData.filter(p => p.flag)
                            .map(p => ({
                                x: p.x,
                                title: p.flag
                            })),
                        contoursTable = await dataPool.getConnectorTable(
                            'contours-data'
                        );

                    this.chart.get('sun-trajectory').setData(sunData, false);

                    this.chart.get('sun-flags').setData(sunFlags, false);

                    this.chart.get('sun-series').setData([{
                        id: 'sun-point',
                        ...getCelestialBodyXY('sun', date)
                    }], false);

                    this.chart.get('moon-trajectory').setData(moonData, false);

                    this.chart.get('moon-flags').setData(moonFlags, false);

                    this.chart.get('moon-series').setData([{
                        id: 'moon-point',
                        ...getCelestialBodyXY('moon', date, true)
                    }], false);

                    this.chart.get('contours').setData(
                        contoursTable.getRows(),
                        false
                    );
                    this.chart.redraw();
                }
            },
            chartOptions: {
                chart: {
                    animation: false,
                    scrollablePlotArea: {
                        minWidth: 3000,
                        scrollPositionX: date.getHours() / 23
                    },
                    margin: [0, 0, 0, 0],
                    events: {
                        render() {
                            colorize(this);

                            offscreenLabel(this, 'sun');
                            offscreenLabel(this, 'moon');

                            moonPhase(this);
                        }
                    },
                    styledMode: false
                },
                credits: {
                    position: {
                        y: -20
                    }
                },
                title: {
                    text: null
                },
                xAxis: {
                    tickInterval: 45,
                    minPadding: 0,
                    maxPadding: 0,
                    labels: {
                        format: `
                        {#eq value 0}N{/eq}
                        {#eq value 45}NE{/eq}
                        {#eq value 90}E{/eq}
                        {#eq value 135}SE{/eq}
                        {#eq value 180}S{/eq}
                        {#eq value 225}SW{/eq}
                        {#eq value 270}W{/eq}
                        {#eq value 315}NW{/eq}
                        `,
                        distance: -110,
                        style: {
                            color: '#cccccc'
                        }
                    }
                },
                yAxis: {
                    labels: {
                        enabled: false
                    },
                    title: {
                        enabled: false
                    },
                    gridLineWidth: 0,
                    tickPixelInterval: 30,
                    endOnTick: false,
                    startOnTick: false,
                    plotBands: [{
                        from: -12,
                        to: -6,
                        label: {
                            text: 'Nautical twilight',
                            align: 'center',
                            style: {
                                color: '#cccccc',
                                fontWeight: 'bold'
                            }
                        },
                        color: Highcharts.color(skyColor).brighten(-0.6).get()
                    }, {
                        from: -6,
                        to: -0,
                        label: {
                            text: 'Civil twilight',
                            align: 'center',
                            verticalAlign: 'bottom',
                            y: -10,
                            style: {
                                color: '#cccccc',
                                fontWeight: 'bold'
                            }
                        },
                        color: Highcharts.color(skyColor).brighten(-0.3).get()
                    }],
                    plotLines: [{
                        value: 0,
                        width: 2,
                        color: 'gray',
                        zIndex: 10
                    }],
                    staticScale: 10,
                    max: 30,
                    min: -12
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    valueDecimals: 2,
                    valueSuffix: '°'
                },
                plotOptions: {
                    series: {
                        animation: false,
                        states: {
                            inactive: {
                                enabled: false
                            }
                        }
                    },
                    flags: {
                        borderRadius: 3,
                        shape: 'squarepin',
                        opacity: 0.75,
                        lineWidth: 2,
                        y: -50
                    }
                },
                series: [{
                    type: 'area',
                    id: 'land',
                    lineColor: 'gray',
                    color: '#b4d0a4',
                    name: 'Horizon',
                    marker: {
                        enabled: false
                    },
                    enableMouseTracking: false
                }, {
                    type: 'line',
                    id: 'sun-trajectory',
                    name: 'Sun trajectory',
                    color: 'orange',
                    marker: {
                        enabled: false
                    },
                    dataLabels: {
                        color: '#ffde85',
                        style: {
                            textOutline: '3px #00000030',
                            fontSize: '0.9rem'
                        },
                        y: -5
                    },
                    /*
                    tooltip: {
                        headerFormat: '',
                        pointFormat: 'Sun position<br>' +
                            '<b>{point.custom.datetime:%b %e, %Y %H:%M}</b>' +
                            '<br>Angle: {point.y:.2f}°'
                    },
                    */
                    zIndex: -2,
                    enableMouseTracking: false
                }, {
                    type: 'flags',
                    id: 'sun-flags',
                    name: 'Sun flags',
                    onSeries: 'sun-trajectory',
                    color: '#FFFFD0',
                    fillColor: '#FFFFD0',
                    zIndex: -1
                }, {
                    type: 'scatter',
                    id: 'sun-series',
                    name: 'The Sun',
                    point: {
                        events: {
                            update(e) {
                                colorize(this.series.chart, e.options.y);
                            }
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        align: 'left',
                        verticalAlign: 'middle',
                        format: 'Sun',
                        style: {
                            color: '#ffde85',
                            textOutline: 'none',
                            fontWeight: 'normal'
                        },
                        x: 10,
                        y: -1
                    },
                    color: 'orange',
                    marker: {
                        symbol: 'circle',
                        raidus: 3,
                        fillColor: 'orange',
                        lineColor: 'black',
                        lineWidth: 1
                    },
                    tooltip: {
                        pointFormat:
                            'Azimuth: {point.x:.2f}°, angle: {point.y:.2f}°'
                    },
                    zIndex: -1
                }, {
                    type: 'line',
                    id: 'moon-trajectory',
                    name: 'Moon trajectory',
                    color: 'lightblue',
                    marker: {
                        enabled: false
                    },
                    dataLabels: {
                        color: 'lightblue',
                        style: {
                            textOutline: 'none',
                            fontSize: '0.9rem'
                        },
                        y: -5
                    },
                    /*
                    tooltip: {
                        headerFormat: '',
                        pointFormat: 'Moon position<br>' +
                            '<b>{point.custom.datetime:%b %e, %Y %H:%M}</b>' +
                            '<br>Angle: {point.y:.2f}°'
                    },
                    */
                    enableMouseTracking: false,
                    zIndex: -2
                }, {
                    type: 'flags',
                    id: 'moon-flags',
                    name: 'Moon flags',
                    onSeries: 'moon-trajectory',
                    color: '#D0FFFF',
                    fillColor: '#D0FFFF',
                    zIndex: -2
                }, {
                    type: 'scatter',
                    id: 'moon-series',
                    name: 'The Moon',
                    color: 'lightblue',
                    marker: {
                        symbol: 'circle',
                        raidus: 3,
                        fillColor: 'lightblue',
                        lineColor: 'black',
                        lineWidth: 1
                    },
                    tooltip: {
                        pointFormat: `
                            {(multiply point.custom.fraction 100):.0f}%
                            illuminated<br>
                            Azimuth: {point.x:.1f}°, angle: {point.y:.1f}°
                        `
                    },
                    zIndex: -1,

                    dataLabels: {
                        enabled: true,
                        align: 'left',
                        verticalAlign: 'middle',
                        format: 'Moon',
                        style: {
                            color: 'lightblue',
                            textOutline: 'none',
                            fontWeight: 'normal'
                        },
                        x: 10,
                        y: -1
                    }
                }, {
                    type: 'scatter',
                    id: 'contours',
                    color: 'gray',
                    lineWidth: 1,
                    opacity: 0.75,
                    marker: {
                        enabled: false
                    },
                    enableMouseTracking: false
                }]
            }
        }, {
            cell: 'controls',
            type: 'HTML',
            style: {
                padding: '10px'
            },
            title: 'Time control',
            html: `
            <div class="component-padding">
                <p>
                    <label id="date-input-label" for="date-input"></label>
                    <input id="date-input" type="range" min="0" max="365" />
                </p>
                <p>
                    <label id="time-input-label" for="time-input"></label>
                    <input id="time-input" type="range" min="0" max="1440" />
                </p>
                <p>
                    <button class="btn btn-secondary" id="now">
                        Now
                    </button>
                </p>
            </div>
            `,
            events: {
                // @todo - at the time of the `mount` event, the elements are
                // not yet attached, so I need to use `resize`. What is the
                // preferred way of defining behavior for the HTML content?
                // Missing an `afterMount` event?
                resize() {
                    if (this.initialized) {
                        return;
                    }

                    let currentDate = '';

                    // Date input
                    const dateInput = document.querySelector('#date-input'),
                        dateInputLabel = document.getElementById(
                            'date-input-label'
                        ),
                        updateDateInputLabel = () => {
                            dateInputLabel.innerText = new Intl.DateTimeFormat(
                                'nn-NO',
                                {
                                    dateStyle: 'medium'
                                }
                            ).format(date);
                            currentDate = date.toDateString();
                        };

                    // While dragging slider
                    const onInput = async e => {
                        const chart = this.board.mountedComponents
                            .map(c => c.component)
                            .find(c => c.id === 'horizon-chart')
                            .chart;

                        if (!e.detail?.keepGoing) {
                            stopTicker();
                        }

                        date.setMonth(0);
                        date.setDate(Number(e.target.value) + 1);
                        updateDateInputLabel();

                        const sunTrajectoryData = getTrajectory(
                                'sun',
                                horizon.elevationProfile,
                                e.type === 'input'
                            ),
                            sunFlags = sunTrajectoryData.filter(p => p.flag)
                                .map(p => ({
                                    x: p.x,
                                    title: p.flag
                                })),
                            moonTrajectoryData = getTrajectory(
                                'moon',
                                horizon.elevationProfile,
                                e.type === 'input'
                            ),
                            moonFlags = moonTrajectoryData.filter(p => p.flag)
                                .map(p => ({
                                    x: p.x,
                                    title: p.flag
                                }));

                        // @todo - this is not working because the chart is not
                        // really connected to the table, it is just
                        // programmatically connected in the mount event.
                        /*
                        const sunTrajectory = await this.board.dataPool
                            .getConnectorTable('sun-trajectory-data');
                        sunTrajectory.setRows(sunTrajectoryData, 0);
                        */
                        chart.get('sun-trajectory').setData(
                            sunTrajectoryData,
                            false
                        );
                        chart.get('sun-flags').setData(
                            sunFlags,
                            false
                        );
                        chart.get('sun-point').update(
                            getCelestialBodyXY('sun', date),
                            false
                        );
                        chart.get('moon-trajectory').setData(
                            moonTrajectoryData,
                            false
                        );
                        chart.get('moon-flags').setData(
                            moonFlags,
                            false
                        );
                        chart.get('moon-point').update(
                            getCelestialBodyXY('moon', date, true),
                            false
                        );
                        chart.redraw(false);

                        // Update the grid
                        const dataTable = this.board.dataPool
                            .connectors
                            .times
                            .table;
                        const rows = getTimes(date);
                        dataTable.setRows(rows, 0);
                    };

                    dateInput.addEventListener('input', onInput);
                    dateInput.addEventListener('change', onInput);

                    // Workaround for not exposed AST (#20463)
                    dateInput.min = 0;
                    dateInput.max = 365;

                    dateInput.value = getSliderValue(dateInput, date);
                    updateDateInputLabel();


                    // Time input
                    const timeInput = document.getElementById('time-input'),
                        updateTimeInputLabel = () => {
                            document.getElementById('time-input-label')
                                .innerText = new Intl.DateTimeFormat('nn-NO', {
                                    timeStyle: 'short'
                                }).format(date);
                        };
                    timeInput.addEventListener('input', e => {
                        const chart = this.board.mountedComponents
                            .map(c => c.component)
                            .find(c => c.id === 'horizon-chart')
                            .chart;
                        if (!e.detail?.keepGoing) {
                            stopTicker();
                        }
                        date.setTime(
                            Date.parse(currentDate)
                        );
                        date.setMinutes(0);

                        // Minutes since midnight, hours are still 0
                        date.setMinutes(Number(e.target.value));

                        updateTimeInputLabel();
                        chart.get('sun-point').update(
                            getCelestialBodyXY('sun', date),
                            true,
                            false
                        );
                        chart.get('moon-point').update(
                            getCelestialBodyXY('moon', date, true),
                            true,
                            false
                        );
                    });

                    // Workaround for not exposed AST (#20463)
                    timeInput.min = 0;
                    timeInput.max = 1440;

                    timeInput.value = getSliderValue(timeInput, date);
                    updateTimeInputLabel();


                    this.initialized = true;
                }
            }

        }, {
            cell: 'times',
            connector: {
                id: 'times'
            },
            type: 'DataGrid',
            dataGridOptions: {
                credits: {
                    enabled: false
                },
                columns: [{
                    id: '0',
                    header: {
                        format: 'Celestial event'
                    },
                    cells: {
                        formatter: function () {
                            const str = this.value
                                .replace(/([A-Z])/g, ' $1')
                                .toLowerCase();
                            return str.charAt(0).toUpperCase() + str.slice(1);
                        }
                    }
                }, {
                    id: '1',
                    header: {
                        format: 'Time'
                    },
                    // @todo Fix after #20444
                    // cellFormat: '{value:%H:%M}'
                    cells: {
                        formatter: function () {
                            try {
                                return new Intl.DateTimeFormat('nn-NO', {
                                    timeStyle: 'short'
                                }).format(this.value);
                            } catch {
                                return '-';
                            }
                        }
                    }
                }]
            }
        }, {
            cell: 'horizon-map',
            id: 'horizon-map',
            type: 'Highcharts',
            chartConstructor: 'mapChart',
            title: 'Horizon outline',
            chartOptions: {
                chart: {
                    styledMode: false,
                    height: '100%',
                    margin: 1
                },
                title: {
                    text: null
                },

                legend: {
                    backgroundColor: 'rgba(255, 255, 255, 0.75)',
                    align: 'left',
                    verticalAlign: 'bottom'
                },

                mapNavigation: {
                    enabled: true,
                    buttonOptions: {
                        alignTo: 'spacingBox'
                    }
                },

                mapView: {
                    padding: 20
                },

                series: [{
                    type: 'tiledwebmap',
                    name: 'TWM Tiles',
                    provider: {
                        type: 'OpenStreetMap',
                        theme: 'Standard'
                    }
                }, {
                    type: 'mapline',
                    name: 'Horizon',
                    // @todo - How can I use the data table with this data
                    // format? Transformation rules? Event handlers?
                    data: [{
                        geometry: {
                            type: 'Polygon',
                            coordinates: [
                                horizon.elevationProfile.map(p =>
                                    [p.latLng.lng, p.latLng.lat]
                                )
                            ]
                        }
                    }],
                    lineWidth: 2
                }, {
                    type: 'mappoint',
                    name: 'POI',
                    data: [{
                        lon: horizon.origin.lng,
                        lat: horizon.origin.lat,
                        marker: {
                            symbol: 'mapmarker',
                            radius: 10,
                            fillColor: '#2caffe',
                            lineColor: '#ffffff',
                            lineWidth: 2
                        }
                    }],
                    color: 'black'
                }]
            }
        }]
    }, true);

    // After the board is created
    nowButton = document.getElementById('now');
    nowButton.addEventListener('click', () => {
        if (!nowButton.classList.contains('active')) {
            startTicker();
        }
    });

    // If the date is current, start the ticker
    if (Date.now() - date.getTime() < 1000) {
        startTicker();
    }
};


const applyHorizon = horizonParam => {
    const json = document.getElementById('data')?.innerText;
    horizon = horizonParam || (json && JSON.parse(json));

    lat = horizon?.origin.lat;
    lng = horizon?.origin.lng;

    if (horizon) {
        createBoard();
    }
};

applyHorizon();
