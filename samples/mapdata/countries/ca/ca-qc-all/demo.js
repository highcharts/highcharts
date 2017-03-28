// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ca-qc-2487', 0],
    ['ca-qc-2484', 1],
    ['ca-qc-2485', 2],
    ['ca-qc-2490', 3],
    ['ca-qc-2462', 4],
    ['ca-qc-2488', 5],
    ['ca-qc-2499', 6],
    ['ca-qc-2420', 7],
    ['ca-qc-2412', 8],
    ['ca-qc-2415', 9],
    ['ca-qc-2416', 10],
    ['ca-qc-2489', 11],
    ['ca-qc-2445', 12],
    ['ca-qc-2446', 13],
    ['ca-qc-2421', 14],
    ['ca-qc-2423', 15],
    ['ca-qc-2425', 16],
    ['ca-qc-2495', 17],
    ['ca-qc-2458', 18],
    ['ca-qc-2459', 19],
    ['ca-qc-2467', 20],
    ['ca-qc-2454', 21],
    ['ca-qc-2455', 22],
    ['ca-qc-2457', 23],
    ['ca-qc-2486', 24],
    ['ca-qc-2456', 25],
    ['ca-qc-2451', 26],
    ['ca-qc-2450', 27],
    ['ca-qc-2453', 28],
    ['ca-qc-2482', 29],
    ['ca-qc-2480', 30],
    ['ca-qc-2483', 31],
    ['ca-qc-2405', 32],
    ['ca-qc-2404', 33],
    ['ca-qc-2402', 34],
    ['ca-qc-2403', 35],
    ['ca-qc-2409', 36],
    ['ca-qc-2408', 37],
    ['ca-qc-2406', 38],
    ['ca-qc-2464', 39],
    ['ca-qc-2465', 40],
    ['ca-qc-2466', 41],
    ['ca-qc-2460', 42],
    ['ca-qc-2452', 43],
    ['ca-qc-2433', 44],
    ['ca-qc-2461', 45],
    ['ca-qc-2463', 46],
    ['ca-qc-2468', 47],
    ['ca-qc-2469', 48],
    ['ca-qc-2430', 49],
    ['ca-qc-2431', 50],
    ['ca-qc-2432', 51],
    ['ca-qc-2429', 52],
    ['ca-qc-2407', 53],
    ['ca-qc-2492', 54],
    ['ca-qc-2491', 55],
    ['ca-qc-2422', 56],
    ['ca-qc-2479', 57],
    ['ca-qc-2493', 58],
    ['ca-qc-2478', 59],
    ['ca-qc-2494', 60],
    ['ca-qc-2497', 61],
    ['ca-qc-2426', 62],
    ['ca-qc-2496', 63],
    ['ca-qc-2427', 64],
    ['ca-qc-2419', 65],
    ['ca-qc-2411', 66],
    ['ca-qc-2410', 67],
    ['ca-qc-2413', 68],
    ['ca-qc-2414', 69],
    ['ca-qc-2417', 70],
    ['ca-qc-2477', 71],
    ['ca-qc-2476', 72],
    ['ca-qc-2475', 73],
    ['ca-qc-2474', 74],
    ['ca-qc-2473', 75],
    ['ca-qc-2472', 76],
    ['ca-qc-2471', 77],
    ['ca-qc-2470', 78],
    ['ca-qc-2481', 79],
    ['ca-qc-2428', 80],
    ['ca-qc-2439', 81],
    ['ca-qc-2443', 82],
    ['ca-qc-2438', 83],
    ['ca-qc-2442', 84],
    ['ca-qc-2435', 85],
    ['ca-qc-2437', 86],
    ['ca-qc-2434', 87],
    ['ca-qc-2440', 88],
    ['ca-qc-2436', 89],
    ['ca-qc-2441', 90],
    ['ca-qc-2447', 91],
    ['ca-qc-2444', 92],
    ['ca-qc-2448', 93],
    ['ca-qc-2449', 94],
    ['ca-qc-2418', 95],
    ['ca-qc-2401', 96],
    ['ca-qc-2498', 97]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ca/ca-qc-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ca/ca-qc-all.js">Quebec</a>'
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
