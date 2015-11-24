$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "mg-987",
            "value": 0
        },
        {
            "hc-key": "mg-993",
            "value": 1
        },
        {
            "hc-key": "mg-7296",
            "value": 2
        },
        {
            "hc-key": "mg-7287",
            "value": 3
        },
        {
            "hc-key": "mg-997",
            "value": 4
        },
        {
            "hc-key": "mg-7285",
            "value": 5
        },
        {
            "hc-key": "mg-7289",
            "value": 6
        },
        {
            "hc-key": "mg-7283",
            "value": 7
        },
        {
            "hc-key": "mg-7290",
            "value": 8
        },
        {
            "hc-key": "mg-7292",
            "value": 9
        },
        {
            "hc-key": "mg-7297",
            "value": 10
        },
        {
            "hc-key": "mg-7294",
            "value": 11
        },
        {
            "hc-key": "mg-7286",
            "value": 12
        },
        {
            "hc-key": "mg-995",
            "value": 13
        },
        {
            "hc-key": "mg-994",
            "value": 14
        },
        {
            "hc-key": "mg-996",
            "value": 15
        },
        {
            "hc-key": "mg-7293",
            "value": 16
        },
        {
            "hc-key": "mg-7284",
            "value": 17
        },
        {
            "hc-key": "mg-7298",
            "value": 18
        },
        {
            "hc-key": "mg-7295",
            "value": 19
        },
        {
            "hc-key": "mg-7288",
            "value": 20
        },
        {
            "hc-key": "mg-7291",
            "value": 21
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/mg/mg-all.js">Madagascar</a>'
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
            mapData: Highcharts.maps['countries/mg/mg-all'],
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
