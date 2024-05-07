async function setupDashboard() {
    const gpxDataUrl = 'https://www.highcharts.com/samples/data/dashboards/activity.gpx';

    // Load data from server
    const gpxData = await loadGpxData(gpxDataUrl);
    if (!gpxData) {
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
                        id: 'activity-map' // Map
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
                        id: 'activity-datagrid'
                    }
                    ]
                }, {
                    cells: [{
                        id: 'activity-chart' // Line and area chart
                    }]
                }]
            }]
        },
        components: [
            {
                renderTo: 'activity-map', // Map
                type: 'Highcharts',
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
                        center: gpxData.center,
                        zoom: 12.5
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
                dataGridOptions: {
                    editable: false,
                    columns: {
                        km: {
                            headerFormat: 'Kilometer',
                            dataIndex: 'km'
                        },
                        pace: {
                            headerFormat: 'Speed (km/h)',
                            dataIndex: 'pace',
                            cellFormat: '{value:.1f}'
                        },
                        elev: {
                            headerFormat: 'Elevation (m)',
                            dataIndex: 'elev',
                            cellFormat: '{value:.1f}'
                        },
                        hr: {
                            headerFormat: 'Heart Rate (bpm)',
                            dataIndex: 'hr'
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
                    }]
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
                        lineColor: '#f00'
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
                        lineColor: '#00f'
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
                        name: 'Heart Rate',
                        id: 'heartrate-series',
                        yAxis: 1,
                        tooltipValueSuffix: 'bpm'
                    },
                    {
                        name: 'Speed',
                        id: 'speed-series',
                        yAxis: 2,
                        tooltipValueSuffix: 'km/h'
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

    // Get the CPX data from the server
    async function loadGpxData(url) {
        // Get the GPX data
        let response;
        try {
            response = await fetch(url);
        } catch (err) {
            console.error(err);
            return;
        }

        if (response.ok) {
            const xmlData = await response.text();

            return parseGpxData(xmlData);
        }
        console.error('Failed to parse GPX data');
    }

    // Parse GPX data
    function parseGpxData(xmlData) {
        function getNodeText(node, name) {
            const el = node.getElementsByTagName(name);

            return el[0].textContent;
        }
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlData, 'application/xml');

        // All recorded points
        const trackPoints = doc.getElementsByTagName('trkpt');

        // Kilometer boundary points (for DataGrid only)
        const kmPoints = [['km', 'pace', 'elev', 'hr']];

        let cumulativeDistance = 0;
        let prevTime = 0;
        let prevLat;
        let prevLon;
        let speedSum = 0;
        let speedCount = 0;
        let kilometer = 0;

        // Array for storing parsed data
        const allPoints = [
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
            const heartRate = Number(getNodeText(point, 'gpxtpx:hr'));

            if (prevTime > 0) {
                // Create point
                const distance = calculateDistance(lat, lon, prevLat, prevLon);
                cumulativeDistance += distance / 1000;
                const timeDifference = time - prevTime;
                const speed = calculateSpeed(distance, timeDifference);
                speedSum += speed;
                speedCount++;

                const averageSpeed = speedSum / speedCount;
                allPoints.push(
                    [
                        time, elevation, heartRate, lat, lon,
                        averageSpeed,
                        cumulativeDistance
                    ]);

                // Kilometer boundary?
                const currentKm = Math.trunc(cumulativeDistance);
                if (currentKm > kilometer) {
                    kilometer = currentKm;
                    // eslint-disable-next-line max-len
                    kmPoints.push([currentKm, averageSpeed, elevation, heartRate]);
                }
            } else {
                allPoints.push([time, elevation, heartRate, lat, lon, 0, 0]);
            }

            // Update previous values
            prevTime = time;
            prevLat = lat;
            prevLon = lon;
        }

        return {
            all: allPoints,
            summary: kmPoints,
            center: [prevLon, prevLat]
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

// Launch the application
setupDashboard();
