$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ee-6019",
            "value": 0
        },
        {
            "hc-key": "ee-ha",
            "value": 1
        },
        {
            "hc-key": "ee-ta",
            "value": 2
        },
        {
            "hc-key": "ee-hi",
            "value": 3
        },
        {
            "hc-key": "ee-ln",
            "value": 4
        },
        {
            "hc-key": "ee-pr",
            "value": 5
        },
        {
            "hc-key": "ee-sa",
            "value": 6
        },
        {
            "hc-key": "ee-iv",
            "value": 7
        },
        {
            "hc-key": "ee-jr",
            "value": 8
        },
        {
            "hc-key": "ee-jn",
            "value": 9
        },
        {
            "hc-key": "ee-lv",
            "value": 10
        },
        {
            "hc-key": "ee-pl",
            "value": 11
        },
        {
            "hc-key": "ee-ra",
            "value": 12
        },
        {
            "hc-key": "ee-vg",
            "value": 13
        },
        {
            "hc-key": "ee-vd",
            "value": 14
        },
        {
            "hc-key": "ee-vr",
            "value": 15
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ee/ee-all.js">Estonia</a>'
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
            mapData: Highcharts.maps['countries/ee/ee-all'],
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
