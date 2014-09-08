$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "nl-fr-gm0058",
            "value": 0
        },
        {
            "hc-key": "nl-fr-gm0060",
            "value": 1
        },
        {
            "hc-key": "nl-fr-gm0093",
            "value": 2
        },
        {
            "hc-key": "nl-fr-gm0063",
            "value": 3
        },
        {
            "hc-key": "nl-fr-gm0079",
            "value": 4
        },
        {
            "hc-key": "nl-fr-gm1891",
            "value": 5
        },
        {
            "hc-key": "nl-fr-gm0072",
            "value": 6
        },
        {
            "hc-key": "nl-fr-gm1722",
            "value": 7
        },
        {
            "hc-key": "nl-fr-gm0088",
            "value": 8
        },
        {
            "hc-key": "nl-fr-gm0096",
            "value": 9
        },
        {
            "hc-key": "nl-fr-gm1900",
            "value": 10
        },
        {
            "hc-key": "nl-fr-gm0140",
            "value": 11
        },
        {
            "hc-key": "nl-fr-gm0070",
            "value": 12
        },
        {
            "hc-key": "nl-fr-gm0055",
            "value": 13
        },
        {
            "hc-key": "nl-fr-gm0051",
            "value": 14
        },
        {
            "hc-key": "nl-fr-gm0653",
            "value": 15
        },
        {
            "hc-key": "nl-fr-gm1908",
            "value": 16
        },
        {
            "hc-key": "nl-fr-gm0081",
            "value": 17
        },
        {
            "hc-key": "nl-fr-gm0737",
            "value": 18
        },
        {
            "hc-key": "nl-fr-gm0090",
            "value": 19
        },
        {
            "hc-key": "nl-fr-gm0082",
            "value": 20
        },
        {
            "hc-key": "nl-fr-gm0098",
            "value": 21
        },
        {
            "hc-key": "nl-fr-gm0080",
            "value": 22
        },
        {
            "hc-key": "nl-fr-gm0085",
            "value": 23
        },
        {
            "hc-key": "nl-fr-gm0059",
            "value": 24
        },
        {
            "hc-key": "nl-fr-gm0086",
            "value": 25
        },
        {
            "hc-key": "nl-fr-gm0074",
            "value": 26
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/nl/nl-fr-all.js">Friesland</a>'
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
            mapData: Highcharts.maps['countries/nl/nl-fr-all'],
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
