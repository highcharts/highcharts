$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ir",
            "value": 0
        },
        {
            "hc-key": "ph",
            "value": 1
        },
        {
            "hc-key": "sa",
            "value": 2
        },
        {
            "hc-key": "jp",
            "value": 3
        },
        {
            "hc-key": "th",
            "value": 4
        },
        {
            "hc-key": "om",
            "value": 5
        },
        {
            "hc-key": "ye",
            "value": 6
        },
        {
            "hc-key": "in",
            "value": 7
        },
        {
            "hc-key": "kr",
            "value": 8
        },
        {
            "hc-key": "bd",
            "value": 9
        },
        {
            "hc-key": "pg",
            "value": 10
        },
        {
            "hc-key": "cn",
            "value": 11
        },
        {
            "hc-key": "bh",
            "value": 12
        },
        {
            "hc-key": "mm",
            "value": 13
        },
        {
            "hc-key": "id",
            "value": 14
        },
        {
            "hc-key": "sg",
            "value": 15
        },
        {
            "hc-key": "ru",
            "value": 16
        },
        {
            "hc-key": "sh",
            "value": 17
        },
        {
            "hc-key": "my",
            "value": 18
        },
        {
            "hc-key": "az",
            "value": 19
        },
        {
            "hc-key": "am",
            "value": 20
        },
        {
            "hc-key": "vn",
            "value": 21
        },
        {
            "hc-key": "tj",
            "value": 22
        },
        {
            "hc-key": "iq",
            "value": 23
        },
        {
            "hc-key": "uz",
            "value": 24
        },
        {
            "hc-key": "tl",
            "value": 25
        },
        {
            "hc-key": "kz",
            "value": 26
        },
        {
            "hc-key": "il",
            "value": 27
        },
        {
            "hc-key": "sy",
            "value": 28
        },
        {
            "hc-key": "bn",
            "value": 29
        },
        {
            "hc-key": "jo",
            "value": 30
        },
        {
            "hc-key": "tm",
            "value": 31
        },
        {
            "hc-key": "cnm",
            "value": 32
        },
        {
            "hc-key": "cy",
            "value": 33
        },
        {
            "hc-key": "nc",
            "value": 34
        },
        {
            "hc-key": "mn",
            "value": 35
        },
        {
            "hc-key": "kh",
            "value": 36
        },
        {
            "hc-key": "ae",
            "value": 37
        },
        {
            "hc-key": "la",
            "value": 38
        },
        {
            "hc-key": "pk",
            "value": 39
        },
        {
            "hc-key": "jk",
            "value": 40
        },
        {
            "hc-key": "qa",
            "value": 41
        },
        {
            "hc-key": "tr",
            "value": 42
        },
        {
            "hc-key": "kw",
            "value": 43
        },
        {
            "hc-key": "ge",
            "value": 44
        },
        {
            "hc-key": "af",
            "value": 45
        },
        {
            "hc-key": "kp",
            "value": 46
        },
        {
            "hc-key": "lb",
            "value": 47
        },
        {
            "hc-key": "tw",
            "value": 48
        },
        {
            "hc-key": "lk",
            "value": 49
        },
        {
            "hc-key": "kg",
            "value": 50
        },
        {
            "hc-key": "bt",
            "value": 51
        },
        {
            "hc-key": "np",
            "value": 52
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/custom/asia.js">Asia</a>'
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
            mapData: Highcharts.maps['custom/asia'],
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
