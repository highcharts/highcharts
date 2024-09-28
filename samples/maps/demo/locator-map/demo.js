const createChart = async () => {

    /* MAIN CHART */

    // Import maps
    const world = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/it/it-all.topo.json'
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

        colorAxis: {
            minColor: '#87c1c3',
            maxColor: '#4ba5a6'
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
            name: topology.title || 'Map',
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

    // Render a circle filled with a radial gradient behind the globe to
    // make it appear as the sea around the continents
    const renderGlobe = e => {
        const chart = e.target;
        if (chart.mapView.projection.options.name === 'Orthographic') {
            let verb = 'animate';
            if (!chart.globe) {
                chart.globe = chart.renderer
                    .circle()
                    .attr({
                        fill: {
                            radialGradient: {
                                cx: 0.4,
                                cy: 0.4,
                                r: 1
                            },
                            stops: [
                                [
                                    0,
                                    Highcharts.color(
                                        mainChart.options.plotOptions.map
                                            .nullColor
                                    ).brighten(0.3).get()
                                ],
                                [
                                    1,
                                    mainChart.options.plotOptions.map
                                        .nullColor
                                ]
                            ]
                        },
                        zIndex: -1
                    })
                    .add(chart.get('graticule').group)
                    .shadow({});
                verb = 'attr';
            }

            const bounds = chart.get('graticule').bounds,
                p1 = chart.mapView.projectedUnitsToPixels({
                    x: bounds.x1,
                    y: bounds.y1
                }),
                p2 = chart.mapView.projectedUnitsToPixels({
                    x: bounds.x2,
                    y: bounds.y2
                });
            chart.globe.show()[verb]({
                cx: (p1.x + p2.x) / 2,
                cy: (p1.y + p2.y) / 2,
                r: Math.min(p2.x - p1.x, p1.y - p2.y) / 2
            });

        } else if (chart.globe) {
            chart.globe.hide();
        }
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
            backgroundColor: 'transparent',
            margin: 15,
            events: {
                render: renderGlobe
            }
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
            id: 'graticule',
            type: 'mapline',
            data: getGraticule(),
            color: 'rgba(128,128,128,0.1)',
            zIndex: -1
        }, {
            name: 'Frame',
            type: 'mapline',
            color: mainChart.options.legend.navigation.activeColor,
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
    Highcharts.css(btn, {
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
        Highcharts.css(btn, {
            backgroundColor: '#e6e6e6',
            color: '#8fa2c9'
        });
    });

    btn.addEventListener('mouseout', () => {
        Highcharts.css(btn, {
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
            updateLocatorMap(
                'Orthographic',
                'rgba(128,128,128,0.1)',
                15,
                rotation(lon, lat)
            );
            i = 1;
        }
    };

    document.getElementById('btn').onclick = toggleMap;

    function updateLocatorMap(
        projectionName,
        graticuleColor,
        margin,
        rotation
    ) {
        locatorChart.get('graticule').update(
            {
                color: graticuleColor
            },
            false
        );
        locatorChart.redraw(false);
        locatorChart.update({
            chart: {
                margin
            },
            mapView: {
                projection: {
                    name: projectionName,
                    rotation
                }
            }
        });
    }
    // */
    /* OPTIONAL TOGGLE END */

}, { order: 1 });
/* End of Locator map plugin */


createChart();
