$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "fr-u-am",
            "value": 0
        },
        {
            "hc-key": "fr-u-vr",
            "value": 1
        },
        {
            "hc-key": "fr-u-vc",
            "value": 2
        },
        {
            "hc-key": "fr-u-ap",
            "value": 3
        },
        {
            "hc-key": "fr-u-ha",
            "value": 4
        },
        {
            "hc-key": "fr-u-bd",
            "value": 5
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/fr/fr-u-all.js">Provence-Alpes-Côte-d'Azur</a>'
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
            mapData: Highcharts.maps['countries/fr/fr-u-all'],
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
