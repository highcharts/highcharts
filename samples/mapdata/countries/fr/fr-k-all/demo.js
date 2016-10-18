$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "fr-k-lz",
            "value": 0
        },
        {
            "hc-key": "fr-k-ad",
            "value": 1
        },
        {
            "hc-key": "fr-k-he",
            "value": 2
        },
        {
            "hc-key": "fr-k-ga",
            "value": 3
        },
        {
            "hc-key": "fr-k-po",
            "value": 4
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/fr/fr-k-all.js">Languedoc-Roussillon</a>'
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
            mapData: Highcharts.maps['countries/fr/fr-k-all'],
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
