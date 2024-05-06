// TBD: a scalable approach, calculate on parsing.GPX data
const kmPoints = [
    { KM: 1, Pace: '7:36', Elev: 5, HR: 84 },
    { KM: 2, Pace: '6:04', Elev: -6, HR: 115 },
    { KM: 3, Pace: '6:01', Elev: 0, HR: 128 },
    { KM: 4, Pace: '6:58', Elev: 51, HR: 130 },
    { KM: 5, Pace: '7:12', Elev: 41, HR: 131 },
    { KM: 6, Pace: '6:11', Elev: 10, HR: 125 },
    { KM: 7, Pace: '8:08', Elev: 70, HR: 132 },
    { KM: 8, Pace: '9:35', Elev: 103, HR: 147 },
    { KM: 9, Pace: '9:04', Elev: 125, HR: 162 },
    { KM: 10, Pace: '9:13', Elev: 128, HR: 163 },
    { KM: 11, Pace: '6:41', Elev: -7, HR: 167 },
    { KM: 12, Pace: '6:15', Elev: -102, HR: 158 },
    { KM: 13, Pace: '6:59', Elev: -43, HR: 137 },
    { KM: 14, Pace: '6:08', Elev: -64, HR: 130 },
    { KM: 15, Pace: '7:02', Elev: -60, HR: 137 },
    { KM: 16, Pace: '8:02', Elev: -110, HR: 124 },
    { KM: 17, Pace: '9:42', Elev: -141, HR: 129 },
    { KM: 17.72, Pace: '5:07', Elev: 8, HR: 136 }
];

// Summary data: one point per kilometer, used in DataGrid only
const summaryData = [
    ['KM', 'Pace', 'Elev', 'HR'],
    ...kmPoints.map(split => [
        // TBD: format conflicts with DataGrid options
        split.KM,
        split.Pace + ' km/h',
        split.Elev + ' m',
        split.HR + ' bpm'
    ])
];


