$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "fr-v-ai",
            "value": 0
        },
        {
            "hc-key": "fr-v-hs",
            "value": 1
        },
        {
            "hc-key": "fr-v-sv",
            "value": 2
        },
        {
            "hc-key": "fr-v-dm",
            "value": 3
        },
        {
            "hc-key": "fr-v-ah",
            "value": 4
        },
        {
            "hc-key": "fr-v-is",
            "value": 5
        },
        {
            "hc-key": "fr-v-lr",
            "value": 6
        },
        {
            "hc-key": "fr-v-rh",
            "value": 7
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/fr/fr-v-all.js">Rhône-Alpes</a>'
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
            mapData: Highcharts.maps['countries/fr/fr-v-all'],
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
