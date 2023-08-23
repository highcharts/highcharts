const createChart = async () => {

    /* MAIN CHART */

    // Import maps
    const world = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    const countryCode = 'it',
        topology = await fetch(
            'https://code.highcharts.com/mapdata/countries/' +
            `${countryCode}/${countryCode}-all.topo.json`
        ).then(response => response.json());

    // Prepare random-like demo data
    const data = topology.objects.default.geometries.map((g, i) => [
        g.properties['hc-key'],
        i % 10
    ]);

    Highcharts.mapChart('container', {

        chart: {
            margin: 0
        },

        title: {
            text: 'Highcharts Map with Locator'
        },

        mapView: {
            // Make room for the title
            padding: [30, 0, 0, 0]
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                align: 'right',
                alignTo: 'spacingBox'
            }
        },

        navigation: {
            buttonOptions: {
                theme: {
                    stroke: '#e6e6e6'
                }
            }
        },

        legend: {
            layout: 'vertical',
            align: 'right'
        },

        colorAxis: {},

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
            mapData: topology,
            data
        }]
    });
};


/* Start of Locator map plugin */
Highcharts.addEvent(Highcharts.Chart, 'afterInit', async function () {

    if (
        (
            this.renderTo &&
            this.renderTo.classList &&
            this.renderTo.classList.contains('highcharts-locator')
        ) ||
        !this.mapView ||
        this.options.locator === false
    ) {
        return;
    }

    // Get the main chart
    const mainChart = this;

    const locatorMap = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    // Generate and place the locator div
    mainChart.renderTo.style.position = 'relative';
    const locatorContainer = Highcharts.createElement('div', {
        className: 'highcharts-locator'
    }, {
        position: 'absolute',
        height: '30%',
        width: '25%',
        bottom: 0,
        left: 0
    }, mainChart.renderTo);


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

    // Locator chart frame logic
    function getMapFrame(chart, plotHeight, plotWidth) {
        const steps = 20;

        function calculateEdge(xFunc, yFunc) {
            const edgePoints = [];
            for (let i = 0; i <= steps; i++) {
                const x = xFunc(i),
                    y = yFunc(i),
                    lonLat = chart.mapView.pixelsToLonLat({
                        x,
                        y
                    });
                if (!isNaN(lonLat.lon) && !isNaN(lonLat.lat)) {
                    edgePoints.push([lonLat.lon, lonLat.lat]);
                }
            }
            return edgePoints;
        }

        const topEdge = calculateEdge(
                i => (i / steps) * plotWidth,
                () => 0
            ),

            bottomEdge = calculateEdge(
                i => (i / steps) * plotWidth,
                () => plotHeight
            ),

            leftEdge = calculateEdge(
                () => 0,
                i => (i / steps) * plotHeight
            ),

            rightEdge = calculateEdge(
                () => plotWidth,
                i => (i / steps) * plotHeight
            ),

            rect = [
                ...leftEdge,
                ...bottomEdge,
                ...rightEdge.reverse(),
                ...topEdge.reverse()
            ];

        return rect;
    }

    // Get the main chart center
    const [lon, lat] = mainChart.mapView.center;

    // Locator map rotation
    function rotation(lonCenter, latCenter) {
        return [-lonCenter, -latCenter];
    }

    // Locator chart
    const locatorChart = Highcharts.mapChart(locatorContainer, {
        chart: {
            backgroundColor: '#ffffffB3',
            borderColor: '#e0e0e0',
            borderWidth: 1,
            margin: 15
        },

        credits: {
            enabled: false
        },

        mapView: {
            projection: {
                name: 'Orthographic',
                rotation: rotation(lon, lat)
            }
        },

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
            name: 'Map',
            mapData: locatorMap
        }, {
            id: 'Graticule',
            type: 'mapline',
            data: getGraticule(),
            color: '#c4c4c422',
            zIndex: -1
        }, {
            name: 'Frame',
            type: 'mapline',
            color: '#ff0000',
            data: [{
                geometry: {
                    type: 'LineString',
                    coordinates: getMapFrame(
                        mainChart,
                        mainChart.plotHeight,
                        mainChart.plotWidth
                    )
                }
            }]
        }]
    });

    // Adjust the locator frame size when zooming or panning
    Highcharts.addEvent(mainChart, 'render', function () {
        locatorChart.series[2].setData([{
            geometry: {
                type: 'LineString',
                coordinates: getMapFrame(
                    mainChart,
                    mainChart.plotHeight,
                    mainChart.plotWidth
                )
            }
        }]);
    });


    /* OPTIONAL TOGGLE for locator map */
    /*
    // Generate button
    const btn = document.createElement('button');
    btn.id = 'btn';
    const btnIcon = document.createElement('i');
    btnIcon.classList.add('fa', 'fa-map');
    btn.appendChild(btnIcon);
    document.getElementById('container').appendChild(btn);

    // Apply styles
    setStyle(btn, {
        position: 'absolute',
        bottom: '2%',
        left: '1%',
        cursor: 'pointer',
        fontSize: '16px',
        padding: '0.7%',
        borderRadius: '3px',
        border: '1px solid #e0e0e0',
        backgroundColor: '#f7f7f7',
        color: '#afbbd2'
    });

    btn.addEventListener('mouseover', () => {
        setStyle(btn, {
            backgroundColor: '#e6e6e6',
            color: '#8fa2c9'
        });
    });

    btn.addEventListener('mouseout', () => {
        setStyle(btn, {
            backgroundColor: '#f7f7f7',
            color: '#afbbd2'
        });
    });

    // Toggle map
    let i = 1;
    const toggleMap = () => {
        const icon = document.getElementById('btn').firstElementChild;
        icon.classList.toggle('fa-map');
        icon.classList.toggle('fa-globe');

        if (i === 1) {
            updateLocatorMap('Miller', 'none', 0);
            i++;
        } else if (i === 2) {
            updateLocatorMap('Orthographic', '#c4c4c422', 15, rotation(lon, lat));
            i = 1;
        }
    };

    document.getElementById('btn').onclick = toggleMap;

    function updateLocatorMap(projectionType, graticuleColor, margin, mapRotation) {
        locatorChart.get('Graticule').update({
            color: graticuleColor
        },
        false
        );
        locatorChart.redraw(false);
        locatorChart.update({
            chart: {
                margin: margin
            },
            mapView: {
                projection: {
                    name: projectionType,
                    rotation: mapRotation
                }
            }
        });
    }
    */
    /* OPTIONAL TOGGLE END */

}, { order: 1 });
/* End of Locator map plugin */


createChart();
