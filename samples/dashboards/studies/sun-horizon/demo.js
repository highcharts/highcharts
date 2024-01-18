/* global SunCalc */

const place = 'Klokkarvegen';
const places = {
    hamnen: { lat: 61.2113254, lng: 6.5320583 },
    hytta: { lat: 60.9890245, lng: 6.5316614 },
    klokkarvegen: { lat: 61.0843901, lng: 6.5774637 }
};

// const date = new Date(2023, 5, 23, 20, 12),
const date = new Date(),
    // const date = new Date(2024, 0, 26, 14, 20),
    { lat, lng } = places[place.toLowerCase()];

const getSunXY = date => {
    const position = SunCalc.getPosition(
            date,
            lat,
            lng
        ),
        deg2rad = Math.PI * 2 / 360;

    return {
        x: position.azimuth / deg2rad + 180,
        y: position.altitude / deg2rad
    };
};

const getSunTrajectory = (horizon = [], downsample = false) => {
    // Sun trajectory
    const sunDate = new Date(date.getTime()),
        trajectory = [],
        dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
            timeStyle: 'short',
            timeZone: 'Europe/Oslo'
        });

    sunDate.setHours(0);
    sunDate.setMinutes(0);
    sunDate.setSeconds(0);
    sunDate.setMilliseconds(0);
    for (let minutes = 0; minutes < 24 * 60; minutes++) {
        const { x, y } = getSunXY(sunDate),
            hourFormat = dateTimeFormat.format(sunDate);

        let horizonPoint = { azimuth: 0, angle: 0 };
        for (horizonPoint of horizon) {
            // Find the closest point
            if (horizonPoint.azimuth >= x) {
                break;
            }
        }

        let dataLabels;
        // Sunrise
        if (
            trajectory.length &&
            horizonPoint.angle <= y &&
            trajectory.at(-1).horizonPoint.angle >= trajectory.at(-1).y
        ) {
            dataLabels = {
                align: 'left',
                y: -5,
                rotation: -90,
                enabled: true,
                format: `→ ${hourFormat}`
            };

        // Sunset
        } else if (
            trajectory.length &&
            horizonPoint.angle >= y &&
            trajectory.at(-1).horizonPoint.angle <= trajectory.at(-1).y
        ) {
            dataLabels = {
                align: 'right',
                y: -5,
                rotation: 90,
                enabled: true,
                format: `${hourFormat} →`
            };
        }

        if (
            !downsample ||
            !trajectory.length ||
            x > trajectory.at(-1).x + 5 ||
            x < trajectory.at(-1).x ||
            dataLabels
        ) {
            trajectory.push({
                x,
                y,
                dataLabels,
                horizonPoint,
                custom: {
                    datetime: sunDate.getTime()
                }
            });
        }

        sunDate.setHours(0);
        sunDate.setMinutes(minutes);
    }
    trajectory.sort((a, b) => a.x - b.x);
    return trajectory;
};

const horizon = JSON.parse(document.getElementById('data').innerText);

