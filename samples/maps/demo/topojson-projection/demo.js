// Get random data for this sample
const getRandomData = geojson => geojson.features.map((f, i) => i % 5);

function getGraticule() {
    const data = [];

    // Meridians
    for (let x = -180; x <= 180; x += 15) {
        data.push({
            type: 'LineString',
            coordinates: x % 90 === 0 ? [
                [x, -90],
                [x, 0],
                [x, 90]
            ] : [
                [x, -80],
                [x, 80]
            ]
        });
    }

    // Latitudes
    for (let y = -90; y <= 90; y += 10) {
        const coordinates = [];
        for (let x = -180; x <= 180; x += 5) {
            coordinates.push([x, y]);
        }
        data.push({
            type: 'LineString',
            coordinates,
            lineWidth: y === 0 ? 2 : undefined
        });
    }

    return data;
}


Highcharts.getJSON(
    'https://rawgit.com/deldersveld/topojson/master/world-countries.json',
    function (topology) {

        // Convert the topoJSON feature into geoJSON
        const geojson = window.topojson.feature(
            topology,
            // For this demo, get the first of the named objects
            topology.objects[Object.keys(topology.objects)[0]]
        );
        geojson.copyrightUrl = 'https://github.com/deldersveld/topojson';
        geojson.copyrightShort = 'TopoJSON Collection';

        const data = getRandomData(geojson);

        const chart = Highcharts.mapChart('container', {
            chart: {
                map: geojson
            },

            title: {
                text: 'Highcharts topoJSON',
                floating: true,
                align: 'left',
                style: {
                    textOutline: '2px white'
                }
            },

            subtitle: {
                text: 'Click and drag to rotate globe',
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
                    projectionName: 'Orthographic',
                    rotation: [60, -30]
                }
            },

            colorAxis: {
                tickPixelInterval: 100,
                minColor: '#BFCFAD',
                maxColor: '#31784B'
            },

            tooltip: {
                pointFormat: '{point.name}: {point.value}'
            },

            plotOptions: {
                series: {
                    animation: true
                }
            },

            series: [{
                name: 'Graticule',
                id: 'graticule',
                type: 'mapline',
                data: getGraticule(),
                nullColor: 'rgba(0, 0, 0, 0.05)'
            }, {
                data,
                joinBy: null,
                name: 'Random data',
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
                clip: false
            }]
        });

        // Add flight route after initial animation
        setTimeout(() => {
            chart.addSeries({
                type: 'mapline',
                animation: false,
                data: [{
                    type: 'LineString',
                    coordinates: [
                        [4.90, 53.38], // Amsterdam
                        [-118.24, 34.05] // Los Angeles
                    ],
                    color: '#3030d0'
                }],
                lineWidth: 2
            }, false);
            chart.addSeries({
                type: 'mappoint',
                animation: false,
                data: [{
                    type: 'Point',
                    name: 'Amsterdam',
                    coordinates: [4.90, 53.38]
                }, {
                    type: 'Point',
                    name: 'LA',
                    coordinates: [-118.24, 34.05]
                }],
                color: '#3030d0'
            }, false);
            chart.redraw(false);
        }, 1000);

        // Render a circle filled with a radial gradient behind the globe to
        // make it appear as the sea around the continents
        const renderSea = () => {
            let verb = 'animate';
            if (!chart.sea) {
                chart.sea = chart.renderer
                    .circle()
                    .attr({
                        fill: {
                            radialGradient: {
                                cx: 0.4,
                                cy: 0.4,
                                r: 1
                            },
                            stops: [
                                [0, 'white'],
                                [1, 'lightblue']
                            ]
                        },
                        zIndex: -1
                    })
                    .add(chart.get('graticule').group);
                verb = 'attr';
            }
            const zoomScale =  Math.pow(2, chart.mapView.zoom) /
                Math.pow(2, chart.mapView.minZoom);

            chart.sea[verb]({
                cx: chart.plotWidth / 2,
                cy: chart.plotHeight / 2,
                r: Math.min(chart.plotWidth, chart.plotHeight) * zoomScale / 2
            });
        };
        renderSea();
        Highcharts.addEvent(chart, 'redraw', renderSea);

    }
);
