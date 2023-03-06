(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ca/ca-qc-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ca-qc-2487', 10], ['ca-qc-2484', 11], ['ca-qc-2485', 12],
        ['ca-qc-2490', 13], ['ca-qc-2462', 14], ['ca-qc-2488', 15],
        ['ca-qc-2499', 16], ['ca-qc-2420', 17], ['ca-qc-2412', 18],
        ['ca-qc-2415', 19], ['ca-qc-2416', 20], ['ca-qc-2489', 21],
        ['ca-qc-2445', 22], ['ca-qc-2446', 23], ['ca-qc-2421', 24],
        ['ca-qc-2423', 25], ['ca-qc-2425', 26], ['ca-qc-2495', 27],
        ['ca-qc-2458', 28], ['ca-qc-2459', 29], ['ca-qc-2467', 30],
        ['ca-qc-2454', 31], ['ca-qc-2455', 32], ['ca-qc-2457', 33],
        ['ca-qc-2486', 34], ['ca-qc-2456', 35], ['ca-qc-2451', 36],
        ['ca-qc-2450', 37], ['ca-qc-2453', 38], ['ca-qc-2482', 39],
        ['ca-qc-2480', 40], ['ca-qc-2483', 41], ['ca-qc-2405', 42],
        ['ca-qc-2404', 43], ['ca-qc-2402', 44], ['ca-qc-2403', 45],
        ['ca-qc-2409', 46], ['ca-qc-2408', 47], ['ca-qc-2406', 48],
        ['ca-qc-2464', 49], ['ca-qc-2465', 50], ['ca-qc-2466', 51],
        ['ca-qc-2460', 52], ['ca-qc-2452', 53], ['ca-qc-2433', 54],
        ['ca-qc-2461', 55], ['ca-qc-2463', 56], ['ca-qc-2468', 57],
        ['ca-qc-2469', 58], ['ca-qc-2430', 59], ['ca-qc-2431', 60],
        ['ca-qc-2432', 61], ['ca-qc-2429', 62], ['ca-qc-2407', 63],
        ['ca-qc-2492', 64], ['ca-qc-2491', 65], ['ca-qc-2422', 66],
        ['ca-qc-2479', 67], ['ca-qc-2493', 68], ['ca-qc-2478', 69],
        ['ca-qc-2494', 70], ['ca-qc-2497', 71], ['ca-qc-2426', 72],
        ['ca-qc-2496', 73], ['ca-qc-2427', 74], ['ca-qc-2419', 75],
        ['ca-qc-2411', 76], ['ca-qc-2410', 77], ['ca-qc-2413', 78],
        ['ca-qc-2414', 79], ['ca-qc-2417', 80], ['ca-qc-2477', 81],
        ['ca-qc-2476', 82], ['ca-qc-2475', 83], ['ca-qc-2474', 84],
        ['ca-qc-2473', 85], ['ca-qc-2472', 86], ['ca-qc-2471', 87],
        ['ca-qc-2470', 88], ['ca-qc-2481', 89], ['ca-qc-2428', 90],
        ['ca-qc-2439', 91], ['ca-qc-2443', 92], ['ca-qc-2438', 93],
        ['ca-qc-2442', 94], ['ca-qc-2435', 95], ['ca-qc-2437', 96],
        ['ca-qc-2434', 97], ['ca-qc-2440', 98], ['ca-qc-2436', 99],
        ['ca-qc-2441', 100], ['ca-qc-2447', 101], ['ca-qc-2444', 102],
        ['ca-qc-2448', 103], ['ca-qc-2449', 104], ['ca-qc-2418', 105],
        ['ca-qc-2401', 106], ['ca-qc-2498', 107]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ca/ca-qc-all.topo.json">Quebec</a>'
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