let currentSunInterval;

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'horizon',
            type: 'JSON',
            options: {
                firstRowAsNames: false,
                data: horizon.elevationProfile
            }
        },
        {
            id: 'times',
            type: 'JSON',
            options: {
                firstRowAsNames: false,
                data: Object.entries(SunCalc.getTimes(date, lat, lng))
                    .map(entry => [entry[0], entry[1].getTime()])
                    .sort((a, b) => a[1] - b[1])
            }
        }
        /*
        , {
            id: 'sun-trajectory',
            data: getSunTrajectory(),
            type: 'JSON'
        }*/
        ]
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'horizon-chart'
                }]
            }, {
                cells: [{
                    id: 'controls',
                    width: '50%',
                    responsive: {
                        small: {
                            width: '100%'
                        }
                    }

                }, {
                    id: 'times',
                    width: '50%',
                    responsive: {
                        small: {
                            width: '100%'
                        }
                    }
                }]
            }]
        }]
    },
    components: [{
        connector: {
            id: 'horizon'
        },
        cell: 'horizon-chart',
        id: 'horizon-chart',
        type: 'Highcharts',
        columnAssignment: {
            azimuth: 'x',
            Horizon: {
                y: 'angle'
            }
        },
        events: {
            mount: function () {
                this.chartOptions.series.push({
                    type: 'line',
                    id: 'sun-trajectory',
                    data: getSunTrajectory(horizon.elevationProfile),
                    name: 'Sun trajectory',
                    color: 'orange',
                    marker: {
                        enabled: false
                    },
                    dataLabels: {
                        color: 'orange',
                        style: {
                            textOutline: 'none'
                        }
                    },
                    tooltip: {
                        headerFormat: '',
                        pointFormat: 'Sun position<br>' +
                            '<b>{point.custom.datetime:%b %e, %Y %H:%M}</b>' +
                            '<br>Angle: {point.y:.2f}°'
                    },
                    zIndex: -2
                }, {
                    type: 'scatter',
                    id: 'sun',
                    name: 'The Sun',
                    data: [{
                        id: 'sun-point',
                        ...getSunXY(date)
                    }],
                    color: 'orange',
                    marker: {
                        symbol: 'circle',
                        raidus: 3,
                        fillColor: 'orange',
                        lineColor: 'black',
                        lineWidth: 1
                    },
                    tooltip: {
                        pointFormat: 'Azimuth: {point.x:.2f}°, angle: {point.y:.2f}°'
                    },
                    zIndex: -1

                // Contour lines
                }, {
                    type: 'scatter',
                    color: 'gray',
                    lineWidth: 1,
                    opacity: 0.75,
                    data: horizon.contours.reduce((data, contourLine) => {
                        if (data.length) {
                            data.push(null); // Gap
                        }
                        [].push.apply(data, contourLine.map(p => [
                            p.azimuth, p.angle
                        ]));
                        return data;
                    }, []),
                    marker: {
                        enabled: false
                    },
                    enableMouseTracking: false
                });
            }
        },
        chartOptions: {
            chart: {
                animation: false,
                zoomType: 'xy',
                scrollablePlotArea: {
                    minWidth: 3000,
                    scrollPositionX: 0.5
                },
                plotBackgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, 'lightblue'],
                        [1, 'white']
                    ]
                },
                events: {
                    load() {
                        // When the inital date is current, keep the Sun up to
                        // date
                        if (Date.now() - date.getTime() < 1000) {
                            currentSunInterval = setInterval(() => {
                                this.get('sun').points[0].update(
                                    getSunXY(new Date())
                                );
                            }, 60000);
                        }
                    },
                    render() {
                        // When the sun is below the chart, show a pointer
                        const { y } = this.get('sun').points[0];
                        if (!this.sunPointer) {
                            this.sunPointer = this.renderer.label()
                                .css({
                                    fontSize: '0.8em'
                                })
                                .add();
                        }
                        if (y < this.yAxis[0].min) {
                            this.sunPointer
                                .attr({
                                    text: `↓ Sun, ${Math.abs(y).toFixed(1)}° ` +
                                        'below horizon',
                                    x: this.get('sun').points[0].plotX,
                                    y: this.yAxis[0].len - 10,
                                    zIndex: 6,
                                    padding: 0,
                                    fill: 'rgba(255, 255, 255, 0.75)'
                                })
                                .show();
                        } else {
                            this.sunPointer.hide();
                        }
                    }
                },
                styledMode: false
            },
            title: {
                text: null
            },
            xAxis: {
                tickInterval: 30,
                minPadding: 0,
                maxPadding: 0
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
                plotLines: [{
                    value: 0,
                    width: 2,
                    color: 'gray',
                    zIndex: 10
                }],
                staticScale: 10,
                max: 30,
                min: -10
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
                    states: {
                        inactive: {
                            enabled: false
                        }
                    },
                    turboThreshold: Infinity
                }
            },
            series: [{
                type: 'area',
                lineColor: 'gray',
                color: '#b4d0a4',
                name: 'Horizon',
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
        elements: [`
        <div class="component-padding">
            <p>
                <label id="date-input-label" for="date-input"></label>
                <input id="date-input" type="range" min="0" max="365" />
            </p>
            <p>
                <label id="time-input-label" for="time-input"></label>
                <input id="time-input" type="range" min="0" max="1440" />
            </p>
        </div>
        `],
        events: {
            // @todo - at the time of the `mount` event, the elements are not
            // yet attached, so I need to use `resize`. What is the preferred
            // way of defining behavior for the HTML content? Missing an
            // `afterMount` event?
            resize() {
                if (this.initialized) {
                    return;
                }

                // Date input
                const dateInput = document.querySelector('#date-input'),
                    updateDateInputLabel = () => {
                        document.getElementById('date-input-label')
                            .innerText = new Intl.DateTimeFormat('nn-NO', {
                                dateStyle: 'medium'
                            }).format(date);
                    },
                    newYear = new Date(date.getTime());
                newYear.setMonth(0);
                newYear.setDate(1);
                newYear.setHours(0);
                newYear.setMinutes(0);
                newYear.setSeconds(0);
                dateInput.addEventListener('input', e => {
                    const chart = this.board.mountedComponents
                        .map(c => c.component)
                        .find(c => c.id === 'horizon-chart')
                        .chart;

                    clearInterval(currentSunInterval);

                    date.setMonth(0);
                    date.setDate(Number(e.target.value));
                    updateDateInputLabel();
                    chart.get('sun-trajectory').setData(
                        // Get downsampled sun trajectory for speed
                        getSunTrajectory(horizon.elevationProfile, true),
                        false,
                        false
                    );
                    chart.get('sun-point').update(getSunXY(date), false);
                    chart.redraw(false);
                });
                dateInput.addEventListener('change', () => {
                    const chart = this.board.mountedComponents
                        .map(c => c.component)
                        .find(c => c.id === 'horizon-chart')
                        .chart;

                    clearInterval(currentSunInterval);

                    // Get the full sun trajectory, not the downsampled one
                    chart.get('sun-trajectory').setData(
                        getSunTrajectory(horizon.elevationProfile),
                        true,
                        false
                    );
                });

                // Workaround for not exposed AST (#20463)
                dateInput.min = 0;
                dateInput.max = 365;

                dateInput.value = Math.floor((date - newYear) / (24 * 36e5));
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
                    clearInterval(currentSunInterval);
                    date.setHours(0);
                    date.setMinutes(Number(e.target.value));
                    updateTimeInputLabel();
                    chart.get('sun-point').update(getSunXY(date), true, false);
                });

                // Workaround for not exposed AST (#20463)
                timeInput.min = 0;
                timeInput.max = 1440;

                timeInput.value = date.getHours() * 60 + date.getMinutes();
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
            editable: false,
            columns: [{
                headerFormat: 'Event',
                cellFormatter: function () {
                    const str = this.value
                        .replace(/([A-Z])/g, ' $1')
                        .toLowerCase();
                    return str.charAt(0).toUpperCase() + str.slice(1);
                }
            },
            {
                headerFormat: 'Time',
                // @todo Fix after #20444
                // cellFormat: '{value:%H:%M}'
                cellFormatter: function () {
                    return Highcharts.dateFormat('%H:%M UTC', this.value);
                }
            }]
        }
    }]
}, true);
