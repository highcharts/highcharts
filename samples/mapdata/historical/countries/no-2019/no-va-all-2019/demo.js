(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/historical/countries/no-2019/no-va-all-2019.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-va-1004', 10], ['no-va-1001', 11], ['no-va-1014', 12],
        ['no-va-1032', 13], ['no-va-1037', 14], ['no-va-1046', 15],
        ['no-va-1034', 16], ['no-va-1003', 17], ['no-va-1027', 18],
        ['no-va-1026', 19], ['no-va-1021', 20], ['no-va-1018', 21],
        ['no-va-1002', 22], ['no-va-1017', 23], ['no-va-1029', 24]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/no-2019/no-va-all-2019.topo.json">Vest-Agder (2019)</a>'
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
