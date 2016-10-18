$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "fr-t",
            "value": 0
        },
        {
            "hc-key": "fr-e",
            "value": 1
        },
        {
            "hc-key": "fr-r",
            "value": 2
        },
        {
            "hc-key": "fr-u",
            "value": 3
        },
        {
            "hc-key": "fr-n",
            "value": 4
        },
        {
            "hc-key": "fr-p",
            "value": 5
        },
        {
            "hc-key": "fr-o",
            "value": 6
        },
        {
            "hc-key": "fr-v",
            "value": 7
        },
        {
            "hc-key": "fr-s",
            "value": 8
        },
        {
            "hc-key": "fr-g",
            "value": 9
        },
        {
            "hc-key": "fr-k",
            "value": 10
        },
        {
            "hc-key": "fr-a",
            "value": 11
        },
        {
            "hc-key": "fr-c",
            "value": 12
        },
        {
            "hc-key": "fr-f",
            "value": 13
        },
        {
            "hc-key": "fr-l",
            "value": 14
        },
        {
            "hc-key": "fr-d",
            "value": 15
        },
        {
            "hc-key": "fr-b",
            "value": 16
        },
        {
            "hc-key": "fr-i",
            "value": 17
        },
        {
            "hc-key": "fr-q",
            "value": 18
        },
        {
            "hc-key": "fr-j",
            "value": 19
        },
        {
            "hc-key": "fr-m",
            "value": 20
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/fr/custom/fr-all-mainland.js">France, mainland</a>'
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
            mapData: Highcharts.maps['countries/fr/custom/fr-all-mainland'],
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
