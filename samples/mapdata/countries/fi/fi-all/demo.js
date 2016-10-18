$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "fi-3280",
            "value": 0
        },
        {
            "hc-key": "fi-3272",
            "value": 1
        },
        {
            "hc-key": "fi-3275",
            "value": 2
        },
        {
            "hc-key": "fi-3281",
            "value": 3
        },
        {
            "hc-key": "fi-3279",
            "value": 4
        },
        {
            "hc-key": "fi-3276",
            "value": 5
        },
        {
            "hc-key": "fi-3287",
            "value": 6
        },
        {
            "hc-key": "fi-3286",
            "value": 7
        },
        {
            "hc-key": "fi-3290",
            "value": 8
        },
        {
            "hc-key": "fi-3291",
            "value": 9
        },
        {
            "hc-key": "fi-3292",
            "value": 10
        },
        {
            "hc-key": "fi-3293",
            "value": 11
        },
        {
            "hc-key": "fi-3294",
            "value": 12
        },
        {
            "hc-key": "fi-3295",
            "value": 13
        },
        {
            "hc-key": "fi-3296",
            "value": 14
        },
        {
            "hc-key": "fi-3288",
            "value": 15
        },
        {
            "hc-key": "fi-3285",
            "value": 16
        },
        {
            "hc-key": "fi-3289",
            "value": 17
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/fi/fi-all.js">Finland</a>'
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
            mapData: Highcharts.maps['countries/fi/fi-all'],
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
