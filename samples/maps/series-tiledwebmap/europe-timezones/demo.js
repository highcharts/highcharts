(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/europe.topo.json'
    ).then(response => response.json());

    const { colors } = Highcharts.getOptions();

    // Instantiate the map
    Highcharts.mapChart('container', {
        chart: {
            type: 'mapline',
            margin: 0
        },

        title: {
            text: ''
        },

        accessibility: {
            series: {
                descriptionFormat: 'Timezone {series.name} with {series.points.length} countries.'
            },
            point: {
                valueDescriptionFormat: '{point.name}.'
            }
        },

        navigation: {
            buttonOptions: {
                align: 'left',
                theme: {
                    stroke: '#e6e6e6'
                }
            }
        },

        legend: {
            align: 'left',
            layout: 'vertical',
            backgroundColor: '#ffffffdd',
            borderRadius: 2
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                alignTo: 'spacingBox'
            }
        },

        plotOptions: {
            mapline: {
                joinBy: ['iso-a2', 'code'],
                fillColor: 'transparent',
                dataLabels: {
                    enabled: true,
                    color: '#FFFFFF',
                    style: {
                        fontWeight: 'bold'
                    },
                    format: '{point.properties.iso-a2}'
                },
                tooltip: {
                    headerFormat: '',
                    pointFormat: '{point.name}: <b>{series.name}</b>'
                },
                states: {
                    hover: {
                        lineWidth: 5
                    }
                }
            }
        },

        series: [{
            type: 'tiledwebmap',
            showInLegend: false,
            provider: {
                type: 'USGS',
                theme: 'USImagery'
            }
        }, {
            color: colors[0],
            name: 'UTC',
            data: Highcharts.geojson(topology).filter(el =>
                ['IE', 'IS', 'GB', 'PT'].includes(el.properties['iso-a2']))
        }, {
            name: 'UTC + 1',
            color: colors[2],
            data: Highcharts.geojson(topology).filter(el => [
                'NO', 'SE', 'DK', 'DE', 'NL', 'BE', 'LU', 'ES', 'FR', 'PL',
                'CZ', 'AT', 'CH', 'LI', 'SK', 'HU', 'SI', 'IT', 'SM', 'HR',
                'BA', 'YF', 'ME', 'AL', 'MK'
            ].includes(el.properties['iso-a2']))
        }, {
            name: 'UTC + 2',
            color: colors[3],
            data: Highcharts.geojson(topology).filter(el => [
                'FI', 'EE', 'LV', 'LT', 'BY', 'UA', 'MD', 'RO', 'BG', 'GR',
                'TR', 'CY'
            ].includes(el.properties['iso-a2']))
        }]
    });

})();
