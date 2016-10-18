$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "fr-b-lg",
            "value": 0
        },
        {
            "hc-key": "fr-b-dd",
            "value": 1
        },
        {
            "hc-key": "fr-b-gi",
            "value": 2
        },
        {
            "hc-key": "fr-b-ld",
            "value": 3
        },
        {
            "hc-key": "fr-b-pa",
            "value": 4
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/fr/fr-b-all.js">Aquitaine</a>'
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
            mapData: Highcharts.maps['countries/fr/fr-b-all'],
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
