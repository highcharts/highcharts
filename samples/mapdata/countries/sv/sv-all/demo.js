$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "sv-un",
            "value": 0
        },
        {
            "hc-key": "sv-ah",
            "value": 1
        },
        {
            "hc-key": "sv-ca",
            "value": 2
        },
        {
            "hc-key": "sv-cu",
            "value": 3
        },
        {
            "hc-key": "sv-li",
            "value": 4
        },
        {
            "hc-key": "sv-pa",
            "value": 5
        },
        {
            "hc-key": "sv-so",
            "value": 6
        },
        {
            "hc-key": "sv-ss",
            "value": 7
        },
        {
            "hc-key": "sv-mo",
            "value": 8
        },
        {
            "hc-key": "sv-sm",
            "value": 9
        },
        {
            "hc-key": "sv-sv",
            "value": 10
        },
        {
            "hc-key": "sv-us",
            "value": 11
        },
        {
            "hc-key": "sv-ch",
            "value": 12
        },
        {
            "hc-key": "sv-sa",
            "value": 13
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/sv/sv-all.js">El Salvador</a>'
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
            mapData: Highcharts.maps['countries/sv/sv-all'],
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
