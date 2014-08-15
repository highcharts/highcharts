$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "gy-de",
            "value": 0
        },
        {
            "hc-key": "gy-ma",
            "value": 1
        },
        {
            "hc-key": "gy-pt",
            "value": 2
        },
        {
            "hc-key": "gy-ut",
            "value": 3
        },
        {
            "hc-key": "gy-ud",
            "value": 4
        },
        {
            "hc-key": "gy-pm",
            "value": 5
        },
        {
            "hc-key": "gy-ba",
            "value": 6
        },
        {
            "hc-key": "gy-eb",
            "value": 7
        },
        {
            "hc-key": "gy-es",
            "value": 8
        },
        {
            "hc-key": "gy-cu",
            "value": 9
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/gy/gy-all.js">Guyana</a>'
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
            mapData: Highcharts.maps['countries/gy/gy-all'],
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
