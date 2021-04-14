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

function getGrid() {
    const data = [];

    // Meridians
    for (let x = -180; x <= 180; x += 15) {
        data.push({
            type: 'LineString',
            coordinates: [
                [x, x % 90 === 0 ? -90 : -80],
                [x, 0],
                [x, x % 90 === 0 ? 90 : 80]
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

    // Apply projection using Proj4
    const projection = Highcharts.merge({
        projectionName: undefined,
        projString: undefined,
        lat0: undefined,
        lon0: undefined,
        over: undefined,
        x0: undefined,
        y0: undefined
    }, {
        eqc: {
            projectionName: 'eqc'
        },
        miller: {
            projectionName: 'mill',
            over: true
        },
        'ortho-africa': {
            projectionName: 'ortho'
        },
        'ortho-antarctica': {
            projectionName: 'ortho',
            lat0: -90
        },
        'ortho-asia': {
            projectionName: 'ortho',
            lat0: 40,
            lon0: 90
        },
        'ortho-australia': {
            projectionName: 'ortho',
            lat0: -30,
            lon0: 140
        },
        'ortho-europe': {
            projectionName: 'ortho',
            lat0: 40,
            lon0: 10
        },
        'ortho-north-america': {
            projectionName: 'ortho',
            lat0: 45,
            lon0: -100
        },
        'ortho-south-america': {
            projectionName: 'ortho',
            lat0: -10,
            lon0: -60
        },
        robin: {
            projectionName: 'robin'
        },
        webmerc: {
            projString: 'EPSG:3857'
        }
    }[projectionKey] || {});

    // Initialize the chart
    if (!chart) {


        projection.proj4 = libs.proj4;

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
                /*
                center: [4.90, 53.38],
                zoom: 4,
                projection: {
                    projectionName: 'robin',
                    proj4: libs.proj4
                }
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
                name: 'Grid',
                type: 'mapline',
                data: getGrid(),
                nullColor: '#e8e8e8'
            }, {
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
            }]
        });
        console.timeEnd('@mapChart');

        /*
        setTimeout(function () {
            chart.mapView.setView([4.90, 53.38], 4);
            console.log(chart.mapView.center, chart.mapView.zoom)
        }, 1200);
        */

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

const enableButtons = () => {
    document.querySelectorAll('#projection-buttons button').forEach(btn =>
        btn.addEventListener('click', e => drawMap(e.target.id))
    );
    document.querySelectorAll('#library-buttons button').forEach(btn =>
        btn.addEventListener('click', e => setLibrary(e.target.id))
    );
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

        drawMap('robin');

        enableButtons();

    }
);
