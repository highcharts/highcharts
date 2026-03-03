(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/vn/vn-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['vn-qn', 10], ['vn-kh', 11], ['vn-tg', 12], ['vn-bv', 13],
        ['vn-bu', 14], ['vn-hc', 15], ['vn-br', 16], ['vn-st', 17],
        ['vn-pt', 18], ['vn-yb', 19], ['vn-hd', 20], ['vn-bn', 21],
        ['vn-317', 22], ['vn-nb', 23], ['vn-hm', 24], ['vn-ho', 25],
        ['vn-vc', 26], ['vn-318', 27], ['vn-bg', 28], ['vn-tb', 29],
        ['vn-ld', 30], ['vn-bp', 31], ['vn-py', 32], ['vn-bd', 33],
        ['vn-724', 34], ['vn-qg', 35], ['vn-331', 36], ['vn-dt', 37],
        ['vn-la', 38], ['vn-3623', 39], ['vn-337', 40], ['vn-bl', 41],
        ['vn-vl', 42], ['vn-tn', 43], ['vn-ty', 44], ['vn-li', 45],
        ['vn-311', 46], ['vn-hg', 47], ['vn-nd', 48], ['vn-328', 49],
        ['vn-na', 50], ['vn-qb', 51], ['vn-723', 52], ['vn-nt', 53],
        ['vn-6365', 54], ['vn-299', 55], ['vn-300', 56], ['vn-qt', 57],
        ['vn-tt', 58], ['vn-da', 59], ['vn-ag', 60], ['vn-cm', 61],
        ['vn-tv', 62], ['vn-cb', 63], ['vn-kg', 64], ['vn-lo', 65],
        ['vn-db', 66], ['vn-ls', 67], ['vn-th', 68], ['vn-307', 69],
        ['vn-tq', 70], ['vn-bi', 71], ['vn-333', 72]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/vn/vn-all.topo.json">Vietnam</a>'
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
