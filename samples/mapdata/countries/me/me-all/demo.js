$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "me-an",
            "value": 0
        },
        {
            "hc-key": "me-be",
            "value": 1
        },
        {
            "hc-key": "me-bp",
            "value": 2
        },
        {
            "hc-key": "me-kl",
            "value": 3
        },
        {
            "hc-key": "me-da",
            "value": 4
        },
        {
            "hc-key": "me-mk",
            "value": 5
        },
        {
            "hc-key": "me-nk",
            "value": 6
        },
        {
            "hc-key": "me-pu",
            "value": 7
        },
        {
            "hc-key": "me-pl",
            "value": 8
        },
        {
            "hc-key": "me-pg",
            "value": 9
        },
        {
            "hc-key": "me-ti",
            "value": 10
        },
        {
            "hc-key": "me-sa",
            "value": 11
        },
        {
            "hc-key": "me-za",
            "value": 12
        },
        {
            "hc-key": "me-ba",
            "value": 13
        },
        {
            "hc-key": "me-ce",
            "value": 14
        },
        {
            "hc-key": "me-bu",
            "value": 15
        },
        {
            "hc-key": "me-ul",
            "value": 16
        },
        {
            "hc-key": "me-ro",
            "value": 17
        },
        {
            "hc-key": "me-pv",
            "value": 18
        },
        {
            "hc-key": "me-hn",
            "value": 19
        },
        {
            "hc-key": "me-kt",
            "value": 20
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/me/me-all.js">Montenegro</a>'
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
            mapData: Highcharts.maps['countries/me/me-all'],
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
