(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/kr/kr-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['kr-4194', 10], ['kr-kg', 11], ['kr-cb', 12], ['kr-kn', 13],
        ['kr-2685', 14], ['kr-pu', 15], ['kr-2688', 16], ['kr-sj', 17],
        ['kr-tj', 18], ['kr-ul', 19], ['kr-in', 20], ['kr-kw', 21],
        ['kr-gn', 22], ['kr-cj', 23], ['kr-gb', 24], ['kr-so', 25],
        ['kr-tg', 26], ['kr-kj', 27]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/kr/kr-all.topo.json">South Korea</a>'
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
