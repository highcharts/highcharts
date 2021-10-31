// Source: https://github.com/leakyMirror/map-of-europe
Highcharts.getJSON(
    'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v9.2.0/samples/data/europe.topo.json',
    (topology) => {
        // Convert the topoJSON feature into geoJSON
        const geojson = window.topojson.feature(
            topology,
            // For this demo, get the first of the named objects
            topology.objects[Object.keys(topology.objects)[0]]
        );
        geojson.copyrightUrl = 'https://github.com/leakyMirror/map-of-europe';
        geojson.copyrightShort = 'leakyMirror';

        // Create a dummy data value for each feature
        const data = geojson.features.map((f, i) => i % 5);

        // Initialize the chart
        Highcharts.mapChart('container', {
            chart: {
                map: geojson
            },

            title: {
                text: 'TopoJSON in Highcharts Maps'
            },

            mapView: {
                projection: {
                    name: 'Orthographic',
                    rotation: [-15, -40]
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

            series: [
                {
                    data,
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
                }
            ]
        });
    }
);
