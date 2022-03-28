(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/historical/countries/no-2019/no-fi-all-2019.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-fi-2002', 10], ['no-fi-2019', 11], ['no-fi-2030', 12],
        ['no-fi-2018', 13], ['no-fi-2014', 14], ['no-fi-2020', 15],
        ['no-fi-2015', 16], ['no-fi-2017', 17], ['no-tr-2012', 18],
        ['no-fi-2004', 19], ['no-fi-2027', 20], ['no-fi-2025', 21],
        ['no-fi-2011', 22], ['no-fi-2022', 23], ['no-fi-2024', 24],
        ['no-fi-2021', 25], ['no-fi-2023', 26], ['no-fi-2028', 27],
        ['no-fi-2003', 28]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/no-2019/no-fi-all-2019.topo.json">Finnmark (2019)</a>'
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
