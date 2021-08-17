// Project the data using Proj4
function project(geojson, projection) {
    const p = window.proj4(projection);
    const projectPolygon = coordinate => {
        coordinate.forEach((lonLat, i) => {
            coordinate[i] = p.forward(lonLat);
        });
    };
    geojson.features.forEach(function (feature) {
        if (feature.geometry.type === 'Polygon') {
            feature.geometry.coordinates.forEach(projectPolygon);
        } else if (feature.geometry.type === 'MultiPolygon') {
            feature.geometry.coordinates.forEach(items => {
                items.forEach(projectPolygon);
            });
        }
    });
}

// Get random data for this sample
function getRandomData(geojson) {
    return geojson.features.map(() => Math.round(Math.random() * 100));
}

// Source: https://github.com/leakyMirror/map-of-europe
Highcharts.getJSON(
    'https://cdn.jsdelivr.net/gh/highcharts/highcharts@06382af96d/samples/data/europe.topo.json',
    function (topology) {

        // Convert the topoJSON feature into geoJSON
        const geojson = window.topojson.feature(
            topology,
            // For this demo, get the first of the named objects
            topology.objects[Object.keys(topology.objects)[0]]
        );
        geojson.copyrightUrl = 'https://github.com/leakyMirror/map-of-europe';
        geojson.copyrightShort = 'leakyMirror';

        const data = getRandomData(geojson);

        // Optionally project the data using Proj4. This costs performance, and
        // when performance is crucial, should be done on the server. In this
        // case we're using a Lambert Conformal Conic projection for Europe,
        // with a projection center in the middle of the map.
        project(
            geojson,
            '+proj=lcc +lat_1=43 +lat_2=62 +lat_0=30 +lon_0=10'
        );

        // Initialize the chart
        Highcharts.mapChart('container', {
            chart: {
                map: geojson
            },

            title: {
                text: 'TopoJSON in Highmaps'
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },

            colorAxis: {
                tickPixelInterval: 100,
                minColor: '#F1EEF6',
                maxColor: '#900037'
            },

            tooltip: {
                pointFormat: '{point.properties.NAME}: {point.value}'
            },

            series: [{
                data: data,
                joinBy: null,
                name: 'Random data',
                states: {
                    hover: {
                        color: '#a4edba'
                    }
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.properties.NAME}'
                }
            }]
        });
    }
);
