(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/gb/gb-sct-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['gb-ork', 10], ['gb-hld', 11], ['gb-agb', 12], ['gb-mry', 13],
        ['gb-dgy', 14], ['gb-abe', 15], ['gb-abd', 16], ['gb-stg', 17],
        ['gb-fif', 18], ['gb-glg', 19], ['gb-nay', 20], ['gb-wln', 21],
        ['gb-pkn', 22], ['gb-scb', 23], ['gb-wdu', 24], ['gb-eay', 25],
        ['gb-say', 26], ['gb-nlk', 27], ['gb-edu', 28], ['gb-clk', 29],
        ['gb-fal', 30], ['gb-edh', 31], ['gb-eln', 32], ['gb-mln', 33],
        ['gb-ans', 34], ['gb-dnd', 35], ['gb-erw', 36], ['gb-ivc', 37],
        ['gb-rfw', 38], ['gb-slk', 39], ['gb-els', 40], ['gb-zet', 41]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/gb/gb-sct-all.topo.json">Scotland</a>'
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
