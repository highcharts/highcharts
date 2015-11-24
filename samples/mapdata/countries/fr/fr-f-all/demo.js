$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "fr-f-in",
            "value": 0
        },
        {
            "hc-key": "fr-f-il",
            "value": 1
        },
        {
            "hc-key": "fr-f-el",
            "value": 2
        },
        {
            "hc-key": "fr-f-lc",
            "value": 3
        },
        {
            "hc-key": "fr-f-ch",
            "value": 4
        },
        {
            "hc-key": "fr-f-lt",
            "value": 5
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/fr/fr-f-all.js">Centre</a>'
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
            mapData: Highcharts.maps['countries/fr/fr-f-all'],
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
