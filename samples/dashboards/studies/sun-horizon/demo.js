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

        let horizonPoint = { x: 0, y: 0 };
        for (horizonPoint of horizon) {
            // Find the closest point
            if (horizonPoint.x >= x) {
                break;
            }
        }

        let dataLabels;
        // Sunrise
        if (
            trajectory.length &&
            horizonPoint.y <= y &&
            trajectory.at(-1).horizonPoint.y >= trajectory.at(-1).y
        ) {
            dataLabels = {
                align: 'left',
                enabled: true,
                format: hourFormat
            };

        // Sunset
        } else if (
            trajectory.length &&
            horizonPoint.y >= y &&
            trajectory.at(-1).horizonPoint.y <= trajectory.at(-1).y
        ) {
            dataLabels = {
                align: 'right',
                enabled: true,
                format: hourFormat
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

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'horizon',
            type: 'JSON',
            options: {
                firstRowAsNames: false,
                data: JSON.parse(document.getElementById('data').innerText)
                    .elevationProfile
            }
        }/*
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
            }]
        }]
    },
    components: [{
        connector: {
            id: 'horizon'
        },
        cell: 'horizon-chart',
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
                    data: getSunTrajectory(),
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
                        pointFormat: '<b>{point.custom.datetime:%b %e, %Y %H:%M}</b><br>{point.y:.2f}°'
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
                });
            }
        },
        chartOptions: {
            chart: {
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
                floor: -10,
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
                staticScale: 10
                // ...yExtremes
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
                }
            }]
        }
    }]
}, true);
