const createChart = async () => {

    /* MAIN CHART */

    // Import maps
    const world = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());
    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/it/it-all.topo.json'
    ).then(response => response.json());

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

    Highcharts.mapChart('container', {
        chart: {
            margin: 0
        },

        title: {
            text: 'Highcharts Map with Locator'
        },

        mapNavigation: {
            enabled: true
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
    function getMapFrame(chart, plotLeft, plotHeight, plotWidth, plotTop) {
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
                edgePoints.push([lonLat.lon, lonLat.lat]);
            }
            return edgePoints;
        }

        const topEdge = calculateEdge(
                i => plotLeft + (i / steps) * plotWidth,
                () => plotTop
            ),

            bottomEdge = calculateEdge(
                i => plotLeft + (i / steps) * plotWidth,
                () => plotTop + plotHeight
            ),

            leftEdge = calculateEdge(
                () => plotLeft,
                i => plotTop + (i / steps) * plotHeight
            ),

            rightEdge = calculateEdge(
                () => plotLeft + plotWidth,
                i => plotTop + (i / steps) * plotHeight
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
                        mainChart.plotLeft,
                        mainChart.plotHeight,
                        mainChart.plotWidth,
                        mainChart.plotTop
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
                    mainChart.plotLeft,
                    mainChart.plotHeight,
                    mainChart.plotWidth,
                    mainChart.plotTop
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
