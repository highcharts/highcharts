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
            growTowards: true,
            weight: 1,
            data: [{
                from: {
                    lat: 52.169192,
                    lon: 20.973514
                },
                to: {
                    lat: 53.42801115,
                    lon: -6.240388650000005
                }
            },
            {
                from: [20.973514, 52.169192],
                to: [11.1004152, 60.1975501]
            }]
        }]
    });
})();
