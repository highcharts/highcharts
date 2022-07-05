(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/historical/countries/no-2019/no-aa-all-2019.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-aa-928', 10], ['no-aa-914', 11], ['no-aa-911', 12],
        ['no-aa-912', 13], ['no-aa-940', 14], ['no-aa-901', 15],
        ['no-aa-906', 16], ['no-aa-929', 17], ['no-aa-904', 18],
        ['no-aa-919', 19], ['no-aa-941', 20], ['no-aa-926', 21],
        ['no-va-938', 22], ['no-aa-937', 23], ['no-aa-935', 24]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/no-2019/no-aa-all-2019.topo.json">Aust-Agder (2019)</a>'
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
