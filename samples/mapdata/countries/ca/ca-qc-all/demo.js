$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ca-qc-2487",
            "value": 0
        },
        {
            "hc-key": "ca-qc-2484",
            "value": 1
        },
        {
            "hc-key": "ca-qc-2485",
            "value": 2
        },
        {
            "hc-key": "ca-qc-2490",
            "value": 3
        },
        {
            "hc-key": "ca-qc-2462",
            "value": 4
        },
        {
            "hc-key": "ca-qc-2488",
            "value": 5
        },
        {
            "hc-key": "ca-qc-2499",
            "value": 6
        },
        {
            "hc-key": "ca-qc-2420",
            "value": 7
        },
        {
            "hc-key": "ca-qc-2412",
            "value": 8
        },
        {
            "hc-key": "ca-qc-2415",
            "value": 9
        },
        {
            "hc-key": "ca-qc-2416",
            "value": 10
        },
        {
            "hc-key": "ca-qc-2489",
            "value": 11
        },
        {
            "hc-key": "ca-qc-2445",
            "value": 12
        },
        {
            "hc-key": "ca-qc-2446",
            "value": 13
        },
        {
            "hc-key": "ca-qc-2421",
            "value": 14
        },
        {
            "hc-key": "ca-qc-2423",
            "value": 15
        },
        {
            "hc-key": "ca-qc-2425",
            "value": 16
        },
        {
            "hc-key": "ca-qc-2495",
            "value": 17
        },
        {
            "hc-key": "ca-qc-2458",
            "value": 18
        },
        {
            "hc-key": "ca-qc-2459",
            "value": 19
        },
        {
            "hc-key": "ca-qc-2467",
            "value": 20
        },
        {
            "hc-key": "ca-qc-2454",
            "value": 21
        },
        {
            "hc-key": "ca-qc-2455",
            "value": 22
        },
        {
            "hc-key": "ca-qc-2457",
            "value": 23
        },
        {
            "hc-key": "ca-qc-2486",
            "value": 24
        },
        {
            "hc-key": "ca-qc-2456",
            "value": 25
        },
        {
            "hc-key": "ca-qc-2451",
            "value": 26
        },
        {
            "hc-key": "ca-qc-2450",
            "value": 27
        },
        {
            "hc-key": "ca-qc-2453",
            "value": 28
        },
        {
            "hc-key": "ca-qc-2482",
            "value": 29
        },
        {
            "hc-key": "ca-qc-2480",
            "value": 30
        },
        {
            "hc-key": "ca-qc-2483",
            "value": 31
        },
        {
            "hc-key": "ca-qc-2405",
            "value": 32
        },
        {
            "hc-key": "ca-qc-2404",
            "value": 33
        },
        {
            "hc-key": "ca-qc-2402",
            "value": 34
        },
        {
            "hc-key": "ca-qc-2403",
            "value": 35
        },
        {
            "hc-key": "ca-qc-2409",
            "value": 36
        },
        {
            "hc-key": "ca-qc-2408",
            "value": 37
        },
        {
            "hc-key": "ca-qc-2406",
            "value": 38
        },
        {
            "hc-key": "ca-qc-2464",
            "value": 39
        },
        {
            "hc-key": "ca-qc-2465",
            "value": 40
        },
        {
            "hc-key": "ca-qc-2466",
            "value": 41
        },
        {
            "hc-key": "ca-qc-2460",
            "value": 42
        },
        {
            "hc-key": "ca-qc-2452",
            "value": 43
        },
        {
            "hc-key": "ca-qc-2433",
            "value": 44
        },
        {
            "hc-key": "ca-qc-2461",
            "value": 45
        },
        {
            "hc-key": "ca-qc-2463",
            "value": 46
        },
        {
            "hc-key": "ca-qc-2468",
            "value": 47
        },
        {
            "hc-key": "ca-qc-2469",
            "value": 48
        },
        {
            "hc-key": "ca-qc-2430",
            "value": 49
        },
        {
            "hc-key": "ca-qc-2431",
            "value": 50
        },
        {
            "hc-key": "ca-qc-2432",
            "value": 51
        },
        {
            "hc-key": "ca-qc-2429",
            "value": 52
        },
        {
            "hc-key": "ca-qc-2407",
            "value": 53
        },
        {
            "hc-key": "ca-qc-2492",
            "value": 54
        },
        {
            "hc-key": "ca-qc-2491",
            "value": 55
        },
        {
            "hc-key": "ca-qc-2422",
            "value": 56
        },
        {
            "hc-key": "ca-qc-2479",
            "value": 57
        },
        {
            "hc-key": "ca-qc-2493",
            "value": 58
        },
        {
            "hc-key": "ca-qc-2478",
            "value": 59
        },
        {
            "hc-key": "ca-qc-2494",
            "value": 60
        },
        {
            "hc-key": "ca-qc-2497",
            "value": 61
        },
        {
            "hc-key": "ca-qc-2426",
            "value": 62
        },
        {
            "hc-key": "ca-qc-2496",
            "value": 63
        },
        {
            "hc-key": "ca-qc-2427",
            "value": 64
        },
        {
            "hc-key": "ca-qc-2419",
            "value": 65
        },
        {
            "hc-key": "ca-qc-2411",
            "value": 66
        },
        {
            "hc-key": "ca-qc-2410",
            "value": 67
        },
        {
            "hc-key": "ca-qc-2413",
            "value": 68
        },
        {
            "hc-key": "ca-qc-2414",
            "value": 69
        },
        {
            "hc-key": "ca-qc-2417",
            "value": 70
        },
        {
            "hc-key": "ca-qc-2477",
            "value": 71
        },
        {
            "hc-key": "ca-qc-2476",
            "value": 72
        },
        {
            "hc-key": "ca-qc-2475",
            "value": 73
        },
        {
            "hc-key": "ca-qc-2474",
            "value": 74
        },
        {
            "hc-key": "ca-qc-2473",
            "value": 75
        },
        {
            "hc-key": "ca-qc-2472",
            "value": 76
        },
        {
            "hc-key": "ca-qc-2471",
            "value": 77
        },
        {
            "hc-key": "ca-qc-2470",
            "value": 78
        },
        {
            "hc-key": "ca-qc-2481",
            "value": 79
        },
        {
            "hc-key": "ca-qc-2428",
            "value": 80
        },
        {
            "hc-key": "ca-qc-2439",
            "value": 81
        },
        {
            "hc-key": "ca-qc-2443",
            "value": 82
        },
        {
            "hc-key": "ca-qc-2438",
            "value": 83
        },
        {
            "hc-key": "ca-qc-2442",
            "value": 84
        },
        {
            "hc-key": "ca-qc-2435",
            "value": 85
        },
        {
            "hc-key": "ca-qc-2437",
            "value": 86
        },
        {
            "hc-key": "ca-qc-2434",
            "value": 87
        },
        {
            "hc-key": "ca-qc-2440",
            "value": 88
        },
        {
            "hc-key": "ca-qc-2436",
            "value": 89
        },
        {
            "hc-key": "ca-qc-2441",
            "value": 90
        },
        {
            "hc-key": "ca-qc-2447",
            "value": 91
        },
        {
            "hc-key": "ca-qc-2444",
            "value": 92
        },
        {
            "hc-key": "ca-qc-2448",
            "value": 93
        },
        {
            "hc-key": "ca-qc-2449",
            "value": 94
        },
        {
            "hc-key": "ca-qc-2418",
            "value": 95
        },
        {
            "hc-key": "ca-qc-2401",
            "value": 96
        },
        {
            "hc-key": "ca-qc-2498",
            "value": 97
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ca/ca-qc-all.js">Quebec</a>'
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

        series : [{
            data : data,
            mapData: Highcharts.maps['countries/ca/ca-qc-all'],
            joinBy: 'hc-key',
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
});
