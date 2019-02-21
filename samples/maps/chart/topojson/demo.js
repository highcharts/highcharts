// Project the data using Proj4
function project(geojson, projection) {
    const projectPolygon = coordinate => {
        coordinate.forEach((lonLat, i) => {
            coordinate[i] = window.proj4(projection, lonLat);
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

$.getJSON(
    // Map source: https://github.com/deldersveld/topojson/
    'https://cdn.jsdelivr.net/gh/deldersveld/topojson@master/countries/united-states/us-albers.json',
    function (topology) {

        // Convert the topoJSON feature into geoJSON
        const geojson = window.topojson.feature(
            topology,
            // For this demo, get the first of the named objects
            topology.objects[Object.keys(topology.objects)[0]]
        );
        const data = getRandomData(geojson);

        // Optionally project the data using Proj4. This costs performance, and
        // when possible, should be done on the server. In this case we're using
        // a Lambert Conformal Conic projection for the USA, with a projection
        // center in the middle of the country. A mercator based projection,
        // like 'EPSG:3857', is faster but is more distorted.
        project(
            geojson,
            '+proj=lcc +lat_1=33 +lat_2=45 +lat_0=39 +lon_0=-96'
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
                pointFormat: '{point.properties.name}: {point.value}'
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
                    format: '{point.properties.name}'
                }
            }]
        });
    }
);
