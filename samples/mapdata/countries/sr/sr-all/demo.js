$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "sr-ni",
            "value": 0
        },
        {
            "hc-key": "sr-ma",
            "value": 1
        },
        {
            "hc-key": "sr-pr",
            "value": 2
        },
        {
            "hc-key": "sr-br",
            "value": 3
        },
        {
            "hc-key": "sr-si",
            "value": 4
        },
        {
            "hc-key": "sr-cm",
            "value": 5
        },
        {
            "hc-key": "sr-cr",
            "value": 6
        },
        {
            "hc-key": "sr-pm",
            "value": 7
        },
        {
            "hc-key": "sr-sa",
            "value": 8
        },
        {
            "hc-key": "sr-wa",
            "value": 9
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/sr/sr-all.js">Suriname</a>'
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
            mapData: Highcharts.maps['countries/sr/sr-all'],
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
