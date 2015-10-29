$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "fr-d-sl",
            "value": 0
        },
        {
            "hc-key": "fr-d-ni",
            "value": 1
        },
        {
            "hc-key": "fr-d-yo",
            "value": 2
        },
        {
            "hc-key": "fr-d-co",
            "value": 3
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/fr/fr-d-all.js">Bourgogne</a>'
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
            mapData: Highcharts.maps['countries/fr/fr-d-all'],
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
