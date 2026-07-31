// Extend some types
declare namespace Highcharts {
    // Allow a custom property on the map chart
    interface MapChart {
        sea?: Highcharts.SVGElement;
        rotationTimer?: number;
        rotationFrame?: number;
        sonification?: Highcharts.Sonification;
        mapView?: Highcharts.mapView
        currentPoint?: Highcharts.Point;
    }

    // Some internal properties on the series
    interface Series {
        bounds?: Highcharts.MapBounds;
    }
}

// Create the map instance
const createMap = (
    topology: Highcharts.TopoJSON,
    data: Highcharts.SeriesMapDataOptions[],
    graticuleData: Highcharts.SeriesMaplineDataOptions[]
) => {
    const chart = Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'Population density per country',
            floating: true,
            align: 'left',
            style: {
                textOutline: '2px contrast'
            }
        },

        subtitle: {
            text: 'Select a point to extend or remove it<br>' +
                    'Click and drag to rotate globe',
            floating: true,
            y: 34,
            align: 'left'
        },

        legend: {
            enabled: false
        },

        mapNavigation: {
            enabled: true,
            enableDoubleClickZoomTo: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        mapView: {
            maxZoom: 30,
            projection: {
                name: 'Orthographic',
                rotation: [20, -30]
            }
        },

        colorAxis: [{
            minColor: 'light-dark(#BFCFAD, #78a37c)',
            maxColor: 'light-dark(#31784B, #0b250d)',
            max: 800
        }, {
            min: 0,
            max: 1,
            showInLegend: false,
            minColor: '#ffffff00',
            maxColor: '#ffff'
        }],

        tooltip: {
            pointFormat: '{point.name}: {point.value} / km²'
        },
        plotOptions: {
            series: {
                animation: {
                    duration: 750
                },
                clip: false
            }
        },

        series: [{
            name: 'Graticule',
            id: 'graticule',
            type: 'mapline',
            data: graticuleData,
            nullColor: '#aaa3',
            accessibility: {
                enabled: false
            },
            enableMouseTracking: false,
            states: {
                inactive: {
                    enabled: false
                }
            }
        }, {
            data,
            joinBy: ['iso-a2', 'code'],
            name: 'Population density',
            borderColor: 'light-dark(#aaa, #333)',
            states: {
                hover: {
                    color: '#a4edba',
                    borderColor: '#333333'
                }
            },
            nullColor: 'light-dark(#c0c0c0, #aaa)',
            dataLabels: {
                enabled: false,
                format: '{point.name}'
            },
            id: 'choropleth',
            accessibility: {
                exposeAsGroupOnly: true
            }
        }, {
            type: 'mappoint',
            id: 'clicked-points',
            name: 'Clicked points',
            cursor: 'pointer',
            animation: true,
            data: [],
            color: '#313f77',
            marker: {
                lineWidth: 1,
                lineColor: '#fff',
                states: {
                    select: {
                        fillColor: '#fff',
                        lineColor: '#313f77',
                        lineWidth: 3,
                        radius: 7
                    }
                }
            }
        }, {
            type: 'mapline',
            animation: false,
            id: 'flight-route',
            data: [],
            lineWidth: 2,
            accessibility: {
                exposeAsGroupOnly: true
            }
        }]
    });
    return chart;
};

// Define buttons used to remove points and to add new routes.
const removeButton = document.getElementById(
    'remove-point'
) as HTMLButtonElement;
const newRouteButton = document.getElementById(
    'new-route'
) as HTMLButtonElement;

