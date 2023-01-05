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
                from: [45.1004152, 60.1975501],
                to: [20.1004152, 52.1975501]
            }, {
                from: {
                    lon: 25.1004152,
                    lat: 65.1975501
                },
                to: {
                    lon: 11.1004152,
                    lat: 60.1975501
                }
            }
            ]
        }]
    });
})();
