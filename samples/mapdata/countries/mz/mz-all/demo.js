(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/mz/mz-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['mz-nm', 10], ['mz-in', 11], ['mz-mp', 12], ['mz-za', 13],
        ['mz-7278', 14], ['mz-te', 15], ['mz-mn', 16], ['mz-cd', 17],
        ['mz-ns', 18], ['mz-ga', 19], ['mz-so', 20]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/mz/mz-all.topo.json">Mozambique</a>'
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
