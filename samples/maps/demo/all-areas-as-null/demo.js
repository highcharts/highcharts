(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/europe.topo.json'
    ).then(response => response.json());

    // Instantiate the map
    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'Nordic countries',
            align: 'left'
        },

        subtitle: {
            text: 'Demo of drawing all areas in the map, only highlighting partial data',
            align: 'left'
        },

        accessibility: {
            typeDescription: 'Map of Europe.',
            point: {
                describeNull: false
            }
        },

        legend: {
            enabled: false
        },

        series: [{
            name: 'Country',
            data: [
                ['is', 1],
                ['no', 1],
                ['se', 1],
                ['dk', 1],
                ['fi', 1]
            ],
            dataLabels: {
                enabled: true,
                color: '#FFFFFF',
                format: '{point.name}',
                nullFormat: ''
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '{point.name}'
            }
        }]
    });

})();
