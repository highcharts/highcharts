$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "rs-jc",
            "value": 0
        },
        {
            "hc-key": "rs-bg",
            "value": 1
        },
        {
            "hc-key": "rs-jn",
            "value": 2
        },
        {
            "hc-key": "rs-sd",
            "value": 3
        },
        {
            "hc-key": "rs-pi",
            "value": 4
        },
        {
            "hc-key": "rs-bo",
            "value": 5
        },
        {
            "hc-key": "rs-zl",
            "value": 6
        },
        {
            "hc-key": "rs-zc",
            "value": 7
        },
        {
            "hc-key": "rs-sc",
            "value": 8
        },
        {
            "hc-key": "rs-sn",
            "value": 9
        },
        {
            "hc-key": "rs-br",
            "value": 10
        },
        {
            "hc-key": "rs-sm",
            "value": 11
        },
        {
            "hc-key": "rs-mr",
            "value": 12
        },
        {
            "hc-key": "rs-ns",
            "value": 13
        },
        {
            "hc-key": "rs-pd",
            "value": 14
        },
        {
            "hc-key": "rs-pm",
            "value": 15
        },
        {
            "hc-key": "rs-rn",
            "value": 16
        },
        {
            "hc-key": "rs-rs",
            "value": 17
        },
        {
            "hc-key": "rs-to",
            "value": 18
        },
        {
            "hc-key": "rs-kb",
            "value": 19
        },
        {
            "hc-key": "rs-ma",
            "value": 20
        },
        {
            "hc-key": "rs-su",
            "value": 21
        },
        {
            "hc-key": "rs-pc",
            "value": 22
        },
        {
            "hc-key": "rs-ja",
            "value": 23
        },
        {
            "hc-key": "rs-zj",
            "value": 24
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/rs/rs-all.js">Republic of Serbia</a>'
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
            mapData: Highcharts.maps['countries/rs/rs-all'],
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
