$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "pg-4773",
            "value": 0
        },
        {
            "hc-key": "pg-es",
            "value": 1
        },
        {
            "hc-key": "pg-md",
            "value": 2
        },
        {
            "hc-key": "pg-ns",
            "value": 3
        },
        {
            "hc-key": "pg-we",
            "value": 4
        },
        {
            "hc-key": "pg-en",
            "value": 5
        },
        {
            "hc-key": "pg-mn",
            "value": 6
        },
        {
            "hc-key": "pg-mb",
            "value": 7
        },
        {
            "hc-key": "pg-mr",
            "value": 8
        },
        {
            "hc-key": "pg-ni",
            "value": 9
        },
        {
            "hc-key": "pg-wn",
            "value": 10
        },
        {
            "hc-key": "pg-eh",
            "value": 11
        },
        {
            "hc-key": "pg-gu",
            "value": 12
        },
        {
            "hc-key": "pg-eg",
            "value": 13
        },
        {
            "hc-key": "pg-ch",
            "value": 14
        },
        {
            "hc-key": "pg-1041",
            "value": 15
        },
        {
            "hc-key": "pg-ce",
            "value": 16
        },
        {
            "hc-key": "pg-no",
            "value": 17
        },
        {
            "hc-key": "pg-sa",
            "value": 18
        },
        {
            "hc-key": "pg-sh",
            "value": 19
        },
        {
            "hc-key": "pg-wh",
            "value": 20
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/pg/pg-all.js">Papua New Guinea</a>'
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
            mapData: Highcharts.maps['countries/pg/pg-all'],
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
