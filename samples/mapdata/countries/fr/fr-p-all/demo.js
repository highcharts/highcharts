$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "fr-p-cv",
            "value": 0
        },
        {
            "hc-key": "fr-p-mh",
            "value": 1
        },
        {
            "hc-key": "fr-p-or",
            "value": 2
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/fr/fr-p-all.js">Basse-Normandie</a>'
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
            mapData: Highcharts.maps['countries/fr/fr-p-all'],
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
