// Extend some types
declare namespace Highcharts {
    // Allow a custom property on the map chart
    interface MapChart {
        sea?: Highcharts.SVGElement;
        rotationTimer?: number;
        rotationFrame?: number;
        sonification?: Highcharts.Sonification;
    }

    // Some internal properties on the series
    interface Series {
        bounds?: Highcharts.MapBounds;
    }
}

// Create a semi-transparent cloud field on a regular longitude/latitude grid.
// Each tuple describes the center, spread, intensity and curve of a front.
const cloudSystems: [number, number, number, number, number][] = [
    [-165, 50, 70, 9, 12],
    [-135, -25, 55, 8, -10],
    [-100, 15, 75, 10, 14],
    [-70, -50, 65, 8, -12],
    [-35, 55, 70, 8, -10],
    [5, 20, 50, 7, 8],
    [35, -15, 80, 10, 13],
    [75, -45, 60, 8, -9],
    [100, 35, 70, 9, -12],
    [145, -15, 55, 8, 10],
    [175, 10, 80, 10, -14]
];
const cloudData: Array<{ lat: number; lon: number; value: number }> = [];

for (let lat = -85; lat <= 85; lat += 5) {
    for (let lon = -180; lon <= 180; lon += 5) {
        let value = 0;

        for (const [
            centerLon,
            centerLat,
            lonRadius,
            latRadius,
            curve
        ] of cloudSystems) {
            const lonDistance = ((lon - centerLon + 540) % 360) - 180,
                frontLatitude = centerLat + curve * Math.sin(
                    lonDistance / lonRadius * Math.PI
                ),
                latDistance = lat - frontLatitude,
                shape = Math.exp(-(
                    Math.pow(lonDistance / lonRadius, 2) +
                    Math.pow(latDistance / latRadius, 2)
                )),
                texture = Math.max(
                    0,
                    0.55 +
                    0.3 * Math.sin((lonDistance + lat * 2) / 5) +
                    0.15 * Math.cos((lonDistance * 2 - lat) / 3)
                );

            value = Math.max(value, shape * texture);
        }

        // Remove thin haze and boost the remaining cloud banks.
        value = value < 0.16 ? 0 : Math.pow((value - 0.16) / 0.84, 0.5);

        cloudData.push({
            lat,
            lon,
            value: Math.min(value, 1)
        });
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
            text: '- with clouds and a popular flight route<br>' +
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
            },
            events: {
                click: function (point) {
                    addLinePoint(point, this.chart as Highcharts.MapChart);
                }
            }
        }, {
            type: 'geoheatmap',
            id: 'clouds',
            name: 'Cloud cover',
            className: 'cloud-layer',
            colorAxis: 1,
            data: cloudData,
            colsize: 5,
            rowsize: 5,
            opacity: 0.95,
            borderWidth: 0,
            interpolation: {
                enabled: true,
                blur: 0.35
            },
            affectsMapView: false,
            enableMouseTracking: false,
            accessibility: {
                enabled: false
            },
            states: {
                inactive: {
                    enabled: false
                }
            }
        }, {
            type: 'mappoint',
            id: 'clicked-points',
            name: 'Clicked points',
            animation: true,
            data: [],
            color: '#313f77',
            marker: {
                lineWidth: 1,
                lineColor: '#fff'
            },
            events: {
                click: function (e: any): void {
                    const pointCoords = e.point.options.geometry.coordinates;
                    const chart = this.chart as Highcharts.MapChart;
                    const lines = chart.get('flight-route') as any;
                    const pointSeries = chart.get('clicked-points') as any;

                    // Collect matching lines first to avoid mutating the series
                    const toRemove: any[] = [];
                    lines?.data.forEach((line: any): void => {
                        const lineCoords = line.options.geometry.coordinates;
                        if (lineCoords.some(([lon, lat]) =>
                            lon === pointCoords[0] &&
                            lat === pointCoords[1]
                        )) {
                            toRemove.push(line);
                        }
                    });
                    toRemove.forEach((line: any) => line.remove(false));

                    // Find the clicked point index to reconnect neighbours
                    const idx = pointSeries?.data.findIndex((p: any) =>
                        p.options.geometry.coordinates[0] === pointCoords[0] &&
                        p.options.geometry.coordinates[1] === pointCoords[1]
                    );
                    // If the clicked point has both a previous and next
                    // neighbour, add a new line between them after removing
                    // the two old lines.
                    if (
                        typeof idx === 'number' &&
                        idx > 0 &&
                        pointSeries.data[idx + 1]
                    ) {
                        const prev = pointSeries.data[idx - 1];
                        const next = pointSeries.data[idx + 1];
                        const prevCoords = prev.options.geometry.coordinates;
                        const nextCoords = next.options.geometry.coordinates;
                        lines.addPoint({
                            geometry: {
                                type: 'LineString',
                                coordinates: [
                                    prevCoords,
                                    nextCoords
                                ]
                            },
                            color: 'light-dark(#313f77, #fff)'
                        }, false);
                    }
                    e.point.remove(false, false);
                    chart.redraw(false);

                    // Play descending notes for removing a point
                    if (chart.sonification) {
                        chart.sonification.playNote('vibraphone', {
                            note: 'C2',
                            noteDuration: 150,
                            volume: 0.3
                        });
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

    setupAutoRotation(chart);
    return chart;
};

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

// Add flight route and gentle rotation after clicking the map
function addLinePoint(point, chart) {
    const pointSeries = chart.get('clicked-points');
    if (pointSeries.data && pointSeries.data.length > 0) {
        const lineSeries = chart.get('flight-route');
        const latestPoint = pointSeries.data[pointSeries.data.length - 1];
        lineSeries.addPoint({
            geometry: {
                type: 'LineString',
                coordinates: [
                    latestPoint.options.geometry.coordinates,
                    [point.lon, point.lat]
                ]
            },
            color: 'light-dark(#313f77, #fff)'
        }, false);
    }
    pointSeries.addPoint({
        name: point.point.name,
        geometry: {
            type: 'Point',
            coordinates: [point.lon, point.lat]
        }
    }, false);
    chart.redraw(false);

    // Play ascending notes for adding a point
    if (chart.sonification) {
        chart.sonification.playNote('vibraphone', {
            note: 'C3',
            noteDuration: 150,
            volume: 0.3
        });

    }
}

function setupAutoRotation(chart: Highcharts.MapChart): void {
    const rotationSpeed = 0.1 / 50,
        clouds = chart.get('clouds') as any,
        projectClouds = clouds.getProjectedImageData;
    let lastTimestamp: number | undefined,
        cloudRotation = 0;

    clouds.getProjectedImageData = function (mapView, ...args): any {
        const projection = mapView.projection,
            rotator = projection.rotator,
            rotation = projection.options.rotation;

        projection.rotator = projection.getRotator([
            rotation[0] + cloudRotation,
            rotation[1]
        ]);
        const imageData = projectClouds.call(this, mapView, ...args);
        projection.rotator = rotator;
        return imageData;
    };

    const rotate = (timestamp: number): void => {
        const elapsed = lastTimestamp === undefined ?
            0 : timestamp - lastTimestamp;
        const projectionOptions = chart.options.mapView.projection as
            Highcharts.MapViewProjectionOptions;

        lastTimestamp = timestamp;
        cloudRotation = (cloudRotation + elapsed * rotationSpeed * 0.15) % 360;
        chart.update({
            mapView: {
                projection: {
                    rotation: [
                        projectionOptions.rotation[0] +
                            (elapsed * rotationSpeed),
                        projectionOptions.rotation[1]
                    ]
                }
            }
        }, undefined, undefined, false);

        chart.rotationFrame = requestAnimationFrame(rotate);
    };

    const stopRotation = (): void => {
        if (chart.rotationFrame) {
            cancelAnimationFrame(chart.rotationFrame);
            chart.rotationFrame = void 0;
        }
    };

    const startRotation = (): void => {
        lastTimestamp = undefined;
        stopRotation();
        chart.rotationFrame = requestAnimationFrame(rotate);
    };

    const scheduleRotation = (delay = 5000): void => {
        if (chart.rotationTimer) {
            clearTimeout(chart.rotationTimer);
        }
        chart.rotationTimer = window.setTimeout(startRotation, delay);
    };

    const interactionHandler = (): void => {
        stopRotation();
        scheduleRotation();
    };

    const container = chart.container as HTMLElement;
    container.addEventListener('mouseover', interactionHandler);

    startRotation();
}

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
