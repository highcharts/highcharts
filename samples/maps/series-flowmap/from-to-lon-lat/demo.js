(async () => {
    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/europe.topo.json'
    ).then(response => response.json());

    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'Flowmap point using lonlat coordinates'
        },

        mapNavigation: {
            enabled: true
        },

        series: [{
            name: 'Basemap',
            showInLegend: false,
            states: {
                inactive: {
                    enabled: false
                }
            }
        }, {
            type: 'flowmap',
            name: 'FlowMap Series',
            accessibility: {
                point: {
                    valueDescriptionFormat:
                        'Origin: {point.options.from}, Destination: {point.options.to}.'
                },
                description:
                    'This is a map using coordinates directly.'
            },
            growTowards: true,
            weight: 1,
            data: [{
                from: {
                    lon: 20.97,
                    lat: 52.17
                },
                to: {
                    lon: -6.24,
                    lat: 53.43
                }
            },
            {
                from: [20.97, 52.17],
                to: [11.1, 60.2]
            }]
        }]
    });
})();
