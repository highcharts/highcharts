$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "fr-c-cl",
            "value": 0
        },
        {
            "hc-key": "fr-c-al",
            "value": 1
        },
        {
            "hc-key": "fr-c-pd",
            "value": 2
        },
        {
            "hc-key": "fr-c-hl",
            "value": 3
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/fr/fr-c-all.js">Auvergne</a>'
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
            mapData: Highcharts.maps['countries/fr/fr-c-all'],
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
