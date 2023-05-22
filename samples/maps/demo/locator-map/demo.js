(async () => {
    // Import maps
    const world = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());
    const italy = await fetch(
        'https://code.highcharts.com/mapdata/countries/it/it-all.topo.json'
    ).then(response => response.json());

    // Generate locator div
    const locatorDiv = document.createElement('div');
    locatorDiv.id = 'locator';
    document.getElementById('container').appendChild(locatorDiv);

    /* Optional toggle
    // Generate button
    const btnButton = document.createElement('button');
    btnButton.id = 'btn';
    const btnIcon = document.createElement('i');
    btnIcon.classList.add('fa', 'fa-map');
    btnButton.appendChild(btnIcon);
    document.getElementById('container').appendChild(btnButton);
    */

    // Prepare demo data
    const data = [
        ['it-na', 10],
        ['it-tp', 11],
        ['it-pa', 12],
        ['it-me', 13],
        ['it-ag', 14],
        ['it-nu', 15],
        ['it-og', 16],
        ['it-ms', 17],
        ['it-mt', 18],
        ['it-bn', 19],
        ['it-cl', 20],
        ['it-an', 21],
        ['it-pg', 22],
        ['it-ci', 23],
        ['it-ss', 24],
        ['it-ot', 25],
        ['it-gr', 26],
        ['it-li', 27],
        ['it-ar', 28],
        ['it-fe', 29],
        ['it-ra', 30],
        ['it-fi', 31],
        ['it-fc', 32],
        ['it-rn', 33],
        ['it-ge', 34],
        ['it-sv', 35],
        ['it-vs', 36],
        ['it-ve', 37],
        ['it-ca', 38],
        ['it-pi', 39],
        ['it-re', 40],
        ['it-lu', 41],
        ['it-bo', 42],
        ['it-pt', 43],
        ['it-pz', 44],
        ['it-cz', 45],
        ['it-rc', 46],
        ['it-ce', 47],
        ['it-lt', 48],
        ['it-av', 49],
        ['it-is', 50],
        ['it-ba', 51],
        ['it-br', 52],
        ['it-le', 53],
        ['it-ta', 54],
        ['it-ct', 55],
        ['it-rg', 56],
        ['it-pe', 57],
        ['it-ri', 58],
        ['it-te', 59],
        ['it-fr', 60],
        ['it-aq', 61],
        ['it-rm', 62],
        ['it-ch', 63],
        ['it-vt', 64],
        ['it-pu', 65],
        ['it-mc', 66],
        ['it-fm', 67],
        ['it-ap', 68],
        ['it-si', 69],
        ['it-tr', 70],
        ['it-to', 71],
        ['it-bi', 72],
        ['it-no', 73],
        ['it-vc', 74],
        ['it-ao', 75],
        ['it-vb', 76],
        ['it-al', 77],
        ['it-mn', 78],
        ['it-pc', 79],
        ['it-lo', 80],
        ['it-pv', 81],
        ['it-cr', 82],
        ['it-mi', 83],
        ['it-va', 84],
        ['it-so', 85],
        ['it-co', 86],
        ['it-lc', 87],
        ['it-bg', 88],
        ['it-mb', 89],
        ['it-ud', 90],
        ['it-go', 91],
        ['it-ts', 92],
        ['it-ro', 93],
        ['it-pd', 94],
        ['it-vr', 95],
        ['it-tn', 96],
        ['it-bl', 97],
        ['it-mo', 98],
        ['it-sp', 99],
        ['it-pr', 100],
        ['it-fg', 101],
        ['it-im', 102],
        ['it-or', 103],
        ['it-cs', 104],
        ['it-vv', 105],
        ['it-sa', 106],
        ['it-bt', 107],
        ['it-sr', 108],
        ['it-en', 109],
        ['it-cn', 110],
        ['it-bz', 111],
        ['it-po', 112],
        ['it-kr', 113],
        ['it-cb', 114],
        ['it-at', 115],
        ['it-bs', 116],
        ['it-pn', 117],
        ['it-vi', 118],
        ['it-tv', 119]
    ];
    // Global settings
    Highcharts.setOptions({
        title: null,
        colorAxis: {
            visible: false
        },
        legend: {
            enabled: false
        },
        mapNavigation: {
            enabled: false
        },
        exporting: {
            enabled: false
        }
    });
    // Main chart
    const mainChart = Highcharts.mapChart('main', {
        chart: {
            margin: 0
        },
        series: [{
            states: {
                inactive: {
                    enabled: false
                }
            },
            name: 'Background map',
            mapData: world,
            affectsMapView: false,
            borderColor: 'rgba(0, 0, 0, 0)',
            nullColor: 'rgba(196, 196, 196, 0.2)'
        },
        {
            name: 'Italy',
            mapData: italy,
            data: data,
            color: Highcharts.getOptions().colors[0]
        }
        ]
    });
    // Orthographic projection grid
    const getGraticule = () => {
        const data = [];
        // Meridians
        for (let x = -180; x <= 180; x += 15) {
            data.push({
                geometry: {
                    type: 'LineString',
                    coordinates: x % 90 === 0 ? [
                        [x, -90],
                        [x, 0],
                        [x, 90]
                    ] : [
                        [x, -80],
                        [x, 80]
                    ]
                }
            });
        }
        // Latitudes
        for (let y = -90; y <= 90; y += 10) {
            const coordinates = [];
            for (let x = -180; x <= 180; x += 5) {
                coordinates.push([x, y]);
            }
            data.push({
                geometry: {
                    type: 'LineString',
                    coordinates
                },
                lineWidth: y === 0 ? 2 : undefined
            });
        }
        return data;
    };
    // Locator map pointer logic
    function getMapFrame(chart, plotLeft, plotHeight, plotWidth, plotTop) {
        const corners = [
            { x: plotLeft, y: plotHeight },
            { x: plotWidth, y: plotHeight },
            { x: plotWidth, y: plotTop },
            { x: plotLeft, y: plotTop }
        ];

        const points = corners.map(corner => {
            // Adjust the rectangle to the projection
            const [lon, lat] = Object.values(
                chart.mapView.pixelsToLonLat(corner)
            ).map((lonLat, i) =>
                (i === 0 ? Math.min(179.9, Math.max(-179.9, lonLat)) :
                    Math.min(90, Math.max(-90, lonLat)))
            );
            return [lon, lat];
        });

        function createPoints(startPoint, endPoint) {
            const points = [];
            // eslint-disable-next-line prefer-const
            let [lon, lat] = startPoint;

            while (lon <= endPoint[0]) {
                points.push([lon, lat]);
                lon += 5;
            }

            return points;
        }

        const [leftBottomPoint, rightBottomPoint, rightTopPoint, leftTopPoint] =
            points,
            bottomPoints = createPoints(leftBottomPoint, rightBottomPoint),
            topPoints = createPoints(leftTopPoint, rightTopPoint);

        const rect = [
            leftBottomPoint,
            ...bottomPoints,
            rightBottomPoint,
            rightTopPoint,
            ...topPoints,
            leftTopPoint,
            leftBottomPoint
        ];

        return rect;
    }
    // Locator map
    const locatorChart = Highcharts.mapChart('locator', {
        chart: {
            backgroundColor: '#ffffffB3',
            borderColor: '#e0e0e0',
            borderWidth: 1,
            margin: 15
            /* Optional toggle
            events: {
                load() {
                    // Locator map toggle logic
                    const chart = this;
                    let i = 1;

                    function toggleMap() {
                        const icon = document.getElementById('btn').firstElementChild;
                        icon.classList.toggle('fa-map');
                        icon.classList.toggle('fa-globe');

                        if (i === 1) {
                            updateLocatorMap('Miller', 'none', 0);
                            i++;
                        } else if (i === 2) {
                            updateLocatorMap('Orthographic', '#c4c4c422', 15);
                            i = 1;
                        }
                    }

                    function updateLocatorMap(
                        projectionType,
                        graticuleColor,
                        margin
                    ) {
                        chart.get('Graticule').update({
                            color: graticuleColor
                        }, false);
                        chart.redraw(false);
                        chart.update({
                            chart: {
                                margin: margin
                            },
                            mapView: {
                                projection: {
                                    name: projectionType
                                }
                            }
                        });
                    }
                    document.getElementById('btn').onclick = toggleMap;
                }
            } */
        },
        credits: {
            enabled: false
        },
        mapView: {
            projection: {
                name: 'Orthographic'
            }
        },
        plotOptions: {
            series: {
                accessibility: {
                    enabled: false
                },
                enableMouseTracking: false,
                animationLimit: 500,
                borderColor: '#fff',
                borderWidth: 0.25,
                clip: false,
                nullColor: '#e0e0e0',
                states: {
                    inactive: {
                        enabled: false
                    }
                }
            }
        },
        series: [{
            name: 'Locator',
            mapData: world
        }, {
            id: 'Graticule',
            type: 'mapline',
            data: getGraticule(),
            color: '#c4c4c422',
            zIndex: -1
        }, {
            name: 'Locator',
            type: 'mapline',
            color: '#ff0000',
            data: [{
                geometry: {
                    type: 'LineString',
                    coordinates: getMapFrame(
                        mainChart,
                        mainChart.plotLeft,
                        mainChart.plotHeight,
                        mainChart.plotWidth,
                        mainChart.plotTop
                    )
                }
            }]
        }]
    });
})();