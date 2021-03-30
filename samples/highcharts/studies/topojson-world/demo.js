// Get random data for this sample
function getRandomData(geojson) {
    return geojson.features.map(() => Math.round(Math.random() * 100));
}

function getGrid() {
    const data = [];

    // Meridians
    for (let x = -180; x <= 180; x += 15) {
        const path = [];
        for (let y = -85, i = 0; y <= 85; y += 5, i++) {
            path.push([
                i === 0 ? 'M' : 'L',
                x,
                y
            ]);
        }
        data.push({ path });
    }

    // Latitudes
    for (let y = -85; y <= 85; y += 15) {
        const path = [];
        for (let x = -180, i = 0; x <= 180; x += 5, i++) {
            path.push([
                i === 0 ? 'M' : 'L',
                x,
                y
            ]);
        }
        data.push({ path });
    }
    return data;
}

const static = {
    geojson: undefined,
    data: undefined
};

let chart;

const drawMap = projection => {

    const geojson = JSON.parse(static.geojson);

    // Remove Antarctica for some projections
    if (projection.indexOf('ortho') !== 0 && projection !== 'webmerc') {
        geojson.features.splice(
            geojson.features.findIndex(f => f.properties.name === 'Antarctica'),
            1
        );
    }

    // Apply projection using Proj4
    const crs = {
        miller: '+proj=mill +lat_0=0 +lon_0=0 +x_0=0 +y_0=0 +over',
        'ortho-africa': '+proj=ortho +lon_0=20 +lat_0=0 +x_0=0 +y_0=0',
        'ortho-antarctica': '+proj=ortho +lon_0=0 +lat_0=-90 +x_0=0 +y_0=0',
        'ortho-asia': '+proj=ortho +lat_0=40 +lon_0=90 +x_0=0 +y_0=0',
        'ortho-australia': '+proj=ortho +lat_0=-30 +lon_0=140 +x_0=0 +y_0=0',
        'ortho-europe': '+proj=ortho +lat_0=40 +lon_0=10 +x_0=0 +y_0=0',
        'ortho-north-america': '+proj=ortho +lat_0=45 +lon_0=-100 +x_0=0 +y_0=0',
        'ortho-south-america': '+proj=ortho +lat_0=-10 +lon_0=-60 +x_0=0 +y_0=0',
        robin: '+proj=robin +lon_0=0 +x_0=0 +y_0=0',
        webmerc: 'EPSG:3857'
    }[projection];

    // Initialize the chart
    if (!chart) {
        console.time('@mapChart');

        chart = Highcharts.mapChart('container', {
            chart: {
                map: geojson
            },

            title: {
                text: 'Projected TopoJSON'
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
                projection: {
                    crs
                }
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
                nullColor: '#f0f0f0'
            }, {
                data: static.data,
                joinBy: null,
                name: 'Random data',
                states: {
                    hover: {
                        color: '#a4edba'
                    }
                },
                dataLabels: {
                    enabled: false,
                    format: '{point.name}'
                }
            }]
        });
        console.timeEnd('@mapChart');


    } else {
        chart.update({
            mapView: {
                projection: {
                    crs
                }
            }
        });
    }

    document.querySelectorAll('.buttons button').forEach(btn =>
        btn.classList.remove('active')
    );
    document.querySelector(`.buttons #${projection}`).classList.add('active');
};

const enableButtons = () => {
    document.querySelectorAll('.buttons button').forEach(btn =>
        btn.addEventListener('click', e => drawMap(e.target.id))
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

        drawMap('webmerc');

        enableButtons();

    }
);
