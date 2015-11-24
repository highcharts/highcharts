$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "fr-n-hp",
            "value": 0
        },
        {
            "hc-key": "fr-n-ag",
            "value": 1
        },
        {
            "hc-key": "fr-n-ta",
            "value": 2
        },
        {
            "hc-key": "fr-n-tg",
            "value": 3
        },
        {
            "hc-key": "fr-n-av",
            "value": 4
        },
        {
            "hc-key": "fr-n-hg",
            "value": 5
        },
        {
            "hc-key": "fr-n-ge",
            "value": 6
        },
        {
            "hc-key": "fr-n-lo",
            "value": 7
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/fr/fr-n-all.js">Midi-Pyrénées</a>'
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
            mapData: Highcharts.maps['countries/fr/fr-n-all'],
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
