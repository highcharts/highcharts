$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "fr-j-se",
            "value": 0
        },
        {
            "hc-key": "fr-j-hd",
            "value": 1
        },
        {
            "hc-key": "fr-j-ss",
            "value": 2
        },
        {
            "hc-key": "fr-j-es",
            "value": 3
        },
        {
            "hc-key": "fr-j-vo",
            "value": 4
        },
        {
            "hc-key": "fr-j-vp",
            "value": 5
        },
        {
            "hc-key": "fr-j-vm",
            "value": 6
        },
        {
            "hc-key": "fr-j-yv",
            "value": 7
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/fr/fr-j-all.js">Île-de-France</a>'
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
            mapData: Highcharts.maps['countries/fr/fr-j-all'],
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
