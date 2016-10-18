$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "nl-dr-gm1680",
            "value": 0
        },
        {
            "hc-key": "nl-dr-gm1699",
            "value": 1
        },
        {
            "hc-key": "nl-dr-gm0106",
            "value": 2
        },
        {
            "hc-key": "nl-dr-gm0118",
            "value": 3
        },
        {
            "hc-key": "nl-dr-gm0109",
            "value": 4
        },
        {
            "hc-key": "nl-dr-gm1701",
            "value": 5
        },
        {
            "hc-key": "nl-dr-gm1731",
            "value": 6
        },
        {
            "hc-key": "nl-dr-gm1681",
            "value": 7
        },
        {
            "hc-key": "nl-dr-gm1690",
            "value": 8
        },
        {
            "hc-key": "nl-dr-gm0114",
            "value": 9
        },
        {
            "hc-key": "nl-dr-gm0119",
            "value": 10
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/nl/nl-dr-all.js">Drenthe</a>'
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
            mapData: Highcharts.maps['countries/nl/nl-dr-all'],
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
