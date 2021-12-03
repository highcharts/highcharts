const libs = {
    d3: window.d3,
    proj4: window.proj4
};
delete window.d3;
delete window.proj4;

// Get random data for this sample
function getRandomData(geojson) {
    return geojson.features.map(() => Math.round(Math.random() * 100));
}

function getGraticule() {
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
}

const static = {
    geojson: undefined,
    data: undefined
};

let chart;

const drawMap = projectionKey => {

    const geojson = JSON.parse(static.geojson);

    // geojson.features = geojson.features.filter(f => f.properties.name === 'Antarctica');

    // Apply projection using Proj4
    const projection = Highcharts.merge({
        name: undefined,
        projString: undefined,
        rotation: [
            parseInt(document.getElementById('rotation-lambda').value, 10),
            parseInt(document.getElementById('rotation-phi').value, 10),
            parseInt(document.getElementById('rotation-gamma').value, 10)
        ]
    }, {
        /*
        'gall-peters': {
            name: 'cea',
            lon0: 0,
            latTS: 45
        },
        eqc: {
            name: 'eqc'
        },
        */
        equalearth: {
            name: 'EqualEarth'
        },
        lcc: {
            name: 'LambertConformalConic',
            parallels: [-30, -40]
        },
        miller: {
            name: 'Miller'
        },
        'ortho-africa': {
            name: 'Orthographic',
            rotation: [-15, 0]
        },
        'ortho-antarctica': {
            name: 'Orthographic',
            rotation: [0, 90]
        },
        'ortho-asia': {
            name: 'Orthographic',
            rotation: [-90, -40]
        },
        'ortho-australia': {
            name: 'Orthographic',
            rotation: [-140, 30]
        },
        'ortho-europe': {
            name: 'Orthographic',
            rotation: [-15, -40]
        },
        'ortho-north-america': {
            name: 'Orthographic',
            rotation: [100, -45]
        },
        'ortho-south-america': {
            name: 'Orthographic',
            rotation: [60, 10]
        },
        /*
        robin: {
            name: 'robin'
        },
        */
        webmerc: {
            name: 'WebMercator'
        }
    }[projectionKey] || {});

    // Initialize the chart
    if (!chart) {


        // projection.proj4 = libs.proj4;
        // projection.d3 = libs.d3;

        console.time('@mapChart');

        chart = Highcharts.mapChart('container', {
            chart: {
                map: geojson
            },

            title: {
                text: 'Highcharts projection study',
                floating: true,
                align: 'left',
                style: {
                    textOutline: '2px white'
                }
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
                projection
                /*
                projection: {
                    name: 'WebMercator'
                },
                zoom: 4,
                center: [6.5, 61]
                */
            },

            colorAxis: {
                tickPixelInterval: 100,
                minColor: '#F1EEF6',
                maxColor: '#900037'
            },

            tooltip: {
                pointFormat: '{point.name}: {point.value}'
            },

            series: [{
                name: 'Graticule',
                type: 'mapline',
                data: getGraticule(),
                nullColor: '#e8e8e8',
                color: '#e8e8e8'
            },
            /*
            {
                type: 'mapline',
                data: [{
                    type: 'LineString',
                    coordinates: [
                        [120, 30],
                        [-120, 30]
                    ],
                    name: 'MapLine'

                }],
                color: 'blue'

            },
            // */

            //*
            {
                data: static.data,
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
            }, {
                type: 'mapline',
                data: [{
                    geometry: {
                        type: 'LineString',
                        coordinates: [
                            [4.90, 53.38], // Amsterdam
                            [-118.24, 34.05] // Los Angeles
                        ]
                    },
                    color: '#3030d0'
                }],
                lineWidth: 2
            }, {
                type: 'mappoint',
                data: [{
                    geometry: {
                        type: 'Point',
                        coordinates: [4.90, 53.38]
                    },
                    name: 'Amsterdam'
                }, {
                    geometry: {
                        type: 'Point',
                        coordinates: [-118.24, 34.05]
                    },
                    name: 'LA'
                }],
                color: '#3030d0'
            }
            //*/
            ]
        });
        console.timeEnd('@mapChart');

        /*
        setTimeout(function () {
            chart.mapView.setView([4.90, 53.38], 4);
            console.log(chart.mapView.center, chart.mapView.zoom)
        }, 1200);
        */

    /* else if (
        projection.name === 'ortho' &&
        chart.mapView.projection.options.name === 'ortho'
    ) {
        let lon0 = chart.mapView.projection.options.lon0,
            lat0 = chart.mapView.projection.options.lat0;
        const toLon0 = projection.lon0,
            toLat0 = projection.lat0;

        const steps = 10;
        const stepLon = (lon0 - toLon0) / steps;
        const stepLat = (lat0 - toLat0) / steps;

        for (let i = 0; i < steps; i++) {
            setTimeout(() => {
                lon0 -= stepLon;
                lat0 -= stepLat;
                chart.update({
                    mapView: {
                        projection: {
                            lon0,
                            lat0
                        }
                    }
                }, undefined, undefined, false);
            }, i * 25);
        }

    } */
    } else {
        chart.update({
            mapView: {
                projection
            }
        });

        /*
        if (projectionKey === 'ortho-europe') {
            let lon0 = projection.lon0;
            setInterval(() => {
                lon0 += 0.5;
                projection.lon0 = lon0;
                chart.update({
                    mapView: {
                        projection
                    }
                });
            }, 25);
        }
        */
    }

    document.querySelectorAll('#projection-buttons button').forEach(btn =>
        btn.classList.remove('active')
    );
    document.querySelector(`#projection-buttons #${projectionKey}`).classList.add('active');
};

