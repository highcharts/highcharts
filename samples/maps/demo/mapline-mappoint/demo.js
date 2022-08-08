(async () => {

    const geojson = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/australia.geo.json'
    ).then(response => response.json());

    // Prepare the geojson
    const states = Highcharts.geojson(geojson, 'map'),
        rivers = Highcharts.geojson(geojson, 'mapline'),
        cities = Highcharts.geojson(geojson, 'mappoint'),
        specialCityLabels = {
            Melbourne: {
                align: 'right'
            },
            Canberra: {
                align: 'right',
                y: -5
            },
            Wollongong: {
                y: 5
            },
            Brisbane: {
                y: -5
            }
        };

    // Skip or move some labels to avoid collision
    states.forEach(state => {
        // Disable data labels
        if (state.properties.code_hasc === 'AU.CT' || state.properties.code_hasc === 'AU.JB') {
            state.dataLabels = {
                enabled: false
            };
        }
        if (state.properties.code_hasc === 'AU.TS') {
            state.dataLabels = {
                style: {
                    color: '#333333'
                }
            };
        }
        // Move center for data label
        if (state.properties.code_hasc === 'AU.SA') {
            state.middleY = 0.3;
        }
        if (state.properties.code_hasc === 'AU.QL') {
            state.middleY = 0.7;
        }
    });

    cities.forEach(city => {
        if (specialCityLabels[city.name]) {
            city.dataLabels = specialCityLabels[city.name];
        }
    });

    // Initialize the chart
    Highcharts.mapChart('container', {
        title: {
            text: 'Map with multiple geometry types'
        },

        accessibility: {
            point: {
                valueDescriptionFormat: '{xDescription}.'
            },
            description: 'Map of Australia, showing examples of multiple geometry types in Highcharts Maps: Map areas (used for regions), map lines (used for rivers), and map points (used for cities).'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        series: [{
            name: 'States and territories',
            data: states,
            color: Highcharts.color(Highcharts.getOptions().colors[2])
                .setOpacity(0.75)
                .get(),
            states: {
                hover: {
                    color: Highcharts.getOptions().colors[4]
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}',
                style: {
                    width: '80px', // force line-wrap
                    textTransform: 'uppercase',
                    fontWeight: 'normal',
                    textOutline: 'none',
                    color: '#888'
                }
            },
            tooltip: {
                pointFormat: '{point.name}'
            }
        }, {
            name: 'Rivers',
            type: 'mapline',
            data: rivers,
            states: {
                hover: {
                    lineWidth: 3
                }
            },
            color: Highcharts.getOptions().colors[0],
            tooltip: {
                pointFormat: '{point.properties.NAME}'
            }
        }, {
            name: 'Cities',
            type: 'mappoint',
            data: cities,
            color: 'black',
            marker: {
                radius: 2
            },
            dataLabels: {
                align: 'left',
                verticalAlign: 'middle'
            },
            animation: false,
            tooltip: {
                pointFormat: '{point.name}'
            }
        }]
    });

})();
