(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/no/custom/no-all-svalbard-and-jan-mayen.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-vl-46', 10], ['no-mr-15', 11], ['no-ag-42', 12], ['no-no-18', 13],
        ['no-vi-30', 14], ['no-ro-11', 15], ['no-tf-54', 16], ['no-td-50', 17],
        ['no-os-0301', 18], ['no-vt-38', 19], ['no-in-34', 20], ['no-sv', 21],
        ['no-sj', 22]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/custom/no-all-svalbard-and-jan-mayen.topo.json">Norway with Svalbard and Jan Mayen</a>'
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
