$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "fr-g-an",
            "value": 0
        },
        {
            "hc-key": "fr-g-mr",
            "value": 1
        },
        {
            "hc-key": "fr-g-ab",
            "value": 2
        },
        {
            "hc-key": "fr-g-hm",
            "value": 3
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/fr/fr-g-all.js">Champagne-Ardenne</a>'
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
            mapData: Highcharts.maps['countries/fr/fr-g-all'],
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
