$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ar-tf",
            "value": 0
        },
        {
            "hc-key": "ar-ba",
            "value": 1
        },
        {
            "hc-key": "ar-sj",
            "value": 2
        },
        {
            "hc-key": "ar-mz",
            "value": 3
        },
        {
            "hc-key": "ar-nq",
            "value": 4
        },
        {
            "hc-key": "ar-lp",
            "value": 5
        },
        {
            "hc-key": "ar-rn",
            "value": 6
        },
        {
            "hc-key": "ar-sl",
            "value": 7
        },
        {
            "hc-key": "ar-cb",
            "value": 8
        },
        {
            "hc-key": "ar-ct",
            "value": 9
        },
        {
            "hc-key": "ar-lr",
            "value": 10
        },
        {
            "hc-key": "ar-sa",
            "value": 11
        },
        {
            "hc-key": "ar-se",
            "value": 12
        },
        {
            "hc-key": "ar-tm",
            "value": 13
        },
        {
            "hc-key": "ar-cc",
            "value": 14
        },
        {
            "hc-key": "ar-fm",
            "value": 15
        },
        {
            "hc-key": "ar-cn",
            "value": 16
        },
        {
            "hc-key": "ar-er",
            "value": 17
        },
        {
            "hc-key": "ar-ch",
            "value": 18
        },
        {
            "hc-key": "ar-sf",
            "value": 19
        },
        {
            "hc-key": "ar-mn",
            "value": 20
        },
        {
            "hc-key": "ar-df",
            "value": 21
        },
        {
            "hc-key": "ar-sc",
            "value": 22
        },
        {
            "hc-key": "ar-jy",
            "value": 23
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ar/ar-all.js">Argentina</a>'
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
            mapData: Highcharts.maps['countries/ar/ar-all'],
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
