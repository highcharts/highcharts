$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "fr-i-hn",
            "value": 0
        },
        {
            "hc-key": "fr-i-db",
            "value": 1
        },
        {
            "hc-key": "fr-i-tb",
            "value": 2
        },
        {
            "hc-key": "fr-i-ju",
            "value": 3
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/fr/fr-i-all.js">Franche-Comté</a>'
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
            mapData: Highcharts.maps['countries/fr/fr-i-all'],
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
