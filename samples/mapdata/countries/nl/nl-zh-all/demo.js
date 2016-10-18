$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "nl-3560-gm0627",
            "value": 0
        },
        {
            "hc-key": "nl-3560-gm1672",
            "value": 1
        },
        {
            "hc-key": "nl-3560-gm1924",
            "value": 2
        },
        {
            "hc-key": "nl-3560-gm0537",
            "value": 3
        },
        {
            "hc-key": "nl-3560-gm1525",
            "value": 4
        },
        {
            "hc-key": "nl-3560-gm0576",
            "value": 5
        },
        {
            "hc-key": "nl-3560-gm0617",
            "value": 6
        },
        {
            "hc-key": "nl-3560-gm1901",
            "value": 7
        },
        {
            "hc-key": "nl-3560-gm0623",
            "value": 8
        },
        {
            "hc-key": "nl-3560-gm0545",
            "value": 9
        },
        {
            "hc-key": "nl-3560-gm0620",
            "value": 10
        },
        {
            "hc-key": "nl-3560-gm1621",
            "value": 11
        },
        {
            "hc-key": "nl-3560-gm0637",
            "value": 12
        },
        {
            "hc-key": "nl-3560-gm0499",
            "value": 13
        },
        {
            "hc-key": "nl-3560-gm0512",
            "value": 14
        },
        {
            "hc-key": "nl-3560-gm0523",
            "value": 15
        },
        {
            "hc-key": "nl-3560-gm0531",
            "value": 16
        },
        {
            "hc-key": "nl-3560-gm0482",
            "value": 17
        },
        {
            "hc-key": "nl-3560-gm0546",
            "value": 18
        },
        {
            "hc-key": "nl-3560-gm0534",
            "value": 19
        },
        {
            "hc-key": "nl-3560-gm0553",
            "value": 20
        },
        {
            "hc-key": "nl-3560-gm0585",
            "value": 21
        },
        {
            "hc-key": "nl-3560-gm0638",
            "value": 22
        },
        {
            "hc-key": "nl-3560-gm1916",
            "value": 23
        },
        {
            "hc-key": "nl-3560-gm0568",
            "value": 24
        },
        {
            "hc-key": "nl-3560-gm0612",
            "value": 25
        },
        {
            "hc-key": "nl-3560-gm0505",
            "value": 26
        },
        {
            "hc-key": "nl-3560-gm0590",
            "value": 27
        },
        {
            "hc-key": "nl-3560-gm0503",
            "value": 28
        },
        {
            "hc-key": "nl-3560-gm0599",
            "value": 29
        },
        {
            "hc-key": "nl-3560-gm1926",
            "value": 30
        },
        {
            "hc-key": "nl-3560-gm1892",
            "value": 31
        },
        {
            "hc-key": "nl-3560-gm0644",
            "value": 32
        },
        {
            "hc-key": "nl-3560-gm0491",
            "value": 33
        },
        {
            "hc-key": "nl-3560-gm0608",
            "value": 34
        },
        {
            "hc-key": "nl-3560-gm0610",
            "value": 35
        },
        {
            "hc-key": "nl-3560-gm0530",
            "value": 36
        },
        {
            "hc-key": "nl-3560-gm0614",
            "value": 37
        },
        {
            "hc-key": "nl-3560-gm0584",
            "value": 38
        },
        {
            "hc-key": "nl-3560-gm0611",
            "value": 39
        },
        {
            "hc-key": "nl-3560-gm0588",
            "value": 40
        },
        {
            "hc-key": "nl-3560-gm0501",
            "value": 41
        },
        {
            "hc-key": "nl-3560-gm0613",
            "value": 42
        },
        {
            "hc-key": "nl-3560-gm0622",
            "value": 43
        },
        {
            "hc-key": "nl-3560-gm0556",
            "value": 44
        },
        {
            "hc-key": "nl-3560-gm0629",
            "value": 45
        },
        {
            "hc-key": "nl-3560-gm0547",
            "value": 46
        },
        {
            "hc-key": "nl-3560-gm0642",
            "value": 47
        },
        {
            "hc-key": "nl-3560-gm0489",
            "value": 48
        },
        {
            "hc-key": "nl-3560-gm1927",
            "value": 49
        },
        {
            "hc-key": "nl-3560-gm0597",
            "value": 50
        },
        {
            "hc-key": "nl-3560-gm0542",
            "value": 51
        },
        {
            "hc-key": "nl-3560-gm0502",
            "value": 52
        },
        {
            "hc-key": "nl-3560-gm0513",
            "value": 53
        },
        {
            "hc-key": "nl-3560-gm0518",
            "value": 54
        },
        {
            "hc-key": "nl-3560-gm1783",
            "value": 55
        },
        {
            "hc-key": "nl-3560-gm1842",
            "value": 56
        },
        {
            "hc-key": "nl-3560-gm0575",
            "value": 57
        },
        {
            "hc-key": "nl-3560-gm0603",
            "value": 58
        },
        {
            "hc-key": "nl-3560-gm0569",
            "value": 59
        },
        {
            "hc-key": "nl-3560-gm1884",
            "value": 60
        },
        {
            "hc-key": "nl-3560-gm0484",
            "value": 61
        },
        {
            "hc-key": "nl-3560-gm0626",
            "value": 62
        },
        {
            "hc-key": "nl-3560-gm0643",
            "value": 63
        },
        {
            "hc-key": "nl-3560-gm0689",
            "value": 64
        },
        {
            "hc-key": "nl-3560-gm0707",
            "value": 65
        },
        {
            "hc-key": "nl-3560-gm0579",
            "value": 66
        },
        {
            "hc-key": "nl-3560-gm0606",
            "value": 67
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/nl/nl-zh-all.js">Zuid-Holland</a>'
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
            mapData: Highcharts.maps['countries/nl/nl-zh-all'],
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
