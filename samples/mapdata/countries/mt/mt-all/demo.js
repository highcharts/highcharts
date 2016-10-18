$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "mt-7358",
            "value": 0
        },
        {
            "hc-key": "mt-7363",
            "value": 1
        },
        {
            "hc-key": "mt-7369",
            "value": 2
        },
        {
            "hc-key": "mt-7346",
            "value": 3
        },
        {
            "hc-key": "mt-7370",
            "value": 4
        },
        {
            "hc-key": "mt-7374",
            "value": 5
        },
        {
            "hc-key": "mt-7376",
            "value": 6
        },
        {
            "hc-key": "mt-7373",
            "value": 7
        },
        {
            "hc-key": "mt-7378",
            "value": 8
        },
        {
            "hc-key": "mt-7380",
            "value": 9
        },
        {
            "hc-key": "mt-7382",
            "value": 10
        },
        {
            "hc-key": "mt-7384",
            "value": 11
        },
        {
            "hc-key": "mt-7385",
            "value": 12
        },
        {
            "hc-key": "mt-7386",
            "value": 13
        },
        {
            "hc-key": "mt-7396",
            "value": 14
        },
        {
            "hc-key": "mt-7393",
            "value": 15
        },
        {
            "hc-key": "mt-7332",
            "value": 16
        },
        {
            "hc-key": "mt-7353",
            "value": 17
        },
        {
            "hc-key": "mt-3630",
            "value": 18
        },
        {
            "hc-key": "mt-7344",
            "value": 19
        },
        {
            "hc-key": "mt-7345",
            "value": 20
        },
        {
            "hc-key": "mt-7347",
            "value": 21
        },
        {
            "hc-key": "mt-7350",
            "value": 22
        },
        {
            "hc-key": "mt-7352",
            "value": 23
        },
        {
            "hc-key": "mt-7354",
            "value": 24
        },
        {
            "hc-key": "mt-7355",
            "value": 25
        },
        {
            "hc-key": "mt-7351",
            "value": 26
        },
        {
            "hc-key": "mt-7356",
            "value": 27
        },
        {
            "hc-key": "mt-7360",
            "value": 28
        },
        {
            "hc-key": "mt-7361",
            "value": 29
        },
        {
            "hc-key": "mt-7364",
            "value": 30
        },
        {
            "hc-key": "mt-7365",
            "value": 31
        },
        {
            "hc-key": "mt-7366",
            "value": 32
        },
        {
            "hc-key": "mt-7367",
            "value": 33
        },
        {
            "hc-key": "mt-7368",
            "value": 34
        },
        {
            "hc-key": "mt-7372",
            "value": 35
        },
        {
            "hc-key": "mt-7359",
            "value": 36
        },
        {
            "hc-key": "mt-7375",
            "value": 37
        },
        {
            "hc-key": "mt-7377",
            "value": 38
        },
        {
            "hc-key": "mt-7379",
            "value": 39
        },
        {
            "hc-key": "mt-7381",
            "value": 40
        },
        {
            "hc-key": "mt-7383",
            "value": 41
        },
        {
            "hc-key": "mt-7388",
            "value": 42
        },
        {
            "hc-key": "mt-7389",
            "value": 43
        },
        {
            "hc-key": "mt-7390",
            "value": 44
        },
        {
            "hc-key": "mt-7387",
            "value": 45
        },
        {
            "hc-key": "mt-7391",
            "value": 46
        },
        {
            "hc-key": "mt-7394",
            "value": 47
        },
        {
            "hc-key": "mt-7395",
            "value": 48
        },
        {
            "hc-key": "mt-7397",
            "value": 49
        },
        {
            "hc-key": "mt-7343",
            "value": 50
        },
        {
            "hc-key": "mt-7336",
            "value": 51
        },
        {
            "hc-key": "mt-7337",
            "value": 52
        },
        {
            "hc-key": "mt-7331",
            "value": 53
        },
        {
            "hc-key": "mt-7339",
            "value": 54
        },
        {
            "hc-key": "mt-7340",
            "value": 55
        },
        {
            "hc-key": "mt-7342",
            "value": 56
        },
        {
            "hc-key": "mt-7341",
            "value": 57
        },
        {
            "hc-key": "mt-7348",
            "value": 58
        },
        {
            "hc-key": "mt-7349",
            "value": 59
        },
        {
            "hc-key": "mt-7357",
            "value": 60
        },
        {
            "hc-key": "mt-7371",
            "value": 61
        },
        {
            "hc-key": "mt-7392",
            "value": 62
        },
        {
            "hc-key": "mt-7330",
            "value": 63
        },
        {
            "hc-key": "mt-7333",
            "value": 64
        },
        {
            "hc-key": "mt-7335",
            "value": 65
        },
        {
            "hc-key": "mt-7338",
            "value": 66
        },
        {
            "hc-key": "mt-7334",
            "value": 67
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/mt/mt-all.js">Malta</a>'
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
            mapData: Highcharts.maps['countries/mt/mt-all'],
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
