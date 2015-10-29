$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "dm-lu",
            "value": 0
        },
        {
            "hc-key": "dm-ma",
            "value": 1
        },
        {
            "hc-key": "dm-pk",
            "value": 2
        },
        {
            "hc-key": "dm-da",
            "value": 3
        },
        {
            "hc-key": "dm-pl",
            "value": 4
        },
        {
            "hc-key": "dm-pr",
            "value": 5
        },
        {
            "hc-key": "dm-an",
            "value": 6
        },
        {
            "hc-key": "dm-go",
            "value": 7
        },
        {
            "hc-key": "dm-jn",
            "value": 8
        },
        {
            "hc-key": "dm-jh",
            "value": 9
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/dm/dm-all.js">Dominica</a>'
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
            mapData: Highcharts.maps['countries/dm/dm-all'],
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
