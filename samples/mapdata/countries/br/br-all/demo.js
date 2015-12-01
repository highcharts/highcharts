$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "br-sp",
            "value": 0
        },
        {
            "hc-key": "br-ma",
            "value": 1
        },
        {
            "hc-key": "br-pa",
            "value": 2
        },
        {
            "hc-key": "br-sc",
            "value": 3
        },
        {
            "hc-key": "br-ba",
            "value": 4
        },
        {
            "hc-key": "br-ap",
            "value": 5
        },
        {
            "hc-key": "br-ms",
            "value": 6
        },
        {
            "hc-key": "br-mg",
            "value": 7
        },
        {
            "hc-key": "br-go",
            "value": 8
        },
        {
            "hc-key": "br-rs",
            "value": 9
        },
        {
            "hc-key": "br-to",
            "value": 10
        },
        {
            "hc-key": "br-pi",
            "value": 11
        },
        {
            "hc-key": "br-al",
            "value": 12
        },
        {
            "hc-key": "br-pb",
            "value": 13
        },
        {
            "hc-key": "br-ce",
            "value": 14
        },
        {
            "hc-key": "br-se",
            "value": 15
        },
        {
            "hc-key": "br-rr",
            "value": 16
        },
        {
            "hc-key": "br-pe",
            "value": 17
        },
        {
            "hc-key": "br-pr",
            "value": 18
        },
        {
            "hc-key": "br-es",
            "value": 19
        },
        {
            "hc-key": "br-rj",
            "value": 20
        },
        {
            "hc-key": "br-rn",
            "value": 21
        },
        {
            "hc-key": "br-am",
            "value": 22
        },
        {
            "hc-key": "br-mt",
            "value": 23
        },
        {
            "hc-key": "br-df",
            "value": 24
        },
        {
            "hc-key": "br-ac",
            "value": 25
        },
        {
            "hc-key": "br-ro",
            "value": 26
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/br/br-all.js">Brazil</a>'
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
            mapData: Highcharts.maps['countries/br/br-all'],
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