async function setupDashboard() {
    const gpxDataUrl = 'https://www.highcharts.com/samples/data/dashboards/activity.gpx';

    // Get the GPX data
    let gpxData = { all: null, summary: [] };

    await fetch(gpxDataUrl)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, 'application/xml');
            gpxData = parseGpxData(xmlDoc);
        });

    // Convert GPX data to he application's required data format
    if (!gpxData) {
        console.error('Failed to load GPX data');
        return;
    }

    // Launch the dashboard
    Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: 'all-datapoints-connector',
                type: 'JSON',
                options: {
                    data: gpxData.all
                }
            },
            {
                id: 'summary-connector',
                type: 'JSON',
                options: {
                    data: gpxData.summary
                }
            }
            ]
        },
        gui: {
            layouts: [{
                id: 'layout-1',
                rows: [{
                    cells: [{
                        responsive: {
                            small: {
                                width: '100%'
                            },
                            medium: {
                                width: '50%'
                            },
                            large: {
                                width: '50%'
                            }
                        },
                        id: 'activity-map' // mapchart
                    },
                    {
                        responsive: {
                            small: {
                                width: '100%'
                            },
                            medium: {
                                width: '50%'
                            },
                            large: {
                                width: '50%'
                            }
                        },
                        id: 'activity-datagrid' // datagrid
                    }
                    ]
                }, {
                    cells: [{
                        id: 'activity-chart' // line and area chart
                    }]
                }]
            }]
        },
        components: [
            {
                renderTo: 'activity-map', // mapchart
                type: 'Highcharts',
                sync: {
                    highlight: true
                },
                chartConstructor: 'mapChart',
                connector: 'all-datapoints-connector',
                columnAssignment: [
                    {
                        seriesId: 'pointSeries',
                        data: ['latitude', 'longitude']
                    }
                ],
                chartOptions: {
                    title: {
                        text: ''
                    },
                    styleMode: {
                        enabled: false
                    },
                    navigation: {
                        buttonOptions: {
                            align: 'left',
                            theme: {
                                stroke: '#e6e6e6'
                            }
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    mapNavigation: {
                        enabled: true,
                        buttonOptions: {
                            alignTo: 'spacingBox'
                        }
                    },
                    mapView: {
                        fitToGeometry: {
                            type: 'Polygon',
                            coordinates: [
                                [
                                    [5.3000, 60.4200],
                                    [5.3900, 60.4200],
                                    [5.3900, 60.3600],
                                    [5.3000, 60.3600],
                                    [5.3000, 60.4200]
                                ]
                            ]
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    series: [
                        // Base layer map
                        {
                            type: 'tiledwebmap',
                            name: 'Map',
                            provider: {
                                type: 'OpenStreetMap',
                                theme: 'OpenTopoMap'
                            },
                            showInLegend: false
                        },
                        // Trail map on top of base layer
                        {
                            name: 'Trail Activity',
                            type: 'mapline',
                            data: [{
                                geometry: {
                                    type: 'LineString',
                                    coordinates:
                                        getTrailCoordinates(gpxData.all)
                                }
                            }],
                            showInLegend: false
                        }
                    ]
                }
            },
            {
                renderTo: 'activity-datagrid',
                type: 'DataGrid',
                title: {
                    text: 'Summary',
                    style: {
                        textAlign: 'center'
                    }
                },
                connector: {
                    id: 'summary-connector'
                },
                sync: {
                    // TBD: does not work.
                    // this data connector is only used in the DataGrid
                    highlight: true
                },
                dataGridOptions: {
                    editable: false,
                    columns: {
                        // TBD: clean up
                        // this is redundant in the current implementation
                        time: {
                            title: 'kilometer',
                            dataIndex: 'kilometer',
                            cellFormatter: function () {
                                return this.value.toFixed(1);
                            }
                        },
                        Speed: {
                            title: 'Speed (km/h)',
                            dataIndex: 'pace',
                            cellFormatter: function () {
                                return this.value.toFixed(1);
                            }
                        },
                        Elevation: {
                            title: 'Elevation (m)',
                            dataIndex: 'elevation',
                            cellFormatter: function () {
                                return this.value.toFixed(1);
                            }
                        },
                        HeartRate: {
                            title: 'Heart Rate (bpm)',
                            dataIndex: 'heartRate',
                            cellFormatter: function () {
                                return this.value.toFixed(1);
                            }
                        }
                    }
                }
            },
            {
                renderTo: 'activity-chart',
                type: 'Highcharts',

                connector: {
                    id: 'all-datapoints-connector',
                    columnAssignment: [{
                        seriesId: 'elevation-series',
                        data: ['cumulativeDistance', 'elevation']
                    },
                    {
                        seriesId: 'speed-series',
                        data: ['cumulativeDistance', 'speed']
                    },
                    {
                        seriesId: 'heartrate-series',
                        data: ['cumulativeDistance', 'hr']
                    }
                    ]
                },
                chartOptions: {
                    title: {
                        text: ''
                    },
                    xAxis: [{
                        title: {
                            text: 'Distance (km)'
                        }
                    }],
                    yAxis: [{
                        title: {
                            text: 'Elevation (m)'
                        },
                        opposite: false,
                        labels: {
                            enabled: true,
                            formatter: function () {
                                return this.value + ' m';
                            }
                        }
                    },
                    {
                        title: {
                            text: 'Heart Rate (bpm)'
                        },
                        opposite: true,
                        labels: {
                            enabled: true,
                            formatter: function () {
                                return this.value + ' bpm';
                            }
                        },
                        offset: 80,
                        gridLineWidth: 0,
                        lineWidth: 1,
                        lineColor: '#ff0000'
                    },
                    {
                        title: {
                            text: 'Speed (km/h)'
                        },
                        opposite: true,
                        labels: {
                            enabled: true,
                            formatter: function () {
                                return this.value + ' km/h';
                            }
                        },
                        offset: 0,
                        gridLineWidth: 0,
                        lineWidth: 1,
                        lineColor: '#0000ff'
                    }
                    ],
                    tooltip: {
                        shared: true,
                        crosshairs: true,
                        formatter: function () {
                            let tooltip = '<b>Distance:</b> ' +
                                this.x.toFixed(2) + ' km<br/>';

                            this.points.forEach(function (point) {
                                tooltip += '<b>' + point.series.name +
                                    '</b>: ' +
                                    point.y.toFixed(2) + ' ' +
                                    point.series.options.tooltipValueSuffix +
                                    '<br/>';
                            });
                            return tooltip;
                        }
                    },

                    series: [{
                        name: 'Elevation',
                        id: 'elevation-series',
                        yAxis: 0,
                        type: 'area',
                        tooltipValueSuffix: 'm'
                    },
                    {
                        name: 'Speed',
                        id: 'speed-series',
                        yAxis: 2,
                        tooltipValueSuffix: 'km/h'
                    },
                    {
                        name: 'Heart Rate',
                        id: 'heartrate-series',
                        yAxis: 1,
                        tooltipValueSuffix: 'bpm'
                    }]
                }
            }
        ]
    }, true);


    function getTrailCoordinates(data) {
        const coordinateData = [];

        for (let i = 1; i < data.length; i++) {
            if (data[i].length >= 7) {
                const lat2 = data[i][3];
                const lon2 = data[i][4];
                const cumulativeDistance = data[i][6];

                coordinateData.push([lon2, lat2, cumulativeDistance]);
            }
        }
        return coordinateData;
    }

    function parseGpxData(doc) {
        function getNodeText(node, name) {
            const el = node.getElementsByTagName(name);

            return el[0].textContent;
        }

        const trackPoints = doc.getElementsByTagName('trkpt');

        let cumulativeDistance = 0;
        let prevTime = 0;
        let prevLat;
        let prevLon;
        let speedSum = 0;
        let speedCount = 0;

        // Array for storing parsed data
        const parsedData = [
            // eslint-disable-next-line max-len
            ['time', 'elevation', 'hr', 'latitude', 'longitude', 'speed', 'cumulativeDistance']
        ];

        for (const point of trackPoints) {
            // Location
            const lat = parseFloat(point.getAttribute('lat'));
            const lon = parseFloat(point.getAttribute('lon'));

            // Timestamp
            const tsIso = getNodeText(point, 'time');
            const time = new Date(tsIso).getTime();

            // Elevation
            const elevation = parseFloat(getNodeText(point, 'ele'));

            // Heart rate
            const hr = parseInt(getNodeText(point, 'gpxtpx:hr'), 10);

            if (prevTime > 0) {
                const distance = calculateDistance(lat, lon, prevLat, prevLon);
                cumulativeDistance += distance / 1000;
                const timeDifference = time - prevTime;
                const speed = calculateSpeed(distance, timeDifference);
                speedSum += speed;
                speedCount++;

                const averageSpeed = speedSum / speedCount;
                parsedData.push(
                    [
                        time, elevation, hr, lat, lon,
                        averageSpeed,
                        cumulativeDistance
                    ]);
            } else {
                parsedData.push([time, elevation, hr, lat, lon, 0, 0]);
            }

            // Update previous values
            prevTime = time;
            prevLat = lat;
            prevLon = lon;
        }
        return {
            all: parsedData,
            summary: summaryData // TBD: calculate
        };
    }


    // Calculate distance between two points using Haversine formula
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Earth radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }


    // Calculate speed in km/h
    function calculateSpeed(distance, timeDifference) {
        const timeHours = timeDifference / (1000 * 3600);
        return (distance / 1000) / timeHours;
    }
}


setupDashboard(summaryData);
