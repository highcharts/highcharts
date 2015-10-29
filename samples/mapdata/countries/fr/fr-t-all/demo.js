$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "fr-t-cm",
            "value": 0
        },
        {
            "hc-key": "fr-t-ds",
            "value": 1
        },
        {
            "hc-key": "fr-t-ct",
            "value": 2
        },
        {
            "hc-key": "fr-t-vn",
            "value": 3
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/fr/fr-t-all.js">Poitou-Charentes</a>'
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
            mapData: Highcharts.maps['countries/fr/fr-t-all'],
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
