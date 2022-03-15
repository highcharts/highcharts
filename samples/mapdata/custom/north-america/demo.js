(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/north-america.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['gl', 10], ['lc', 11], ['um', 12], ['us', 13], ['vi', 14], ['ca', 15],
        ['cu', 16], ['kn', 17], ['ni', 18], ['gd', 19], ['dm', 20], ['ag', 21],
        ['tt', 22], ['sw', 23], ['bb', 24], ['jm', 25], ['bu', 26], ['bs', 27],
        ['vc', 28], ['ht', 29], ['sv', 30], ['hn', 31], ['do', 32], ['mx', 33],
        ['bz', 34], ['gt', 35], ['cr', 36], ['pr', 37], ['pa', 38]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/north-america.topo.json">North America</a>'
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
