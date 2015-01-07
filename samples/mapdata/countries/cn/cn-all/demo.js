$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "cn-3664",
            "value": 0
        },
        {
            "hc-key": "cn-sh",
            "value": 1
        },
        {
            "hc-key": "cn-zj",
            "value": 2
        },
        {
            "hc-key": "cn-ha",
            "value": 3
        },
        {
            "hc-key": "cn-xz",
            "value": 4
        },
        {
            "hc-key": "cn-yn",
            "value": 5
        },
        {
            "hc-key": "cn-ah",
            "value": 6
        },
        {
            "hc-key": "cn-hu",
            "value": 7
        },
        {
            "hc-key": "cn-sa",
            "value": 8
        },
        {
            "hc-key": "cn-cq",
            "value": 9
        },
        {
            "hc-key": "cn-gz",
            "value": 10
        },
        {
            "hc-key": "cn-hn",
            "value": 11
        },
        {
            "hc-key": "cn-sc",
            "value": 12
        },
        {
            "hc-key": "cn-sx",
            "value": 13
        },
        {
            "hc-key": "cn-he",
            "value": 14
        },
        {
            "hc-key": "cn-jx",
            "value": 15
        },
        {
            "hc-key": "cn-nm",
            "value": 16
        },
        {
            "hc-key": "cn-gx",
            "value": 17
        },
        {
            "hc-key": "cn-hl",
            "value": 18
        },
        {
            "hc-key": "cn-fj",
            "value": 19
        },
        {
            "hc-key": "cn-gd",
            "value": 20
        },
        {
            "hc-key": "cn-bj",
            "value": 21
        },
        {
            "hc-key": "cn-hb",
            "value": 22
        },
        {
            "hc-key": "cn-ln",
            "value": 23
        },
        {
            "hc-key": "cn-sd",
            "value": 24
        },
        {
            "hc-key": "cn-tj",
            "value": 25
        },
        {
            "hc-key": "cn-js",
            "value": 26
        },
        {
            "hc-key": "cn-qh",
            "value": 27
        },
        {
            "hc-key": "cn-gs",
            "value": 28
        },
        {
            "hc-key": "cn-xj",
            "value": 29
        },
        {
            "hc-key": "cn-jl",
            "value": 30
        },
        {
            "hc-key": "cn-nx",
            "value": 31
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/cn/cn-all.js">China</a>'
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
            mapData: Highcharts.maps['countries/cn/cn-all'],
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
