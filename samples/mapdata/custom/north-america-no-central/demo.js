(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/north-america-no-central.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['gl', 10], ['lc', 11], ['um', 12], ['us', 13], ['vi', 14], ['ca', 15],
        ['cu', 16], ['kn', 17], ['gd', 18], ['dm', 19], ['ag', 20], ['tt', 21],
        ['sw', 22], ['bb', 23], ['jm', 24], ['bu', 25], ['bs', 26], ['vc', 27],
        ['ht', 28], ['do', 29], ['mx', 30], ['pr', 31]
    ];

    // Create the chart
    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'Highcharts Maps basic demo'
        },

        subtitle: {
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/north-america-no-central.topo.json">North America without central</a>'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 0
        },

        series: [{
            data: data,
            name: 'Random data',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });

})();
