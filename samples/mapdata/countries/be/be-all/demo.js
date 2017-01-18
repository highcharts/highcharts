$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "be-3530",
            "value": 0
        },
        {
            "hc-key": "be-3527",
            "value": 1
        },
        {
            "hc-key": "be-3532",
            "value": 2
        },
        {
            "hc-key": "be-3533",
            "value": 3
        },
        {
            "hc-key": "be-3534",
            "value": 4
        },
        {
            "hc-key": "be-3535",
            "value": 5
        },
        {
            "hc-key": "be-3528",
            "value": 6
        },
        {
            "hc-key": "be-3529",
            "value": 7
        },
        {
            "hc-key": "be-489",
            "value": 8
        },
        {
            "hc-key": "be-490",
            "value": 9
        },
        {
            "hc-key": "be-3526",
            "value": 10
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/be/be-all.js">Belgium</a>'
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
            mapData: Highcharts.maps['countries/be/be-all'],
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
