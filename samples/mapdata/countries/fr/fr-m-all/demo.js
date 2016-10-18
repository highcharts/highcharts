$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "fr-m-mm",
            "value": 0
        },
        {
            "hc-key": "fr-m-ms",
            "value": 1
        },
        {
            "hc-key": "fr-m-mo",
            "value": 2
        },
        {
            "hc-key": "fr-m-vg",
            "value": 3
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/fr/fr-m-all.js">Lorraine</a>'
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
            mapData: Highcharts.maps['countries/fr/fr-m-all'],
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
