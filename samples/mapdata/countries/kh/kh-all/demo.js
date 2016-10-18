$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "kh-kk",
            "value": 0
        },
        {
            "hc-key": "kh-pp",
            "value": 1
        },
        {
            "hc-key": "kh-ka",
            "value": 2
        },
        {
            "hc-key": "kh-om",
            "value": 3
        },
        {
            "hc-key": "kh-ba",
            "value": 4
        },
        {
            "hc-key": "kh-po",
            "value": 5
        },
        {
            "hc-key": "kh-si",
            "value": 6
        },
        {
            "hc-key": "kh-oc",
            "value": 7
        },
        {
            "hc-key": "kh-pl",
            "value": 8
        },
        {
            "hc-key": "kh-km",
            "value": 9
        },
        {
            "hc-key": "kh-kg",
            "value": 10
        },
        {
            "hc-key": "kh-kn",
            "value": 11
        },
        {
            "hc-key": "kh-ks",
            "value": 12
        },
        {
            "hc-key": "kh-kt",
            "value": 13
        },
        {
            "hc-key": "kh-py",
            "value": 14
        },
        {
            "hc-key": "kh-ph",
            "value": 15
        },
        {
            "hc-key": "kh-st",
            "value": 16
        },
        {
            "hc-key": "kh-kh",
            "value": 17
        },
        {
            "hc-key": "kh-mk",
            "value": 18
        },
        {
            "hc-key": "kh-ro",
            "value": 19
        },
        {
            "hc-key": "kh-kp",
            "value": 20
        },
        {
            "hc-key": "kh-ke",
            "value": 21
        },
        {
            "hc-key": "kh-sr",
            "value": 22
        },
        {
            "hc-key": "kh-ta",
            "value": 23
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/kh/kh-all.js">Cambodia</a>'
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
            mapData: Highcharts.maps['countries/kh/kh-all'],
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
