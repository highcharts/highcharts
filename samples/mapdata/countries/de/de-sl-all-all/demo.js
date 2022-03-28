(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/de/de-sl-all-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['de-sl-10041000-10041516', 10], ['de-sl-10041000-10041518', 11],
        ['de-sl-10043000-10043115', 12], ['de-sl-10045000-10045111', 13],
        ['de-sl-10041000-10041511', 14], ['de-sl-10042000-10042111', 15],
        ['de-sl-10042000-10042113', 16], ['de-sl-10044000-10044122', 17],
        ['de-sl-10044000-10044123', 18], ['de-sl-10041000-10041513', 19],
        ['de-sl-10041000-10041100', 20], ['de-sl-10041000-10041512', 21],
        ['de-sl-10046000-10046113', 22], ['de-sl-10046000-10046114', 23],
        ['de-sl-10044000-10044120', 24], ['de-sl-10046000-10046118', 25],
        ['de-sl-10041000-10041515', 26], ['de-sl-10044000-10044116', 27],
        ['de-sl-10043000-10043117', 28], ['de-sl-10045000-10045117', 29],
        ['de-sl-10043000-10043114', 30], ['de-sl-10044000-10044115', 31],
        ['de-sl-10043000-10043111', 32], ['de-sl-10043000-10043112', 33],
        ['de-sl-10044000-10044112', 34], ['de-sl-10044000-10044113', 35],
        ['de-sl-10045000-10045112', 36], ['de-sl-10044000-10044114', 37],
        ['de-sl-10042000-10042112', 38], ['de-sl-10044000-10044117', 39],
        ['de-sl-10044000-10044111', 40], ['de-sl-10044000-10044118', 41],
        ['de-sl-10042000-10042115', 42], ['de-sl-10046000-10046117', 43],
        ['de-sl-10045000-10045114', 44], ['de-sl-10045000-10045115', 45],
        ['de-sl-10042000-10042114', 46], ['de-sl-10045000-10045116', 47],
        ['de-sl-10041000-10041519', 48], ['de-sl-10046000-10046112', 49],
        ['de-sl-10044000-10044121', 50], ['de-sl-10042000-10042117', 51],
        ['de-sl-10041000-10041514', 52], ['de-sl-10046000-10046111', 53],
        ['de-sl-10045000-10045113', 54], ['de-sl-10046000-10046115', 55],
        ['de-sl-10044000-10044119', 56], ['de-sl-10043000-10043113', 57],
        ['de-sl-10042000-10042116', 58], ['de-sl-10046000-10046116', 59],
        ['de-sl-10043000-10043116', 60], ['de-sl-10041000-10041517', 61],
        [null, 62]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/de/de-sl-all-all.topo.json">Saarland</a>'
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
