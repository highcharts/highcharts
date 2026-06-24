// Extend some types
declare namespace Highcharts {
    // Allow a custom property on the map chart
    interface MapChart {
        sea?: Highcharts.SVGElement;
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
) =>  Highcharts.mapChart('container', {
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
        text: '- and a popular flight route<br>Click and drag to rotate globe',
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
            rotation: [60, -30]
        }
    },

    colorAxis: {
        minColor: '#BFCFAD',
        maxColor: '#31784B',
        max: 800
    },

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
        nullColor: 'rgba(0, 0, 0, 0.05)',
        accessibility: {
            enabled: false
        },
        enableMouseTracking: false
    }, {
        data,
        joinBy: ['iso-a2', 'code'],
        name: 'Population density',
        states: {
            hover: {
                color: '#a4edba',
                borderColor: '#333333'
            }
        },
        dataLabels: {
            enabled: false,
            format: '{point.name}'
        },
        id: 'choropleth',
        accessibility: {
            exposeAsGroupOnly: true
        }
    }]
});

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

// Add flight route after initial animation of the main series
Highcharts.addEvent(Highcharts.Series, 'afterAnimate', function () {
    const chart = this.chart;

    if (this.options.id === 'choropleth') {
        chart.addSeries({
            type: 'mapline',
            name: 'Flight route, Amsterdam - Los Angeles',
            animation: false,
            id: 'flight-route',
            data: [{
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        [4.90, 53.38], // Amsterdam
                        [-118.24, 34.05] // Los Angeles
                    ]
                },
                color: '#313f77'
            }],
            lineWidth: 2,
            accessibility: {
                exposeAsGroupOnly: true
            }
        }, false);
        chart.addSeries({
            type: 'mappoint',
            animation: false,
            data: [{
                name: 'Amsterdam',
                geometry: {
                    type: 'Point',
                    coordinates: [4.90, 53.38]
                }
            }, {
                name: 'LA',
                geometry: {
                    type: 'Point',
                    coordinates: [-118.24, 34.05]
                }
            }],
            color: '#313f77',
            accessibility: {
                enabled: false
            }
        }, false);
        chart.redraw(false);
    }
});

// Render a circle filled with a radial gradient behind the globe to make it
// appear as the sea around the continents
Highcharts.addEvent(Highcharts.MapChart, 'render', function () {

    const graticule = this.get('graticule') as Highcharts.Series;

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
                        [0, 'light-dark(white, #258)'],
                        [1, 'light-dark(lightblue, #446)']
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