function setLibrary(btnId) {
    const projection = {
        'btn-d3': {
            d3: libs.d3,
            proj4: undefined
        },
        'btn-proj4': {
            d3: undefined,
            proj4: libs.proj4
        }
    }[btnId];
    chart.update({
        mapView: {
            projection
        }
    });

    document.querySelectorAll('#library-buttons button').forEach(btn =>
        btn.classList.remove('active')
    );
    document.querySelector(`#library-buttons #${btnId}`).classList.add('active');
}

const enableInputs = () => {
    document.querySelectorAll('#projection-buttons button').forEach(btn =>
        btn.addEventListener('click', e => drawMap(e.target.id))
    );
    document.querySelectorAll('#library-buttons button').forEach(btn =>
        btn.addEventListener('click', e => setLibrary(e.target.id))
    );
    document.querySelectorAll('.rotation').forEach(input => {
        input.addEventListener('input', () => {
            const lambda = document.getElementById('rotation-lambda').value;
            const phi = document.getElementById('rotation-phi').value;
            const gamma = document.getElementById('rotation-gamma').value;
            document.getElementById('rotation-lambda-output')
                .innerText = lambda;
            document.getElementById('rotation-phi-output').innerText = phi;
            document.getElementById('rotation-gamma-output').innerText = gamma;

            const rotation = chart.mapView.projection.options.rotation ||
                [0, 0];
            rotation[0] = parseInt(lambda, 10);
            rotation[1] = parseInt(phi, 10);
            rotation[2] = parseInt(gamma, 10);
            chart.mapView.update({
                projection: {
                    rotation
                }
            }, true, false);
        });
    });
};

Highcharts.getJSON(
    'https://cdn.jsdelivr.net/gh/highcharts/highcharts@2e11000c966a20f08afc4e0927b91df99821de99/samples/data/world-countries.topo.json',
    topology => {

        // Convert the topoJSON feature into geoJSON
        const geojson = window.topojson.feature(
            topology,
            // For this demo, get the first of the named objects
            topology.objects[Object.keys(topology.objects)[0]]
        );
        geojson.copyrightUrl = topology.copyrightUrl;
        geojson.copyrightShort = topology.copyrightShort;

        const data = getRandomData(geojson);

        static.geojson = JSON.stringify(geojson);
        static.data = data;

        drawMap('equalearth');

        enableInputs();

    }
);
