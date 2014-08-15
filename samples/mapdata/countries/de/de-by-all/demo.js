$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "de-by-09673000",
            "value": 0
        },
        {
            "hc-key": "de-by-09471000",
            "value": 1
        },
        {
            "hc-key": "de-by-09675000",
            "value": 2
        },
        {
            "hc-key": "de-by-09377000",
            "value": 3
        },
        {
            "hc-key": "de-by-09187000",
            "value": 4
        },
        {
            "hc-key": "de-by-09372000",
            "value": 5
        },
        {
            "hc-key": "de-by-09172000",
            "value": 6
        },
        {
            "hc-key": "de-by-09462000",
            "value": 7
        },
        {
            "hc-key": "de-by-09564000",
            "value": 8
        },
        {
            "hc-key": "de-by-09179000",
            "value": 9
        },
        {
            "hc-key": "de-by-09162000",
            "value": 10
        },
        {
            "hc-key": "de-by-09678000",
            "value": 11
        },
        {
            "hc-key": "de-by-09478000",
            "value": 12
        },
        {
            "hc-key": "de-by-09472000",
            "value": 13
        },
        {
            "hc-key": "de-by-09184000",
            "value": 14
        },
        {
            "hc-key": "de-by-09262000",
            "value": 15
        },
        {
            "hc-key": "de-by-09778000",
            "value": 16
        },
        {
            "hc-key": "de-by-09771000",
            "value": 17
        },
        {
            "hc-key": "de-by-09772000",
            "value": 18
        },
        {
            "hc-key": "de-by-09671000",
            "value": 19
        },
        {
            "hc-key": "de-by-09676000",
            "value": 20
        },
        {
            "hc-key": "de-by-09677000",
            "value": 21
        },
        {
            "hc-key": "de-by-09780000",
            "value": 22
        },
        {
            "hc-key": "de-by-09776000",
            "value": 23
        },
        {
            "hc-key": "de-by-09376000",
            "value": 24
        },
        {
            "hc-key": "de-by-09573000",
            "value": 25
        },
        {
            "hc-key": "de-by-09572000",
            "value": 26
        },
        {
            "hc-key": "de-by-09576000",
            "value": 27
        },
        {
            "hc-key": "de-by-09779000",
            "value": 28
        },
        {
            "hc-key": "de-by-09777000",
            "value": 29
        },
        {
            "hc-key": "de-by-09563000",
            "value": 30
        },
        {
            "hc-key": "de-by-09562000",
            "value": 31
        },
        {
            "hc-key": "de-by-09575000",
            "value": 32
        },
        {
            "hc-key": "de-by-09674000",
            "value": 33
        },
        {
            "hc-key": "de-by-09373000",
            "value": 34
        },
        {
            "hc-key": "de-by-09273000",
            "value": 35
        },
        {
            "hc-key": "de-by-09277000",
            "value": 36
        },
        {
            "hc-key": "de-by-09271000",
            "value": 37
        },
        {
            "hc-key": "de-by-09473000",
            "value": 38
        },
        {
            "hc-key": "de-by-09174000",
            "value": 39
        },
        {
            "hc-key": "de-by-09176000",
            "value": 40
        },
        {
            "hc-key": "de-by-09177000",
            "value": 41
        },
        {
            "hc-key": "de-by-09764000",
            "value": 42
        },
        {
            "hc-key": "de-by-09274000",
            "value": 43
        },
        {
            "hc-key": "de-by-09375000",
            "value": 44
        },
        {
            "hc-key": "de-by-09186000",
            "value": 45
        },
        {
            "hc-key": "de-by-09183000",
            "value": 46
        },
        {
            "hc-key": "de-by-09175000",
            "value": 47
        },
        {
            "hc-key": "de-by-09476000",
            "value": 48
        },
        {
            "hc-key": "de-by-09261000",
            "value": 49
        },
        {
            "hc-key": "de-by-09774000",
            "value": 50
        },
        {
            "hc-key": "de-by-09571000",
            "value": 51
        },
        {
            "hc-key": "de-by-09276000",
            "value": 52
        },
        {
            "hc-key": "de-by-09773000",
            "value": 53
        },
        {
            "hc-key": "de-by-09479000",
            "value": 54
        },
        {
            "hc-key": "de-by-09374000",
            "value": 55
        },
        {
            "hc-key": "de-by-09672000",
            "value": 56
        },
        {
            "hc-key": "de-by-09180000",
            "value": 57
        },
        {
            "hc-key": "de-by-09275000",
            "value": 58
        },
        {
            "hc-key": "de-by-09679000",
            "value": 59
        },
        {
            "hc-key": "de-by-09272000",
            "value": 60
        },
        {
            "hc-key": "de-by-09189000",
            "value": 61
        },
        {
            "hc-key": "de-by-09181000",
            "value": 62
        },
        {
            "hc-key": "de-by-09173000",
            "value": 63
        },
        {
            "hc-key": "de-by-09182000",
            "value": 64
        },
        {
            "hc-key": "de-by-09361000",
            "value": 65
        },
        {
            "hc-key": "de-by-09574000",
            "value": 66
        },
        {
            "hc-key": "de-by-09371000",
            "value": 67
        },
        {
            "hc-key": "de-by-09475000",
            "value": 68
        },
        {
            "hc-key": "de-by-09185000",
            "value": 69
        },
        {
            "hc-key": "de-by-09178000",
            "value": 70
        },
        {
            "hc-key": "de-by-09171000",
            "value": 71
        },
        {
            "hc-key": "de-by-09775000",
            "value": 72
        },
        {
            "hc-key": "de-by-09763000",
            "value": 73
        },
        {
            "hc-key": "de-by-09188000",
            "value": 74
        },
        {
            "hc-key": "de-by-09190000",
            "value": 75
        },
        {
            "hc-key": "de-by-09577000",
            "value": 76
        },
        {
            "hc-key": "de-by-09561000",
            "value": 77
        },
        {
            "hc-key": "de-by-09163000",
            "value": 78
        },
        {
            "hc-key": "de-by-09363000",
            "value": 79
        },
        {
            "hc-key": "de-by-09761000",
            "value": 80
        },
        {
            "hc-key": "de-by-09762000",
            "value": 81
        },
        {
            "hc-key": "de-by-09661000",
            "value": 82
        },
        {
            "hc-key": "de-by-09565000",
            "value": 83
        },
        {
            "hc-key": "de-by-09474000",
            "value": 84
        },
        {
            "hc-key": "de-by-09461000",
            "value": 85
        },
        {
            "hc-key": "de-by-09463000",
            "value": 86
        },
        {
            "hc-key": "de-by-09663000",
            "value": 87
        },
        {
            "hc-key": "de-by-09278000",
            "value": 88
        },
        {
            "hc-key": "de-by-09477000",
            "value": 89
        },
        {
            "hc-key": "de-by-09279000",
            "value": 90
        },
        {
            "hc-key": "de-by-09161000",
            "value": 91
        },
        {
            "hc-key": "de-by-09362000",
            "value": 92
        },
        {
            "hc-key": "de-by-09263000",
            "value": 93
        },
        {
            "hc-key": "de-by-09464000",
            "value": 94
        },
        {
            "hc-key": "de-by-09662000",
            "value": 95
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/de/de-by-all.js">Bayern</a>'
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
            mapData: Highcharts.maps['countries/de/de-by-all'],
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
