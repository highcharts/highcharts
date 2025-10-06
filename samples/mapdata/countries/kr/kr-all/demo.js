(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/kr/kr-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['kr-kg', 10], ['kr-cb', 11], ['kr-kn', 12], ['kr-2685', 13],
        ['kr-pu', 14], ['kr-2688', 15], ['kr-sj', 16], ['kr-tj', 17],
        ['kr-ul', 18], ['kr-in', 19], ['kr-kw', 20], ['kr-gn', 21],
        ['kr-cj', 22], ['kr-gb', 23], ['kr-so', 24], ['kr-tg', 25],
        ['kr-kj', 26]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/kr/kr-all.topo.json">South Korea</a>'
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
