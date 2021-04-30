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
        projectionName: undefined,
        projString: undefined,
        lat0: undefined,
        latTS: undefined,
        lon0: parseInt(document.getElementById('lon0').value, 10),
        over: undefined,
        x0: undefined,
        y0: undefined
    }, {
        'gall-peters': {
            projectionName: 'cea',
            lon0: 0,
            latTS: 45
        },
        eqc: {
            projectionName: 'eqc'
        },
        equalearth: {
            projectionName: 'EqualEarth'
        },
        miller: {
            projectionName: 'Miller'
        },
        'ortho-africa': {
            projectionName: 'Orthographic',
            lon0: 15
        },
        'ortho-antarctica': {
            projectionName: 'Orthographic',
            lat0: -90
        },
        'ortho-asia': {
            projectionName: 'Orthographic',
            lat0: 40,
            lon0: 90
        },
        'ortho-australia': {
            projectionName: 'Orthographic',
            lat0: -30,
            lon0: 140
        },
        'ortho-europe': {
            projectionName: 'Orthographic',
            lat0: 40,
            lon0: 15
        },
        'ortho-north-america': {
            projectionName: 'Orthographic',
            lat0: 45,
            lon0: -100
        },
        'ortho-south-america': {
            projectionName: 'Orthographic',
            lat0: -10,
            lon0: -60
        },
        robin: {
            projectionName: 'robin'
        },
        webmerc: {
            projectionName: 'WebMercator'
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
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },

            mapView: {
                projection
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
                    type: 'LineString',
                    coordinates: [
                        [4.90, 53.38], // Amsterdam
                        [-118.24, 34.05] // Los Angeles
                    ],
                    color: '#3030d0'
                }],
                lineWidth: 2
            }, {
                type: 'mappoint',
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
        projection.projectionName === 'ortho' &&
        chart.mapView.projection.options.projectionName === 'ortho'
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
    document.querySelector('#lon0').addEventListener('input', e => {
        document.getElementById('lon0-output').innerText = e.target.value;
        chart.mapView.update({
            projection: {
                lon0: parseInt(e.target.value, 10)
            }
        }, true, false);
    });
};

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

        static.geojson = JSON.stringify(geojson);
        static.data = data;

        drawMap('equalearth');

        enableInputs();

    }
);
