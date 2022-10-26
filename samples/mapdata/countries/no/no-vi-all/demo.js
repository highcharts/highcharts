(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/no/no-vi-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-vi-3011', 10], ['no-vi-3049', 11], ['no-vi-3038', 12],
        ['no-vi-3045', 13], ['no-vi-3048', 14], ['no-vi-3005', 15],
        ['no-vi-3025', 16], ['no-vi-3002', 17], ['no-vi-5435', 18],
        ['no-vi-3030', 19], ['no-vi-3019', 20], ['no-os-3024', 21],
        ['no-vi-3032', 22], ['no-vi-3033', 23], ['no-in-3054', 24],
        ['no-vi-3003', 25], ['no-vi-3015', 26], ['no-vi-3016', 27],
        ['no-vi-3031', 28], ['no-vi-3029', 29], ['no-vi-3018', 30],
        ['no-vi-3017', 31], ['no-vi-3021', 32], ['no-vi-3022', 33],
        ['no-vi-3014', 34], ['no-vi-3028', 35], ['no-vi-3007', 36],
        ['no-vi-3052', 37], ['no-vi-3039', 38], ['no-vi-3001', 39],
        ['no-vi-3026', 40], ['no-vi-3004', 41], ['no-vi-3041', 42],
        ['no-vi-3037', 43], ['no-vi-3023', 44], ['no-vi-3034', 45],
        ['no-vi-3035', 46], ['no-vi-3051', 47], ['no-in-3053', 48],
        ['no-vi-3013', 49], ['no-vi-3012', 50], ['no-vi-3044', 51],
        ['no-vi-3040', 52], ['no-vi-3043', 53], ['no-vi-3042', 54],
        ['no-vi-3006', 55], ['no-vi-3050', 56], ['no-vi-3046', 57],
        ['no-vi-3047', 58], ['no-vi-3027', 59], ['no-vi-3036', 60]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-vi-all.topo.json">Viken</a>'
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
