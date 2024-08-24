(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/gb/custom/uk-countries-and-crown-dep.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['gb-wls', 10], ['gb-sct', 11], ['gb-eng', 12], ['im', 13],
        ['gb-nir', 14], ['gg', 15], ['je', 16]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/gb/custom/uk-countries-and-crown-dep.topo.json">United Kingdom countries with the Crown Dependencies</a>'
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
