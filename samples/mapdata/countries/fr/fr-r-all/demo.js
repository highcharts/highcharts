$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "fr-r-vd",
            "value": 0
        },
        {
            "hc-key": "fr-r-st",
            "value": 1
        },
        {
            "hc-key": "fr-r-ml",
            "value": 2
        },
        {
            "hc-key": "fr-r-my",
            "value": 3
        },
        {
            "hc-key": "fr-r-la",
            "value": 4
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/fr/fr-r-all.js">Pays de la Loire</a>'
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
            mapData: Highcharts.maps['countries/fr/fr-r-all'],
            joinBy: 'hc-key',
            name: 'Random data',
            states: {
                hover: {
                    color: '#a4edba'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });
});
