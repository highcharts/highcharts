$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "fr-e-fi",
            "value": 0
        },
        {
            "hc-key": "fr-e-mb",
            "value": 1
        },
        {
            "hc-key": "fr-e-ca",
            "value": 2
        },
        {
            "hc-key": "fr-e-iv",
            "value": 3
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/fr/fr-e-all.js">Bretagne</a>'
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
            mapData: Highcharts.maps['countries/fr/fr-e-all'],
            joinBy: 'hc-key',
            name: 'Random data',
            states: {
                hover: {
                    color: '#a4edba'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });
});