// Create the coordinates for the graticule, the grid of meridians and parallels
const graticuleData = ((
    meridianStep: number,
    parallelStep: number
): Highcharts.SeriesMaplineDataOptions[] => {
    const data: Highcharts.SeriesMaplineDataOptions[] = [];

    // Meridians
    for (let x = -180; x <= 180; x += meridianStep) {
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

    // Parallels
    for (let y = -90; y <= 90; y += parallelStep) {
        const coordinates: [number, number][] = [];
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
})(15, 10);

function setupControls(chart: Highcharts.MapChart): void {
    removeButton.addEventListener('click', (): void => {
        if (chart.currentPoint) {
            removePoint(chart.currentPoint, chart);
        }
    });
    newRouteButton.addEventListener('click', (): void => {
        chart.currentPoint?.select(false);
        chart.currentPoint = void 0;
        updateControls(chart);
    });

    updateControls(chart);
}

function updateControls(chart: Highcharts.MapChart): void {
    removeButton.disabled = !chart.currentPoint;
    newRouteButton.disabled = !chart.currentPoint;
}

function addInitialFlight(chart) {
    // Add a flight path between Amsterdam and Los Angeles
    const amsterdamPoint = {
        point: {
            name: 'Amsterdam'
        },
        lon: 4.90,
        lat: 53.38
    };
    const losAngelesPoint = {
        point: {
            name: 'Los Angeles'
        },
        lon: -118.24,
        lat: 34.05
    };
    addLinePoint(amsterdamPoint, chart);
    addLinePoint(losAngelesPoint, chart);
}

function setupAutoRotation(chart: Highcharts.MapChart): void {
    const mapView = chart.mapView;
    const globeRotationSpeed = 0.1 / 50;
    let lastTimestamp: number | undefined;

    const rotate = (timestamp: number): void => {
        const elapsed = lastTimestamp === undefined ?
            0 : timestamp - lastTimestamp;
        const projectionOptions = mapView.projection.options as any;

        lastTimestamp = timestamp;
        mapView.update({
            projection: {
                rotation: [
                    projectionOptions.rotation[0] +
                        (elapsed * globeRotationSpeed),
                    projectionOptions.rotation[1]
                ]
            }
        }, false);
        // recenter globe after rotation
        mapView.setView(
            mapView.projection.inverse([0, 0]),
            mapView.zoom,
            true,
            false
        );

        chart.rotationFrame = requestAnimationFrame(rotate);
    };

    const stopRotation = (): void => {
        if (chart.rotationFrame) {
            cancelAnimationFrame(chart.rotationFrame);
        }
    };

    const startRotation = (): void => {
        lastTimestamp = undefined;
        chart.rotationFrame = requestAnimationFrame(rotate);
    };

    const scheduleRotation = (delay = 5000): void => {
        if (chart.rotationTimer) {
            clearTimeout(chart.rotationTimer);
        }
        chart.rotationTimer = window.setTimeout(startRotation, delay);
    };

    // Reset timer once the user drags the globe
    const container = chart.container as HTMLElement;
    container?.addEventListener('mouseover', () => {
        stopRotation();
        scheduleRotation();
    });
    startRotation();
}

function addConnection(from, to, series): void {
    series.addPoint({
        geometry: {
            type: 'LineString',
            coordinates: [
                from.geometry.coordinates,
                to.geometry.coordinates
            ]
        },
        color: 'light-dark(#313f77, #fff)',
        custom: {
            from: from.id,
            to: to.id
        }
    }, false);
}

function selectPoint(
    point: Highcharts.Point,
    chart: Highcharts.MapChart
): void {
    point.select(true);
    chart.currentPoint = point;
    updateControls(chart);
}

// Add flight route and gentle rotation after clicking the map
function addLinePoint(event, chart) {
    const pointSeries = chart.get('clicked-points'),
        lineSeries = chart.get('flight-route'),
        lastPoint = chart.currentPoint,
        newPoint = {
            id: Highcharts.uniqueKey(),
            name: event.point.name,
            geometry: {
                type: 'Point',
                coordinates: [event.lon, event.lat]
            }
        };

    if (lastPoint) {
        addConnection(lastPoint.options, newPoint, lineSeries);
    }
    pointSeries.addPoint(newPoint, false);
    chart.redraw(false);
    selectPoint(pointSeries.data[pointSeries.data.length - 1], chart);

    // Play ascending notes for adding a point
    chart.sonification?.playNote('vibraphone', {
        note: 'C3',
        noteDuration: 150,
        volume: 0.3
    });
}

function removePoint(point, chart) {
    const pointSeries = chart.get('clicked-points'),
        lineSeries = chart.get('flight-route'),
        toRemove: Highcharts.Point[] = [],
        neighbours: Highcharts.Point[] = [];

    lineSeries.data.forEach((line): void => {
        const { from, to } = line.options.custom || {};
        if (from === point.id || to === point.id) {
            const neighbour = pointSeries.data.find(
                (routePoint): boolean =>
                    routePoint.id === (from === point.id ? to : from)
            );
            if (neighbour) {
                neighbours.push(neighbour);
            }
            toRemove.push(line);
        }
    });
    toRemove.forEach((line): void => line.remove(false));

    // Preserve an unbranched route when removing a point in the middle.
    if (neighbours.length === 2) {
        addConnection(
            neighbours[0].options,
            neighbours[1].options,
            lineSeries
        );
    }

    point.remove(false, false);
    chart.currentPoint = neighbours[0];
    chart.redraw(false);
    if (chart.currentPoint) {
        selectPoint(chart.currentPoint, chart);
    } else {
        updateControls(chart);
    }

    // Play descending notes for removing a point
    chart.sonification?.playNote('vibraphone', {
        note: 'C2',
        noteDuration: 150,
        volume: 0.3
    });
}

// Handle interactions outside the chart configuration.
Highcharts.addEvent(Highcharts.Series, 'click', function (event) {
    const chart = this.chart as Highcharts.MapChart;
    if (this.options.id === 'choropleth') {
        addLinePoint(event, chart);
    } else if (this.options.id === 'clicked-points') {
        selectPoint(event.point, chart);
    }
});

Highcharts.addEvent(Highcharts.Series, 'afterAnimate', function () {
    const chart = this.chart as Highcharts.MapChart;
    if (this.options.id === 'choropleth') {
        addInitialFlight(chart);
        setupControls(chart);
        setupAutoRotation(chart);
    }
});

// Render a circle filled with a radial gradient behind the globe to make it
// appear as the sea around the continents
Highcharts.addEvent(Highcharts.MapChart, 'render', function () {

    const graticule = this.get('graticule') as Highcharts.Series;

    if (!graticule) {
        return;
    }

    let verb: 'animate' | 'attr' = 'animate';

    if (!this.sea) {
        this.sea = this.renderer
            .circle()
            .attr({
                fill: {
                    radialGradient: {
                        cx: 0.4,
                        cy: 0.4,
                        r: 1
                    },
                    stops: [
                        [0, 'light-dark(white, #0074e8)'],
                        [1, 'light-dark(lightblue, #000061)']
                    ]
                },
                zIndex: -1
            })
            .add(graticule.group);
        verb = 'attr';
    }

    const bounds = graticule.bounds,
        p1 = this.mapView.projectedUnitsToPixels({
            x: bounds.x1,
            y: bounds.y1
        }),
        p2 = this.mapView.projectedUnitsToPixels({
            x: bounds.x2,
            y: bounds.y2
        });

    this.sea?.[verb]({
        cx: (p1.x + p2.x) / 2,
        cy: (p1.y + p2.y) / 2,
        r: Math.min(p2.x - p1.x, p1.y - p2.y) / 2
    });
});

// Load the TopoJSON file and create the chart
(async () => {

    // Get the map
    const topology: Highcharts.TopoJSON = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    // Get the data
    const data: Highcharts.SeriesMapDataOptions[] = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v13.0.0/samples/data/world-population-density.json'
    ).then(response => response.json());

    createMap(topology, data, graticuleData);

})();
