(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/europe.topo.json'
    ).then(response => response.json());

    // Instantiate the map
    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        exporting: {
            fallbackToExportServer: false
        },

        title: {
            text: 'Europe time zones'
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
            enabled: true
        },

        plotOptions: {
            map: {
                joinBy: ['iso-a2', 'code']
            }
        },

        series: [{
            name: 'UTC',
            data: ['IE', 'IS', 'GB', 'PT'].map(code => ({ code }))
        }]
    });

})();