$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ir-5428",
            "value": 0
        },
        {
            "hc-key": "ir-hg",
            "value": 1
        },
        {
            "hc-key": "ir-bs",
            "value": 2
        },
        {
            "hc-key": "ir-kb",
            "value": 3
        },
        {
            "hc-key": "ir-fa",
            "value": 4
        },
        {
            "hc-key": "ir-es",
            "value": 5
        },
        {
            "hc-key": "ir-sm",
            "value": 6
        },
        {
            "hc-key": "ir-go",
            "value": 7
        },
        {
            "hc-key": "ir-mn",
            "value": 8
        },
        {
            "hc-key": "ir-th",
            "value": 9
        },
        {
            "hc-key": "ir-mk",
            "value": 10
        },
        {
            "hc-key": "ir-ya",
            "value": 11
        },
        {
            "hc-key": "ir-cm",
            "value": 12
        },
        {
            "hc-key": "ir-kz",
            "value": 13
        },
        {
            "hc-key": "ir-lo",
            "value": 14
        },
        {
            "hc-key": "ir-il",
            "value": 15
        },
        {
            "hc-key": "ir-ar",
            "value": 16
        },
        {
            "hc-key": "ir-qm",
            "value": 17
        },
        {
            "hc-key": "ir-hd",
            "value": 18
        },
        {
            "hc-key": "ir-za",
            "value": 19
        },
        {
            "hc-key": "ir-qz",
            "value": 20
        },
        {
            "hc-key": "ir-wa",
            "value": 21
        },
        {
            "hc-key": "ir-ea",
            "value": 22
        },
        {
            "hc-key": "ir-bk",
            "value": 23
        },
        {
            "hc-key": "ir-gi",
            "value": 24
        },
        {
            "hc-key": "ir-kd",
            "value": 25
        },
        {
            "hc-key": "ir-kj",
            "value": 26
        },
        {
            "hc-key": "ir-kv",
            "value": 27
        },
        {
            "hc-key": "ir-ks",
            "value": 28
        },
        {
            "hc-key": "ir-sb",
            "value": 29
        },
        {
            "hc-key": "ir-ke",
            "value": 30
        },
        {
            "hc-key": "ir-al",
            "value": 31
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ir/ir-all.js">Iran</a>'
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
            mapData: Highcharts.maps['countries/ir/ir-all'],
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
