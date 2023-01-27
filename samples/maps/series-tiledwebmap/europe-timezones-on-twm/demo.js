(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/europe.topo.json'
    ).then(response => response.json());

    const { colors } = Highcharts.getOptions();

    // Instantiate the map
    Highcharts.mapChart('container', {
        chart: {
            map: topology,
            spacingBottom: 20
        },

        title: {
            text: 'Europe time zones on TiledWebMap'
        },

        accessibility: {
            series: {
                descriptionFormat: 'Timezone {series.name} with {series.points.length} countries.'
            },
            point: {
                valueDescriptionFormat: '{point.name}.'
            }
        },

        legend: {
            enabled: false
        },

        mapNavigation: {
            enabled: true
        },

        plotOptions: {
            map: {
                allAreas: false,
                joinBy: ['iso-a2', 'code'],
                color: 'transparent',
                dataLabels: {
                    enabled: true,
                    color: '#FFFFFF',
                    style: {
                        fontWeight: 'bold'
                    },
                    // Only show dataLabels for areas with high label rank
                    format: null,
                    formatter: function () {
                        if (
                            this.point.properties &&
                            this.point.properties.labelrank.toString() < 5
                        ) {
                            return this.point.properties['iso-a2'];
                        }
                    }
                },
                tooltip: {
                    headerFormat: '',
                    pointFormat: '{point.name}: <b>{series.name}</b>'
                },
                states: {
                    hover: {
                        borderWidth: 5
                    }
                }
            }
        },

        series: [{
            type: 'tiledwebmap',
            provider: {
                type: 'Gaode',
                theme: 'satelite'
            }
        }, {
            borderColor: colors[0],
            name: 'UTC',
            data: ['IE', 'IS', 'GB', 'PT'].map(code => ({
                code
            }))
        }, {
            name: 'UTC + 1',
            borderColor: colors[2],
            data: [
                'NO', 'SE', 'DK', 'DE', 'NL', 'BE', 'LU', 'ES', 'FR', 'PL',
                'CZ', 'AT', 'CH', 'LI', 'SK', 'HU', 'SI', 'IT', 'SM', 'HR',
                'BA', 'YF', 'ME', 'AL', 'MK'
            ].map(code => ({
                code
            }))
        }, {
            name: 'UTC + 2',
            borderColor: colors[3],
            data: [
                'FI', 'EE', 'LV', 'LT', 'BY', 'UA', 'MD', 'RO', 'BG', 'GR',
                'TR', 'CY'
            ].map(code => ({
                code
            }))
        }]
    });

})();
