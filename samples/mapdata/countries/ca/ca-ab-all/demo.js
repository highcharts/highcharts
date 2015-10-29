$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ca-ab-4813",
            "value": 0
        },
        {
            "hc-key": "ca-ab-4812",
            "value": 1
        },
        {
            "hc-key": "ca-ab-4801",
            "value": 2
        },
        {
            "hc-key": "ca-ab-4811",
            "value": 3
        },
        {
            "hc-key": "ca-ab-4802",
            "value": 4
        },
        {
            "hc-key": "ca-ab-4810",
            "value": 5
        },
        {
            "hc-key": "ca-ab-4803",
            "value": 6
        },
        {
            "hc-key": "ca-ab-4817",
            "value": 7
        },
        {
            "hc-key": "ca-ab-4819",
            "value": 8
        },
        {
            "hc-key": "ca-ab-4804",
            "value": 9
        },
        {
            "hc-key": "ca-ab-4816",
            "value": 10
        },
        {
            "hc-key": "ca-ab-4805",
            "value": 11
        },
        {
            "hc-key": "ca-ab-4815",
            "value": 12
        },
        {
            "hc-key": "ca-ab-4806",
            "value": 13
        },
        {
            "hc-key": "ca-ab-4814",
            "value": 14
        },
        {
            "hc-key": "ca-ab-4807",
            "value": 15
        },
        {
            "hc-key": "ca-ab-4808",
            "value": 16
        },
        {
            "hc-key": "ca-ab-4809",
            "value": 17
        },
        {
            "hc-key": "ca-ab-4818",
            "value": 18
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ca/ca-ab-all.js">Alberta</a>'
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
            mapData: Highcharts.maps['countries/ca/ca-ab-all'],
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
