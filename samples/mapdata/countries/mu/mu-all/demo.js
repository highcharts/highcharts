$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "mu-6684",
            "value": 0
        },
        {
            "hc-key": "mu-6682",
            "value": 1
        },
        {
            "hc-key": "mu-6679",
            "value": 2
        },
        {
            "hc-key": "mu-6683",
            "value": 3
        },
        {
            "hc-key": "mu-6691",
            "value": 4
        },
        {
            "hc-key": "mu-6690",
            "value": 5
        },
        {
            "hc-key": "mu-90",
            "value": 6
        },
        {
            "hc-key": "mu-6689",
            "value": 7
        },
        {
            "hc-key": "mu-6692",
            "value": 8
        },
        {
            "hc-key": "mu-6680",
            "value": 9
        },
        {
            "hc-key": "mu-6686",
            "value": 10
        },
        {
            "hc-key": "mu-6685",
            "value": 11
        },
        {
            "hc-key": "mu-6693",
            "value": 12
        },
        {
            "hc-key": "mu-6681",
            "value": 13
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/mu/mu-all.js">Mauritius</a>'
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
            mapData: Highcharts.maps['countries/mu/mu-all'],
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
