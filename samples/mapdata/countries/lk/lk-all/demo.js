$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "lk-bc",
            "value": 0
        },
        {
            "hc-key": "lk-mb",
            "value": 1
        },
        {
            "hc-key": "lk-ja",
            "value": 2
        },
        {
            "hc-key": "lk-kl",
            "value": 3
        },
        {
            "hc-key": "lk-ky",
            "value": 4
        },
        {
            "hc-key": "lk-mt",
            "value": 5
        },
        {
            "hc-key": "lk-nw",
            "value": 6
        },
        {
            "hc-key": "lk-ap",
            "value": 7
        },
        {
            "hc-key": "lk-pr",
            "value": 8
        },
        {
            "hc-key": "lk-tc",
            "value": 9
        },
        {
            "hc-key": "lk-ad",
            "value": 10
        },
        {
            "hc-key": "lk-va",
            "value": 11
        },
        {
            "hc-key": "lk-mp",
            "value": 12
        },
        {
            "hc-key": "lk-kg",
            "value": 13
        },
        {
            "hc-key": "lk-px",
            "value": 14
        },
        {
            "hc-key": "lk-rn",
            "value": 15
        },
        {
            "hc-key": "lk-gl",
            "value": 16
        },
        {
            "hc-key": "lk-hb",
            "value": 17
        },
        {
            "hc-key": "lk-mh",
            "value": 18
        },
        {
            "hc-key": "lk-bd",
            "value": 19
        },
        {
            "hc-key": "lk-mj",
            "value": 20
        },
        {
            "hc-key": "lk-ke",
            "value": 21
        },
        {
            "hc-key": "lk-co",
            "value": 22
        },
        {
            "hc-key": "lk-gq",
            "value": 23
        },
        {
            "hc-key": "lk-kt",
            "value": 24
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/lk/lk-all.js">Sri Lanka</a>'
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
            mapData: Highcharts.maps['countries/lk/lk-all'],
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
