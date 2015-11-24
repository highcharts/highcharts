$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "cn-3664",
            "value": 0
        },
        {
            "hc-key": "cn-fj",
            "value": 1
        },
        {
            "hc-key": "cn-gd",
            "value": 2
        },
        {
            "hc-key": "cn-sh",
            "value": 3
        },
        {
            "hc-key": "cn-zj",
            "value": 4
        },
        {
            "hc-key": "cn-3681",
            "value": 5
        },
        {
            "hc-key": "cn-3682",
            "value": 6
        },
        {
            "hc-key": "cn-6655",
            "value": 7
        },
        {
            "hc-key": "cn-6656",
            "value": 8
        },
        {
            "hc-key": "cn-6658",
            "value": 9
        },
        {
            "hc-key": "cn-6659",
            "value": 10
        },
        {
            "hc-key": "cn-6660",
            "value": 11
        },
        {
            "hc-key": "cn-6661",
            "value": 12
        },
        {
            "hc-key": "cn-6662",
            "value": 13
        },
        {
            "hc-key": "cn-6664",
            "value": 14
        },
        {
            "hc-key": "cn-6668",
            "value": 15
        },
        {
            "hc-key": "cn-nx",
            "value": 16
        },
        {
            "hc-key": "cn-sa",
            "value": 17
        },
        {
            "hc-key": "cn-cq",
            "value": 18
        },
        {
            "hc-key": "cn-ah",
            "value": 19
        },
        {
            "hc-key": "cn-hu",
            "value": 20
        },
        {
            "hc-key": "cn-6657",
            "value": 21
        },
        {
            "hc-key": "cn-6663",
            "value": 22
        },
        {
            "hc-key": "cn-6665",
            "value": 23
        },
        {
            "hc-key": "cn-6666",
            "value": 24
        },
        {
            "hc-key": "cn-6667",
            "value": 25
        },
        {
            "hc-key": "cn-6669",
            "value": 26
        },
        {
            "hc-key": "cn-6670",
            "value": 27
        },
        {
            "hc-key": "cn-6671",
            "value": 28
        },
        {
            "hc-key": "cn-xz",
            "value": 29
        },
        {
            "hc-key": "cn-yn",
            "value": 30
        },
        {
            "hc-key": "cn-bj",
            "value": 31
        },
        {
            "hc-key": "cn-hb",
            "value": 32
        },
        {
            "hc-key": "cn-sd",
            "value": 33
        },
        {
            "hc-key": "cn-tj",
            "value": 34
        },
        {
            "hc-key": "cn-gs",
            "value": 35
        },
        {
            "hc-key": "cn-jl",
            "value": 36
        },
        {
            "hc-key": "cn-xj",
            "value": 37
        },
        {
            "hc-key": "cn-sx",
            "value": 38
        },
        {
            "hc-key": "cn-nm",
            "value": 39
        },
        {
            "hc-key": "cn-hl",
            "value": 40
        },
        {
            "hc-key": "cn-gx",
            "value": 41
        },
        {
            "hc-key": "cn-ln",
            "value": 42
        },
        {
            "hc-key": "cn-ha",
            "value": 43
        },
        {
            "hc-key": "cn-js",
            "value": 44
        },
        {
            "hc-key": "cn-sc",
            "value": 45
        },
        {
            "hc-key": "cn-qh",
            "value": 46
        },
        {
            "hc-key": "cn-he",
            "value": 47
        },
        {
            "hc-key": "cn-gz",
            "value": 48
        },
        {
            "hc-key": "cn-hn",
            "value": 49
        },
        {
            "hc-key": "cn-jx",
            "value": 50
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/cn/custom/cn-all-sar.js">China with Hong Kong and Macau</a>'
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
            mapData: Highcharts.maps['countries/cn/custom/cn-all-sar'],
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
