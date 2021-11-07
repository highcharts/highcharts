Highcharts.getJSON(
    'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json',
    // 'https://code.highcharts.com/mapdata/countries/no/no-all.topo.json',
    topology => {

        // Create a dummy data value for each geometry
        const data = topology.objects.default.geometries.map((f, i) => i % 5);

        // Initialize the chart
        Highcharts.mapChart('container', {
            chart: {
                map: topology
            },

            title: {
                text: 'TopoJSON in Highcharts Maps'
            },

            mapView: {
                projection: {
                    name: 'LambertConformalConic',
                    parallels: [33, 45],
                    rotation: [96]
                },

                //--- Schema for insets ---

                // Generic options for insets (like annotations.labelOptions and
                // shapeOptions)
                insetOptions: {
                    borderColor: '',
                    borderWidth: 1,
                    padding: '5%',
                    units: 'percent' // 'pixels' | 'percent'
                },

                // The collection of insets. Consider an object with named
                // children in order to make merging easier. Each item inherits
                // from `insetOptions`.
                insets: [{

                    borderColor: '',

                    // Path for the rendered border, subject to units. Defaults
                    // to the outline of the `extentPolygon`.
                    borderPath: [
                        ['M', 0, 80],
                        ['L', 20, 80],
                        ['L', 20, 100]
                    ],

                    borderWidth: 1,

                    // What coordinates to render in the center of the bounding
                    // box. Defaults to the center of the planar projection.
                    center: void 0,

                    // Geometries within this rectangle are removed from the
                    // default map view and rendered in the inset.
                    geoBounds: [/* lon1, lat1, lon2, lat2 */],

                    // Optionally ties in features/geometries
                    id: 'us-all-alaska',

                    // Padding inside the frame, like mapView.padding
                    padding: 0,

                    // Placement of the inset in the map, a polygon subject to
                    // units
                    extentPolygon: [
                        [0, 80],
                        [20, 80],
                        [20, 100],
                        [0, 100]
                    ],

                    // Projection to use within the inset, defaults to best
                    // guess based on geo bounds
                    projection: {},

                    units: 'percent', // 'pixels' | 'percent'

                    // Auto fitted to the bounding box
                    zoom: void 0
                }]
            },

            colorAxis: {
                tickPixelInterval: 100,
                minColor: '#F1EEF6',
                maxColor: '#900037'
            },

            series: [{
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
                    format: '{point.name}'
                }
            }, {
                mapData: Object.values(topology.objects
                    .default['hc-recommended-transform']),
                type: 'mapline',
                nullColor: 'blue'
            }]
        });
    }
);
