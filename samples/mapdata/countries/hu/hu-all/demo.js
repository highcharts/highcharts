$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "hu-no",
            "value": 0
        },
        {
            "hc-key": "hu-bz",
            "value": 1
        },
        {
            "hc-key": "hu-he",
            "value": 2
        },
        {
            "hc-key": "hu-jn",
            "value": 3
        },
        {
            "hc-key": "hu-bu",
            "value": 4
        },
        {
            "hc-key": "hu-ed",
            "value": 5
        },
        {
            "hc-key": "hu-sd",
            "value": 6
        },
        {
            "hc-key": "hu-hv",
            "value": 7
        },
        {
            "hc-key": "hu-st",
            "value": 8
        },
        {
            "hc-key": "hu-mi",
            "value": 9
        },
        {
            "hc-key": "hu-nk",
            "value": 10
        },
        {
            "hc-key": "hu-so",
            "value": 11
        },
        {
            "hc-key": "hu-du",
            "value": 12
        },
        {
            "hc-key": "hu-bk",
            "value": 13
        },
        {
            "hc-key": "hu-tb",
            "value": 14
        },
        {
            "hc-key": "hu-fe",
            "value": 15
        },
        {
            "hc-key": "hu-ke",
            "value": 16
        },
        {
            "hc-key": "hu-pe",
            "value": 17
        },
        {
            "hc-key": "hu-sk",
            "value": 18
        },
        {
            "hc-key": "hu-sz",
            "value": 19
        },
        {
            "hc-key": "hu-cs",
            "value": 20
        },
        {
            "hc-key": "hu-be",
            "value": 21
        },
        {
            "hc-key": "hu-hb",
            "value": 22
        },
        {
            "hc-key": "hu-sn",
            "value": 23
        },
        {
            "hc-key": "hu-va",
            "value": 24
        },
        {
            "hc-key": "hu-sh",
            "value": 25
        },
        {
            "hc-key": "hu-ba",
            "value": 26
        },
        {
            "hc-key": "hu-gs",
            "value": 27
        },
        {
            "hc-key": "hu-to",
            "value": 28
        },
        {
            "hc-key": "hu-za",
            "value": 29
        },
        {
            "hc-key": "hu-ze",
            "value": 30
        },
        {
            "hc-key": "hu-ss",
            "value": 31
        },
        {
            "hc-key": "hu-mc",
            "value": 32
        },
        {
            "hc-key": "hu-ny",
            "value": 33
        },
        {
            "hc-key": "hu-de",
            "value": 34
        },
        {
            "hc-key": "hu-eg",
            "value": 35
        },
        {
            "hc-key": "hu-gy",
            "value": 36
        },
        {
            "hc-key": "hu-ps",
            "value": 37
        },
        {
            "hc-key": "hu-sf",
            "value": 38
        },
        {
            "hc-key": "hu-vm",
            "value": 39
        },
        {
            "hc-key": "hu-ve",
            "value": 40
        },
        {
            "hc-key": "hu-kv",
            "value": 41
        },
        {
            "hc-key": "hu-km",
            "value": 42
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/hu/hu-all.js">Hungary</a>'
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
            mapData: Highcharts.maps['countries/hu/hu-all'],
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
