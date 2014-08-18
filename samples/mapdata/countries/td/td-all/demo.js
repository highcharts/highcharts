$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "td-oa",
            "value": 0
        },
        {
            "hc-key": "td-lr",
            "value": 1
        },
        {
            "hc-key": "td-me",
            "value": 2
        },
        {
            "hc-key": "td-ta",
            "value": 3
        },
        {
            "hc-key": "td-lo",
            "value": 4
        },
        {
            "hc-key": "td-ma",
            "value": 5
        },
        {
            "hc-key": "td-gr",
            "value": 6
        },
        {
            "hc-key": "td-sa",
            "value": 7
        },
        {
            "hc-key": "td-nj",
            "value": 8
        },
        {
            "hc-key": "td-mw",
            "value": 9
        },
        {
            "hc-key": "td-br",
            "value": 10
        },
        {
            "hc-key": "td-ti",
            "value": 11
        },
        {
            "hc-key": "td-en",
            "value": 12
        },
        {
            "hc-key": "td-cg",
            "value": 13
        },
        {
            "hc-key": "td-bg",
            "value": 14
        },
        {
            "hc-key": "td-si",
            "value": 15
        },
        {
            "hc-key": "td-mo",
            "value": 16
        },
        {
            "hc-key": "td-hd",
            "value": 17
        },
        {
            "hc-key": "td-km",
            "value": 18
        },
        {
            "hc-key": "td-lc",
            "value": 19
        },
        {
            "hc-key": "td-bi",
            "value": 20
        },
        {
            "hc-key": "td-ba",
            "value": 21
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/td/td-all.js">Chad</a>'
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
            mapData: Highcharts.maps['countries/td/td-all'],
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
